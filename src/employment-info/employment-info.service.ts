import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class EmploymentInfoService {
	constructor(private prisma: PrismaService) {}

	getById(id: string) {
		return this.prisma.employmentInfo.findUnique({
			where: { id }
		})
	}

	getByUserId(id: string) {
		return this.prisma.employmentInfo.findUnique({
			where: { userId: id }
		})
	}

	getAll() {
		return this.prisma.employmentInfo.findMany({
			orderBy: {
				createdAt: 'desc'
			}
		})
	}

	async create(userId: string) {
		return this.prisma.employmentInfo.create({
			data: {
				position: '',
				education: '',
				workExperience: 0,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
	}
}
