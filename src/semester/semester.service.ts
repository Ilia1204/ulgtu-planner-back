import { Injectable, NotFoundException } from '@nestjs/common'
import { FlowService } from 'src/flow/flow.service'
import { PrismaService } from 'src/prisma.service'
import { returnSemesterObject } from './return-semester.object'
import { SemesterDto, UpdateSemesterDto } from './semester.dto'

@Injectable()
export class SemesterService {
	constructor(
		private prisma: PrismaService,
		private flowService: FlowService
	) {}

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

	create(dto: SemesterDto) {
		let flowConnect
		if (dto.flowId) {
			const flow = this.flowService.getById(dto.flowId)
			if (!flow) throw new NotFoundException('Поток не найден')

			flowConnect = { connect: { id: dto.flowId } }
		}

		return this.prisma.semester.create({
			data: {
				number: dto.number,
				flow: flowConnect,
				...(dto.finalTests
					? {
							finalTests: {
								connect: dto.finalTests.map(finalTestId => ({
									id: finalTestId
								}))
							}
					  }
					: {})
			}
		})
	}

	update(id: string, dto: UpdateSemesterDto) {
		const semester = this.getById(id)
		if (!semester) throw new NotFoundException('Семестр не найден')

		const { number, flowId, finalTests } = dto

		return this.prisma.semester.update({
			where: { id },
			data: {
				number,
				flowId,
				finalTests: {
					set: finalTests.map(finalTestId => ({ id: finalTestId })),
					disconnect: finalTests
						?.filter(finalTestId => !finalTests.includes(finalTestId))
						.map(finalTestId => ({ id: finalTestId }))
				}
			}
		})
	}

	getSemestersByUserId(userId: string) {
		return this.prisma.semester.findMany({
			where: {
				finalTests: {
					some: {
						studentExamsResults: {
							some: {
								student: { userId }
							}
						}
					}
				}
			},
			select: { ...returnSemesterObject },
			orderBy: { createdAt: 'asc' }
		})
	}

	delete(id: string) {
		const semester = this.getById(id)
		if (!semester) throw new NotFoundException('Семестр не найден')

		return this.prisma.semester.delete({
			where: { id }
		})
	}
}
