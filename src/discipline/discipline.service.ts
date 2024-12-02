import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { DisciplineDto, UpdateDisciplineDto } from './discipline.dto'
import { returnDisciplineObject } from './return-discipline.object'

@Injectable()
export class DisciplineService {
	constructor(private prisma: PrismaService) {}

	getById(id: string) {
		return this.prisma.discipline.findUnique({
			where: { id },
			select: returnDisciplineObject
		})
	}

	async getAll(searchTerm?: string) {
		if (searchTerm) return this.search(searchTerm)

		return this.prisma.discipline.findMany({
			select: returnDisciplineObject
		})
	}

	private async search(searchTerm: string) {
		return await this.prisma.discipline.findMany({
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

	create(dto: DisciplineDto) {
		return this.prisma.discipline.create({
			data: {
				name: dto.name,
				department: {
					connect: {
						id: dto.departmentId
					}
				},
				...(dto.teachers
					? {
							teachers: {
								connect: dto.teachers.map(teacherId => ({
									id: teacherId
								}))
							}
					  }
					: {}),
				...(dto.finalTests
					? {
							finalTests: {
								connect: dto.finalTests.map(finalTestId => ({
									id: finalTestId
								}))
							}
					  }
					: {}),
				...(dto.classes
					? {
							classes: {
								connect: dto.classes.map(classId => ({ id: classId }))
							}
					  }
					: {})
			}
		})
	}

	update(id: string, dto: UpdateDisciplineDto) {
		const discipline = this.getById(id)
		if (!discipline) throw new NotFoundException('Дисциплина не найдена')

		const { name, teachers, finalTests, classes } = dto

		return this.prisma.discipline.update({
			where: { id },
			data: {
				name,
				teachers: {
					set: teachers.map(teacherId => ({ id: teacherId })),
					disconnect: teachers
						?.filter(teacherId => !teachers.includes(teacherId))
						.map(teacherId => ({ id: teacherId }))
				},
				finalTests: {
					set: finalTests.map(finalTestId => ({ id: finalTestId })),
					disconnect: finalTests
						?.filter(finalTestId => !finalTests.includes(finalTestId))
						.map(finalTestId => ({ id: finalTestId }))
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
		const discipline = this.getById(id)
		if (!discipline) throw new NotFoundException('Дисциплина не найдена')

		return this.prisma.discipline.delete({
			where: { id }
		})
	}
}
