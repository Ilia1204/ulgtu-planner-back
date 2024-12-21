import { Injectable, NotFoundException } from '@nestjs/common'
import { EducationLevel, StudyForm } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { GroupDto } from './group.dto'
import { returnGroupObject } from './return-group.object'

@Injectable()
export class GroupService {
	constructor(private prisma: PrismaService) {}

	async getById(groupId: string) {
		const group = await this.prisma.group.findUnique({
			where: { id: groupId },
			select: {
				flowId: true,
				name: true,
				flow: { select: { faculty: true } },
				courseNumber: true
			}
		})
		if (!group) throw new NotFoundException('Группа не найдена')

		const flowId = group.flowId

		const flows = await this.prisma.class.findMany({
			where: { groupId },
			select: {
				flows: {
					select: {
						groups: {
							select: { courseNumber: true }
						}
					}
				}
			}
		})

		const courseNumber = flows?.[0]?.flows?.[0]?.groups?.[0]?.courseNumber || 2

		const today = new Date()

		const currentMonday = new Date(today)
		currentMonday.setDate(today.getDate() - today.getDay())

		const nextMonday = new Date(currentMonday)
		nextMonday.setDate(currentMonday.getDate() + 7)

		const endOfNextWeek = new Date(nextMonday)
		endOfNextWeek.setDate(nextMonday.getDate() + 6)

		const classes = []

		const classesGroup = await this.prisma.class.findMany({
			where: {
				schedule: {
					date: { gte: currentMonday, lte: endOfNextWeek }
				},
				OR: [{ groupId }, { flows: { some: { id: flowId } }, courseNumber }]
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
				flows: {
					select: {
						name: true,
						groups: {
							select: {
								name: true,
								courseNumber: true
							}
						}
					}
				},
				schedule: {
					select: {
						dayWeek: true,
						weekType: true,
						date: true
					}
				}
			},
			orderBy: [
				{ schedule: { date: 'asc' } },
				{ pairNumbers: 'asc' },
				{ subgroup: { name: 'asc' } }
			]
		})

		const finalTests = await this.prisma.finalTest.findMany({
			where: {
				schedule: {
					date: { gte: currentMonday, lte: endOfNextWeek }
				},
				OR: [{ groupId }, { flows: { some: { id: flowId } }, courseNumber }]
			},
			orderBy: [{ schedule: { date: 'asc' } }, { pairNumbers: 'asc' }],
			select: {
				id: true,
				pairNumbers: true,
				types: true,
				discipline: {
					select: { name: true }
				},
				schedule: {
					select: {
						dayWeek: true,
						date: true
					}
				},
				room: {
					select: {
						name: true,
						address: true
					}
				},
				teacher: {
					select: {
						user: {
							select: { fullName: true }
						}
					}
				}
			}
		})

		classes.push(...classesGroup, ...finalTests)

		return { ...group, classes }
	}

	async getAll(searchTerm?: string) {
		if (searchTerm) return this.search(searchTerm)

		return this.prisma.group.findMany({
			select: returnGroupObject
		})
	}

	async getAllForClass() {
		return this.prisma.group.findMany({
			select: {
				id: true,
				name: true
			}
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
