import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { returnSemesterObject } from './return-semester.object'
import { SemesterDto, UpdateSemesterDto } from './semester.dto'

@Injectable()
export class SemesterService {
	constructor(private prisma: PrismaService) {}

	getById(id: string) {
		return this.prisma.semester.findUnique({
			where: { id },
			select: returnSemesterObject
		})
	}

	async getAll(searchTerm?: string) {
		if (searchTerm) return this.search(searchTerm)

		return this.prisma.semester.findMany({
			select: returnSemesterObject
		})
	}

	private async search(searchTerm: string) {
		return this.prisma.semester.findMany({
			where: {
				OR: [
					{
						number: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					},
					{
						flow: {
							name: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						},
						finalTests: {
							some: {
								teacher: {
									user: {
										fullName: {
											contains: searchTerm,
											mode: 'insensitive'
										}
									}
								}
							}
						}
					}
				]
			}
		})
	}

	async create(dto: SemesterDto) {
		return this.prisma.semester.create({
			data: {
				number: dto.number,
				flow: {
					connect: {
						id: dto.flowId
					}
				}
			}
		})
	}

	async update(id: string, dto: UpdateSemesterDto) {
		const semester = await this.getById(id)
		if (!semester) throw new NotFoundException('Семестр не найден')

		const { number, flowId } = dto

		return this.prisma.semester.update({
			where: { id },
			data: {
				number,
				flowId
			}
		})
	}

	async getSemestersByUserId(userId: string) {
		return this.prisma.semester.findMany({
			where: {
				finalTests: {
					some: {
						studentExamResults: {
							some: {
								student: {
									userId
								}
							}
						}
					}
				}
			},
			include: {
				finalTests: true
			}
		})
	}

	async delete(id: string) {
		const semester = await this.getById(id)
		if (!semester) throw new NotFoundException('Семестр не найден')

		return this.prisma.semester.delete({
			where: { id }
		})
	}
}
