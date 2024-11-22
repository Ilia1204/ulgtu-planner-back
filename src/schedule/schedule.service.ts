import { Injectable, NotFoundException } from '@nestjs/common'
import { GroupService } from 'src/group/group.service'
import { PrismaService } from 'src/prisma.service'
import { returnScheduleObject } from './return-schedule.object'
import { ScheduleDto } from './schedule.dto'

@Injectable()
export class ScheduleService {
	constructor(
		private prisma: PrismaService,
		private groupService: GroupService
	) {}

	getById(id: string) {
		return this.prisma.schedule.findUnique({
			where: { id },
			select: returnScheduleObject
		})
	}

	async getAll(searchTerm?: string) {
		if (searchTerm) return this.search(searchTerm)

		return this.prisma.schedule.findMany({
			select: returnScheduleObject
		})
	}

	private async search(searchTerm: string) {
		return this.prisma.schedule.findMany({
			where: {
				OR: [
					{
						group: {
							name: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						}
					}
				]
			}
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

	getWeekDates(weekNumber: number, startDate: Date): Date[] {
		const firstDayOfWeek = new Date(
			+startDate + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000
		)
		return Array.from({ length: 7 }, (_, i) => {
			const day = new Date(firstDayOfWeek)
			day.setDate(day.getDate() + i)
			return day
		})
	}

	async getScheduleForStudent(id: string) {
		const student = await this.prisma.studentInfo.findUnique({
			where: { userId: id },
			include: { subgroup: true }
		})

		if (!student || !student.subgroup)
			throw new NotFoundException('Подгруппа не найдена')

		const subgroupId = student.subgroup.id
		const groupId = student.subgroup.groupId

		const semesterStartDate = new Date('2024-09-03')
		const { weekNumber, weekType } = this.getCurrentWeek(semesterStartDate)

		return this.prisma.schedule.findMany({
			where: {
				weekType: { in: [weekType, weekNumber % 2 === 0 ? 'odd' : 'even'] },
				classes: {
					some: {
						OR: [{ subgroupId }, { subgroupId: null, schedule: { groupId } }]
					}
				}
			},
			include: {
				classes: {
					orderBy: {
						pairNumber: 'asc'
					},
					where: {
						OR: [
							{
								subgroupId
							},
							{
								subgroupId: null,
								schedule: { groupId }
							}
						]
					},
					include: {
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
						}
					}
				}
			}
		})
	}

	async create(dto: ScheduleDto) {
		const group = await this.groupService.getById(dto.groupId)
		if (!group) throw new NotFoundException('Группа не найдена')

		return this.prisma.schedule.create({
			data: {
				dayWeek: dto.dayWeek,
				weekType: dto.weekType,
				group: {
					connect: {
						id: dto.groupId
					}
				}
			}
		})
	}

	async update(id: string, dto: ScheduleDto) {
		const schedule = await this.getById(id)
		if (!schedule) throw new NotFoundException('Расписание не найдено')

		const { dayWeek, groupId, weekType } = dto

		return this.prisma.schedule.update({
			where: { id },
			data: {
				dayWeek,
				weekType,
				groupId
			}
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
