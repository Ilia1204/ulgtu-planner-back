import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { hash } from 'argon2'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { EmploymentInfoService } from 'src/employment-info/employment-info.service'
import { PrismaService } from 'src/prisma.service'
import { StudentInfoService } from 'src/student-info/student-info.service'
import { returnUserObject } from './return-user.object'
import { UserDto } from './user.dto'

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private studentInfoService: StudentInfoService,
		private employmentInfoService: EmploymentInfoService
	) {}

	async findById(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id }
		})
		if (!user) throw new NotFoundException('Пользователь не найден')

		return user
	}

	getById(id: string, selectObject: Prisma.UserSelect = {}) {
		return this.prisma.user.findUnique({
			where: { id },
			select: { ...returnUserObject, ...selectObject }
		})
	}

	private async search(searchTerm: string) {
		return this.prisma.user.findMany({
			where: {
				OR: [
					{
						email: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					},
					{
						username: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					},
					{
						fullName: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					},
					{
						phoneNumber: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				]
			}
		})
	}

	async getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email
			}
		})
	}

	async getByUsername(username: string) {
		return this.prisma.user.findUnique({
			where: { username }
		})
	}

	async getByEmailOrUsername(email: string, username?: string) {
		return this.prisma.user.findFirst({
			where: {
				OR: [{ email }, { username }]
			}
		})
	}

	async getByCreditCardNumber(creditCardNumber: string) {
		return await this.prisma.user.findFirst({
			where: { studentInfo: { creditCardNumber } },
			include: { studentInfo: true, employmentInfo: true }
		})
	}

	getAll(searchTerm?: string) {
		if (searchTerm) return this.search(searchTerm)

		return this.prisma.user.findMany({
			orderBy: { createdAt: 'desc' }
		})
	}

	async create(dto: AuthDto) {
		const hashedPassword = await hash(dto.password)

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				fullName: dto.fullName,
				username: dto.username,
				libraryCardNumber: dto.libraryCardNumber,
				roles: dto.roles,
				password: hashedPassword
			}
		})

		if (user.roles.includes('assistant')) {
			await this.employmentInfoService.create(user.id)
			await this.studentInfoService.create(user.id)
		} else if (user.roles.includes('student') || user.roles.includes('admin'))
			await this.studentInfoService.create(user.id)
		else if (
			user.roles.includes('teacher') &&
			user.roles.includes('course_creator')
		)
			await this.employmentInfoService.create(user.id)

		return user
	}

	async update(id: string, dto: UserDto) {
		const isSameUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})

		if (isSameUser && id !== isSameUser.id)
			throw new BadRequestException('Данный email уже занят')

		return this.prisma.user.update({
			where: { id },
			data: dto,
			select: { ...returnUserObject }
		})
	}

	async delete(id: string) {
		await this.findById(id)

		return this.prisma.user.delete({
			where: { id }
		})
	}
}
