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
				weekType: { in: [weekType, weekNumber % 2 === 0 ? 'odd' : 'even'] }
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
					include: {
						group: {
							select: {
								id: true,
								flowId: true
							}
						}
					}
				},
				employmentInfo: true
			}
		})

		if (!user) throw new NotFoundException('Пользователь не найден')

		const semesterStartDate = new Date('2024-09-03')
		const { weekNumber, weekType } = this.getCurrentWeek(semesterStartDate)

		const schedules = []

		if (user.studentInfo) {
			const groupId = user.studentInfo.group?.id
			const flowId = user.studentInfo.group?.flowId

			if (!groupId || !flowId)
				throw new NotFoundException('Вы не прикреплены к группе или потоку')

			const classes = await this.prisma.class.findMany({
				where: {
					OR: [{ groupId }, { flows: { some: { id: flowId } } }],
					schedule: {
						weekType: { in: [weekType, weekNumber % 2 === 0 ? 'odd' : 'even'] }
					}
				},
				orderBy: [
					{ schedule: { weekType: weekType === 'even' ? 'desc' : 'asc' } },
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
							date: true,
							classes: { select: { pairNumbers: true } }
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
						orderBy: {
							isPrivate: 'desc'
						}
					}
				}
			})
			schedules.push(...classes)
		}

		if (user.employmentInfo) {
			const classes = await this.prisma.class.findMany({
				where: {
					teacher: {
						userId: id
					}
				},
				orderBy: [
					{ schedule: { weekType: weekType === 'even' ? 'desc' : 'asc' } },
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
							date: true,
							classes: { select: { pairNumbers: true } }
						}
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
					subgroup: {
						select: { name: true }
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
						orderBy: {
							isPrivate: 'desc'
						}
					}
				}
			})
			schedules.push(...classes)
		}

		return schedules
	}

	create(dto: ScheduleDto) {
		return this.prisma.schedule.create({
			data: {
				dayWeek: dto.dayWeek,
				weekType: dto.weekType,
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
