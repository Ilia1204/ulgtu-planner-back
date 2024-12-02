import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { returnEmploymentInfoObject } from './return-employment-info.object'

@Injectable()
export class EmploymentInfoService {
	constructor(private prisma: PrismaService) {}

	getById(id: string) {
		return this.prisma.employmentInfo.findUnique({
			where: { id },
			select: returnEmploymentInfoObject
		})
	}

	getByUserId(id: string) {
		return this.prisma.employmentInfo.findUnique({
			where: { userId: id },
			select: returnEmploymentInfoObject
		})
	}

	getAll() {
		return this.prisma.employmentInfo.findMany({
			orderBy: { createdAt: 'desc' },
			select: returnEmploymentInfoObject
		})
	}

	async create(userId: string) {
		return this.prisma.employmentInfo.create({
			data: {
				position: '',
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
	}
}
