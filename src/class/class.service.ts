import { Injectable, NotFoundException } from '@nestjs/common'
import * as dayjs from 'dayjs'
import { DisciplineService } from 'src/discipline/discipline.service'
import { EmploymentInfoService } from 'src/employment-info/employment-info.service'
import { GroupService } from 'src/group/group.service'
import { returnNoteObject } from 'src/note/return-note.object'
import { NotificationService } from 'src/notification/notification.service'
import { PrismaService } from 'src/prisma.service'
import { RoomService } from 'src/room/room.service'
import { ScheduleService } from 'src/schedule/schedule.service'
import { SubgroupService } from 'src/subgroup/subgroup.service'
import { returnUserObject } from 'src/user/return-user.object'
import { formatDisciplineName } from 'src/utils/format-discipline-name'
import { getDayWeekTranslation } from 'src/utils/translate-to-english'
import { ClassDto, UpdateClassDto } from './class.dto'
import { returnClassObject } from './return-class.object'
require('dayjs/locale/ru')

dayjs.locale('ru')

@Injectable()
export class ClassService {
	constructor(
		private prisma: PrismaService,
		private roomService: RoomService,
		private scheduleService: ScheduleService,
		private employmentInfoService: EmploymentInfoService,
		private disciplineService: DisciplineService,
		private groupService: GroupService,
		private subgroupService: SubgroupService,
		private notificationService: NotificationService
	) {}

	getById(id: string, userId?: string) {
		return this.prisma.class.findUnique({
			where: { id },
			select: {
				...returnClassObject,
				flows: {
					select: {
						id: true,
						name: true,
						groups: {
							select: {
								name: true
							}
						}
					}
				},
				notes: {
					where: {
						classId: id,
						OR: [{ isPrivate: false }, { isPrivate: true, userId }]
					},
					orderBy: {
						isPrivate: 'asc'
					},
					select: returnNoteObject
				}
			}
		})
	}

	async getAll(searchTerm?: string) {
		if (searchTerm) return this.search(searchTerm)

		return this.prisma.class.findMany({
			select: { ...returnClassObject, isPublic: true },
			orderBy: [
				{
					group: {
						name: 'asc'
					}
				},
				{
					schedule: {
						date: 'asc'
					}
				},
				{
					pairNumbers: 'asc'
				}
			]
		})
	}

	private async search(searchTerm: string) {
		return await this.prisma.class.findMany({
			where: {
				OR: [
					{
						discipline: {
							name: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						}
					},
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

	async getClassesByTimeAndDate(
		dayWeek: string,
		date: string,
		pairNumber: number
	) {
		if (!pairNumber || !date || !dayWeek)
			throw new NotFoundException(
				'Один или несколько параметров не были переданы'
			)

		const translatedDayWeek = getDayWeekTranslation(dayWeek)

		return await this.prisma.class.findMany({
			where: {
				schedule: {
					dayWeek: translatedDayWeek,
					date
				},
				pairNumbers: {
					has: pairNumber
				}
			},
			select: { ...returnClassObject, notes: false }
		})
	}

	create(dto: ClassDto) {
		const room = this.roomService.getById(dto.roomId)
		if (!room) throw new NotFoundException('Помещение не найдено')

		const schedule = this.scheduleService.getById(dto.scheduleId)
		if (!schedule) throw new NotFoundException('Расписание не найдено')

		let teacherConnect
		if (dto.teacherId) {
			const teacher = this.employmentInfoService.getById(dto.teacherId)
			if (!teacher) throw new NotFoundException('Преподаватель не найден')
			teacherConnect = { connect: { id: dto.teacherId } }
		}

		let groupConnect
		if (dto.groupId) {
			const group = this.groupService.getById(dto.groupId)
			if (!group) throw new NotFoundException('Группа не найдена')
			groupConnect = { connect: { id: dto.groupId } }
		}

		const discipline = this.disciplineService.getById(dto.disciplineId)
		if (!discipline) throw new NotFoundException('Дисциплина не найдена')

		let subgroupConnect
		if (dto.subgroupId) {
			const subgroup = this.subgroupService.getById(dto.subgroupId)
			if (!subgroup) throw new NotFoundException('Данная подгруппа не найдена')
			subgroupConnect = { connect: { id: dto.subgroupId } }
		}

		return this.prisma.class.create({
			data: {
				pairNumbers: dto.pairNumbers,
				type: dto.type,
				isPublic: dto.isPublic,
				courseNumber: dto.courseNumber,
				room: {
					connect: {
						id: dto.roomId
					}
				},
				schedule: {
					connect: {
						id: dto.scheduleId
					}
				},
				teacher: teacherConnect,
				discipline: {
					connect: {
						id: dto.disciplineId
					}
				},
				...(dto.flows
					? {
							flows: {
								connect: dto.flows.map(flowId => ({
									id: flowId
								}))
							}
					  }
					: {}),
				group: groupConnect,
				subgroup: subgroupConnect
			}
		})
	}

	async update(id: string, dto: UpdateClassDto) {
		const lesson = await this.getById(id)
		if (!lesson) throw new NotFoundException('Занятие не найдено')

		const {
			type,
			isPublic,
			pairNumbers,
			roomId,
			teacherId,
			disciplineId,
			scheduleId,
			subgroupId,
			groupId,
			flows
		} = dto

		const currentLesson = await this.prisma.class.findUnique({
			where: { id },
			select: {
				roomId: true,
				groupId: true,
				subgroupId: true,
				scheduleId: true
			}
		})

		const updatedLesson = await this.prisma.class.update({
			where: { id },
			data: {
				type,
				pairNumbers,
				isPublic,
				roomId,
				teacherId,
				disciplineId,
				scheduleId,
				subgroupId: subgroupId || null,
				groupId,
				flows: {
					set: flows.map(flowId => ({ id: flowId })),
					disconnect: flows
						?.filter(flowId => !flows.includes(flowId))
						.map(flowId => ({ id: flowId }))
				}
			},
			select: returnClassObject
		})

		if (currentLesson.roomId !== roomId) {
			const schedule = await this.prisma.schedule.findUnique({
				where: { id: currentLesson.scheduleId },
				select: { date: true }
			})

			const room = await this.prisma.room.findUnique({
				where: { id: roomId },
				select: { name: true }
			})

			const students = await this.prisma.user.findMany({
				where: {
					studentInfo: {
						groupId: currentLesson.groupId,
						...(currentLesson.subgroupId && {
							subgroupId: currentLesson.subgroupId
						})
					}
				},
				select: returnUserObject
			})

			const teachers = await this.prisma.user.findMany({
				where: {
					employmentInfo: {
						classes: {
							some: {
								id
							}
						}
					}
				},
				select: returnUserObject
			})

			const classType = `${
				updatedLesson.type === 'lab'
					? 'Лаба'
					: updatedLesson.type === 'lecture'
					? 'Лекция'
					: 'Практика'
			}`

			const notifications = [
				...students.map(
					async student =>
						await this.notificationService.sendNotification(
							student.id,
							'✨ Изменение аудитории ✨',
							`📅 ${classType} «${formatDisciplineName(
								updatedLesson.discipline.name
							)}», которая состоится ${dayjs(schedule.date).format(
								'DD.MM.YYYY'
							)}, пройдёт в ${
								updatedLesson.room.type === 'auditorium' ? 'ауд.' : 'каб.'
							} ${room.name}`
						)
				),
				...teachers.map(
					async teacher =>
						await this.notificationService.sendNotification(
							teacher.id,
							'✨ Изменение аудитории ✨',
							`📅 ${classType} «${formatDisciplineName(
								updatedLesson.discipline.name
							)}», которая состоится у ${
								updatedLesson.group
									? `группы ${
											updatedLesson.subgroup
												? `${updatedLesson.group.name} - ${updatedLesson.subgroup.name}`
												: updatedLesson.group.name
									  }`
									: `потоков ${updatedLesson.flows
											.map(flow => {
												const name = flow.name
												const abbreviationMatch = name.match(/\(([^)]+)\)/)

												if (abbreviationMatch) return abbreviationMatch[1]
												else {
													return name
														.split(' ')
														.map(word => word.charAt(0).toUpperCase())
														.join('')
												}
											})
											.join(', ')}`
							} ${dayjs(schedule.date).format('DD.MM.YYYY')}, пройдёт в ${
								updatedLesson.room.type === 'auditorium' ? 'ауд.' : 'каб.'
							} ${room.name}`
						)
				)
			]

			await Promise.all(notifications)
		}

		return updatedLesson
	}

	delete(id: string) {
		const lesson = this.getById(id)
		if (!lesson) throw new NotFoundException('Занятие не найдено')

		return this.prisma.class.delete({
			where: { id }
		})
	}
}
