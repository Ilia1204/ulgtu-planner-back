import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { generateCreditCardNumber } from 'src/utils/generate-credit-card-number'
import { returnStudentInfoObject } from './return-student-info.object'
import { UpdateStudentInfo } from './student-info.dto'

@Injectable()
export class StudentInfoService {
	constructor(private prisma: PrismaService) {}

	getById(id: string) {
		const studentInfo = this.prisma.studentInfo.findUnique({
			where: { id },
			select: {
				...returnStudentInfoObject
			}
		})

		if (!studentInfo)
			throw new NotFoundException('Информация о студенте не найдена')

		return studentInfo
	}

	getByUserId(id: string) {
		return this.prisma.studentInfo.findUnique({
			where: { userId: id },
			select: {
				...returnStudentInfoObject
			}
		})
	}

	async getByCreditCardNumber(creditCardNumber: string) {
		return await this.prisma.studentInfo.findUnique({
			where: { creditCardNumber },
			select: { ...returnStudentInfoObject }
		})
	}

	getAll() {
		return this.prisma.studentInfo.findMany({
			orderBy: {
				user: { fullName: 'asc' }
			},
			select: { ...returnStudentInfoObject }
		})
	}

	async create(userId: string) {
		const creditCardNumber = generateCreditCardNumber()

		return this.prisma.studentInfo.create({
			data: {
				studyForm: 'full_time',
				creditCardNumber,
				educationLevel: 'bachelor',
				fundingSource: 'budget',
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
	}

	async update(id: string, dto: UpdateStudentInfo) {
		await this.getById(id)

		return this.prisma.studentInfo.update({
			where: { id },
			data: {
				studyForm: dto.studyForm,
				educationLevel: dto.educationLevel,
				fundingSource: dto.findingSource
			}
		})
	}
}