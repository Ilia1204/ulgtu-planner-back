import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { FlowDto, UpdateFlowDto } from './flow.dto'
import { returnFlowObject } from './return-flow.object'

@Injectable()
export class FlowService {
	constructor(private prisma: PrismaService) {}

	getById(id: string) {
		return this.prisma.flow.findUnique({
			where: { id },
			select: returnFlowObject
		})
	}

	async getAll(searchTerm?: string) {
		if (searchTerm) return this.search(searchTerm)

		return this.prisma.flow.findMany({
			select: returnFlowObject
		})
	}

	private async search(searchTerm: string) {
		return this.prisma.flow.findMany({
			where: {
				OR: [
					{
						name: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				]
			}
		})
	}

	create(dto: FlowDto) {
		return this.prisma.flow.create({
			data: {
				name: dto.name,
				isPublic: dto.isPublic,
				department: {
					connect: {
						id: dto.departmentId
					}
				},
				...(dto.groups
					? {
							groups: {
								connect: dto.groups.map(groupId => ({
									id: groupId
								}))
							}
					  }
					: {}),
				...(dto.classes
					? {
							classes: {
								connect: dto.classes.map(classId => ({
									id: classId
								}))
							}
					  }
					: {})
			}
		})
	}

	update(id: string, dto: UpdateFlowDto) {
		const flow = this.getById(id)
		if (!flow) throw new NotFoundException('Поток не найден')

		const { name, departmentId, isPublic, groups, classes } = dto

		return this.prisma.flow.update({
			where: { id },
			data: {
				name,
				departmentId,
				isPublic,
				groups: {
					set: groups.map(groupId => ({ id: groupId })),
					disconnect: groups
						?.filter(groupId => !groups.includes(groupId))
						.map(groupId => ({ id: groupId }))
				},
				classes: {
					set: classes.map(classId => ({ id: classId })),
					disconnect: classes
						?.filter(classId => !classes.includes(classId))
						.map(classId => ({ id: classId }))
				}
			}
		})
	}

	delete(id: string) {
		const flow = this.getById(id)
		if (!flow) throw new NotFoundException('Поток не найден')

		return this.prisma.flow.delete({
			where: { id }
		})
	}
}
