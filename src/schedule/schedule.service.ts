import { Injectable, NotFoundException } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { returnNoteObject } from 'src/note/return-note.object'
import { PrismaService } from 'src/prisma.service'
import { returnScheduleObject } from './return-schedule.object'
import { ScheduleDto } from './schedule.dto'

@Injectable()
export class ScheduleService {
	constructor(private prisma: PrismaService) {}

	getById(id: string) {
		return this.prisma.schedule.findUnique({
			where: { id },
			select: returnScheduleObject
		})
	}

	async getAll() {
		return this.prisma.schedule.findMany({
			select: returnScheduleObject
		})
	}

	getCurrentWeek(startDate: Date): {
		weekNumber: number
		weekType: 'even' | 'odd'
	} {
		const now = new Date()
		const diff = Math.floor((+now - +startDate) / (7 * 24 * 60 * 60 * 1000))
		const weekNumber = diff + 1
		return {
			weekNumber,
			weekType: weekNumber % 2 === 0 ? 'even' : 'odd'
		}
	}

	@Cron('0 0 * * 1')
	async updateScheduleDates() {
		const semesterStartDate = new Date('2024-09-03')
		const { weekNumber, weekType } = this.getCurrentWeek(semesterStartDate)

		const schedules = await this.prisma.schedule.findMany({
			where: {
				weekType: { in: [weekType, weekNumber % 2 === 0 ? 'even' : 'odd'] }
			}
		})

		for (const schedule of schedules) {
			const newDate = new Date(schedule.date)
			newDate.setDate(newDate.getDate() + 7)

			await this.prisma.schedule.update({
				where: { id: schedule.id },
				data: { date: newDate }
			})
		}

		return { success: true, message: 'Расписание обновлено!' }
	}

	async getScheduleForUser(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				roles: true,
				studentInfo: {
					select: {
						group: {
							select: {
								id: true,
								flowId: true
							}
						},
						groupId: true
					}
				},
				employmentInfo: true
			}
		})

		if (!user) throw new NotFoundException('Пользователь не найден')

		const schedules = []

		const today = new Date()
		const currentMonday = new Date(today)
		currentMonday.setDate(today.getDate() - today.getDay())

		const nextMonday = new Date(currentMonday)
		nextMonday.setDate(currentMonday.getDate() + 7)

		const endOfNextWeek = new Date(nextMonday)
		endOfNextWeek.setDate(nextMonday.getDate() + 6)

		if (user.studentInfo) {
			const groupId = user.studentInfo.group?.id
			const flowId = user.studentInfo.group?.flowId

			if (!groupId || !flowId)
				throw new NotFoundException('Вы не прикреплены к группе или потоку')

			const classes = await this.prisma.class.findMany({
				where: {
					schedule: {
						date: { gte: currentMonday, lte: endOfNextWeek }
					},
					OR: [{ groupId }, { flows: { some: { id: flowId } } }]
				},
				orderBy: [
					{ schedule: { date: 'asc' } },
					{ pairNumbers: 'asc' },
					{ subgroup: { name: 'asc' } }
				],
				select: {
					id: true,
					type: true,
					pairNumbers: true,
					schedule: {
						select: {
							dayWeek: true,
							weekType: true,
							date: true
						}
					},
					subgroup: {
						select: { name: true }
					},
					teacher: {
						select: {
							user: {
								select: { fullName: true }
							}
						}
					},
					discipline: {
						select: { name: true }
					},
					room: {
						select: {
							name: true,
							address: true
						}
					},
					notes: {
						where: {
							OR: [{ isPrivate: false }, { isPrivate: true, userId: id }]
						},
						select: returnNoteObject,
						orderBy: { isPrivate: 'desc' }
					}
				}
			})

			const finalTests = await this.prisma.finalTest.findMany({
				where: {
					schedule: {
						date: { gte: currentMonday, lte: endOfNextWeek }
					},
					OR: [{ groupId }, { flows: { some: { id: flowId } } }]
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

			schedules.push(...classes, ...finalTests)
		}

		if (user.employmentInfo) {
			const teacherClasses = await this.prisma.class.findMany({
				where: {
					teacher: { userId: id },
					schedule: {
						date: { gte: currentMonday, lte: endOfNextWeek }
					}
				},
				orderBy: [
					{ schedule: { date: 'asc' } },
					{ pairNumbers: 'asc' },
					{ subgroup: { name: 'asc' } }
				],
				select: {
					id: true,
					type: true,
					pairNumbers: true,
					schedule: {
						select: {
							dayWeek: true,
							weekType: true,
							date: true
						}
					},
					group: {
						select: {
							name: true
						}
					},
					subgroup: {
						select: {
							name: true
						}
					},
					discipline: {
						select: { name: true }
					},
					teacher: {
						select: {
							user: {
								select: {
									fullName: true
								}
							}
						}
					},
					room: {
						select: {
							name: true,
							address: true
						}
					},
					notes: {
						where: {
							OR: [{ isPrivate: false }, { isPrivate: true, userId: id }]
						},
						select: returnNoteObject,
						orderBy: { isPrivate: 'desc' }
					}
				}
			})

			const teacherFinalTests = await this.prisma.finalTest.findMany({
				where: {
					teacher: { userId: id },
					schedule: {
						date: { gte: currentMonday, lte: endOfNextWeek }
					}
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

			schedules.push(...teacherClasses, ...teacherFinalTests)
		}

		return schedules
	}

	create(dto: ScheduleDto) {
		return this.prisma.schedule.create({
			data: {
				dayWeek: dto.dayWeek,
				weekType: dto.weekType,
				type: dto.type,
				isPublic: dto.isPublic
			}
		})
	}

	update(id: string, dto: ScheduleDto) {
		const schedule = this.getById(id)
		if (!schedule) throw new NotFoundException('Расписание не найдено')

		const { dayWeek, isPublic, weekType } = dto

		return this.prisma.schedule.update({
			where: { id },
			data: { dayWeek, weekType, isPublic }
		})
	}

	async delete(id: string) {
		const schedule = await this.getById(id)
		if (!schedule) throw new NotFoundException('Расписание не найдено')

		return this.prisma.schedule.delete({
			where: { id }
		})
	}
}
