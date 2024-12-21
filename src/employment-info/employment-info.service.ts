import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { returnEmploymentInfoObject } from './return-employment-info.object'

@Injectable()
export class EmploymentInfoService {
	constructor(private prisma: PrismaService) {}

	async getById(id: string) {
		const teacher = await this.prisma.employmentInfo.findUnique({
			where: { id },
			select: returnEmploymentInfoObject
		})

		const today = new Date()

		const currentMonday = new Date(today)
		currentMonday.setDate(today.getDate() - today.getDay())

		const nextMonday = new Date(currentMonday)
		nextMonday.setDate(currentMonday.getDate() + 7)

		const endOfNextWeek = new Date(nextMonday)
		endOfNextWeek.setDate(nextMonday.getDate() + 6)

		const classes = []

		const classesTeacher = await this.prisma.class.findMany({
			where: {
				schedule: {
					date: { gte: currentMonday, lte: endOfNextWeek }
				},
				OR: [{ teacherId: id }]
			},
			include: {
				subgroup: { select: { name: true } },
				discipline: { select: { name: true } },
				room: {
					select: { name: true, address: true }
				},
				group: {
					select: {
						name: true
					}
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
				OR: [{ teacherId: id }]
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
				group: {
					select: {
						name: true
					}
				},
				room: {
					select: {
						name: true,
						address: true
					}
				}
			}
		})

		classes.push(...classesTeacher, ...finalTests)

		return { ...teacher, classes }
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

	async getByDiscipline(disciplineId: string) {
		return this.prisma.employmentInfo.findMany({
			where: {
				disciplines: {
					some: {
						id: disciplineId
					}
				}
			},
			select: { ...returnEmploymentInfoObject, classes: false }
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
