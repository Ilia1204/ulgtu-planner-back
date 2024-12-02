import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { DepartmentDto } from './department.dto'
import { returnDepartmentObject } from './return-department.object'

@Injectable()
export class DepartmentService {
	constructor(private prisma: PrismaService) {}

	getById(id: string) {
		return this.prisma.department.findUnique({
			where: { id },
			select: returnDepartmentObject
		})
	}

	async getAll(searchTerm?: string) {
		if (searchTerm) return this.search(searchTerm)

		return this.prisma.department.findMany({
			select: returnDepartmentObject
		})
	}

	private async search(searchTerm: string) {
		return this.prisma.department.findMany({
			where: {
				OR: [
					{
						name: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					},
					{
						description: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				]
			}
		})
	}

	create(dto: DepartmentDto) {
		return this.prisma.department.create({
			data: {
				name: dto.name,
				description: dto.description,
				...(dto.teachers
					? {
							teachers: {
								connect: dto.teachers.map(teacherId => ({
									id: teacherId
								}))
							}
					  }
					: {}),
				...(dto.flows
					? {
							flows: {
								connect: dto.flows.map(flowId => ({
									id: flowId
								}))
							}
					  }
					: {}),
				...(dto.disciplines
					? {
							disciplines: {
								connect: dto.disciplines.map(disciplineId => ({
									id: disciplineId
								}))
							}
					  }
					: {})
			}
		})
	}

	update(id: string, dto: DepartmentDto) {
		const department = this.getById(id)
		if (!department) throw new NotFoundException('Кафедра не найдена')

		const { name, description, flows, teachers, disciplines } = dto

		return this.prisma.department.update({
			where: { id },
			data: {
				name,
				description,
				flows: {
					set: flows.map(flowId => ({ id: flowId })),
					disconnect: flows
						?.filter(flowId => !flows.includes(flowId))
						.map(flowId => ({ id: flowId }))
				},
				teachers: {
					set: teachers.map(teacherId => ({ id: teacherId })),
					disconnect: teachers
						?.filter(teacherId => !teachers.includes(teacherId))
						.map(teacherId => ({ id: teacherId }))
				},
				disciplines: {
					set: disciplines.map(disciplineId => ({ id: disciplineId })),
					disconnect: disciplines
						?.filter(disciplineId => !disciplines.includes(disciplineId))
						.map(disciplineId => ({ id: disciplineId }))
				}
			}
		})
	}

	delete(id: string) {
		const department = this.getById(id)
		if (!department) throw new NotFoundException('Кафедра не найдена')

		return this.prisma.department.delete({
			where: { id }
		})
	}
}
