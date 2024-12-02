import { Injectable, NotFoundException } from '@nestjs/common'
import { EducationLevel, StudyForm } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { GroupDto } from './group.dto'
import { returnGroupObject } from './return-group.object'

@Injectable()
export class GroupService {
	constructor(private prisma: PrismaService) {}

	async getById(groupId: string, userId?: string) {
		const group = await this.prisma.group.findUnique({
			where: { id: groupId },
			select: { flowId: true, name: true, flow: { select: { faculty: true } } }
		})

		if (!group) throw new NotFoundException('Группа не найдена')

		const flowId = group.flowId

		const classes = await this.prisma.class.findMany({
			where: {
				OR: [{ groupId }, { flows: { some: { id: flowId } } }]
			},
			include: {
				subgroup: { select: { name: true } },
				teacher: {
					select: {
						user: { select: { fullName: true } }
					}
				},
				discipline: { select: { name: true } },
				room: {
					select: { name: true, address: true }
				},
				flows: true,
				schedule: {
					select: {
						dayWeek: true,
						weekType: true,
						date: true,
						classes: { select: { pairNumbers: true } }
					}
				},
				notes: {
					where: {
						OR: [{ isPrivate: false }, { isPrivate: true, userId }]
					},
					select: { id: true }
				}
			},
			orderBy: [{ schedule: { date: 'asc' } }, { pairNumbers: 'asc' }]
		})

		return {
			...group,
			classes
		}
	}

	// async getById(groupId: string, userId?: string) {
	// 	const group = await this.prisma.group.findUnique({
	// 		where: { id: groupId },
	// 		select: {
	// 			flow: { select: { faculty: true, id: true } },
	// 			name: true,
	// 			flowId: true
	// 		}
	// 	})
	// 	if (!group) throw new NotFoundException('Группа не найдена')

	// 	const flowId = group?.flowId
	// 	if (!flowId) throw new NotFoundException('Нет прикрепления группы к потоку')

	// 	const classes = await this.prisma.class.findMany({
	// 		where: {
	// 			OR: [{ groupId }, { flows: { some: { id: flowId } } }]
	// 		},
	// 		select: {
	// 			id: true,
	// 			pairNumbers: true,
	// 			type: true,
	// 			subgroup: {
	// 				select: { name: true }
	// 			},
	// 			teacher: {
	// 				select: {
	// 					user: { select: { fullName: true } }
	// 				}
	// 			},
	// 			discipline: { select: { name: true } },
	// 			room: {
	// 				select: { name: true, address: true }
	// 			},
	// 			flows: true,
	// 			schedule: {
	// 				select: {
	// 					dayWeek: true,
	// 					weekType: true,
	// 					date: true,
	// 					classes: { select: { pairNumbers: true } }
	// 				}
	// 			},
	// 			notes: {
	// 				where: {
	// 					OR: [{ isPrivate: false }, { isPrivate: true, userId }]
	// 				},
	// 				select: { id: true }
	// 			}
	// 		},
	// 		orderBy: [
	// 			{ schedule: { date: 'asc' } },
	// 			{ pairNumbers: 'asc' },
	// 			{ subgroup: { name: 'asc' } }
	// 		]
	// 	})

	// 	return {
	// 		id: groupId,
	// 		name: group.name,
	// 		flow: { faculty: group.flow.faculty },
	// 		classes
	// 	}
	// }

	async getAll(searchTerm?: string) {
		if (searchTerm) return this.search(searchTerm)

		return this.prisma.group.findMany({
			select: returnGroupObject
		})
	}

	private async search(searchTerm: string) {
		const studyFormValue = Object.values(StudyForm).find(
			value => value.toLowerCase() === searchTerm.toLowerCase()
		)

		const educationLevelValue = Object.values(EducationLevel).find(
			value => value.toLowerCase() === searchTerm.toLowerCase()
		)

		return this.prisma.group.findMany({
			where: {
				OR: [
					{
						name: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					},
					{
						studyForm: studyFormValue
					},
					{
						educationLevel: educationLevelValue
					},
					{
						courseNumber: {
							equals: +searchTerm
						}
					}
				]
			}
		})
	}

	create(dto: GroupDto) {
		return this.prisma.$transaction(async prisma => {
			const group = await prisma.group.create({
				data: {
					name: dto.name,
					studyForm: dto.studyForm,
					specialty: dto.specialty,
					educationLevel: dto.educationLevel,
					profile: dto.profile,
					courseNumber: dto.courseNumber
				}
			})

			await prisma.subgroup.createMany({
				data: [
					{ name: 'Первая', groupId: group.id },
					{ name: 'Вторая', groupId: group.id }
				]
			})

			return group
		})
	}

	update(id: string, dto: GroupDto) {
		const group = this.getById(id)
		if (!group) throw new NotFoundException('Группа не найдена')

		const {
			name,
			studyForm,
			specialty,
			educationLevel,
			profile,
			courseNumber
		} = dto

		return this.prisma.group.update({
			where: { id },
			data: {
				name,
				studyForm,
				specialty,
				educationLevel,
				profile,
				courseNumber
			}
		})
	}

	delete(id: string) {
		const group = this.getById(id)
		if (!group) throw new NotFoundException('Группа не найдена')

		return this.prisma.group.delete({
			where: { id }
		})
	}
}
