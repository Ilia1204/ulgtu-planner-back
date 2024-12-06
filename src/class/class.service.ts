import { Injectable, NotFoundException } from '@nestjs/common'
import { DisciplineService } from 'src/discipline/discipline.service'
import { EmploymentInfoService } from 'src/employment-info/employment-info.service'
import { GroupService } from 'src/group/group.service'
import { returnNoteObject } from 'src/note/return-note.object'
import { PrismaService } from 'src/prisma.service'
import { RoomService } from 'src/room/room.service'
import { ScheduleService } from 'src/schedule/schedule.service'
import { SubgroupService } from 'src/subgroup/subgroup.service'
import { ClassDto, UpdateClassDto } from './class.dto'
import { returnClassObject } from './return-class.object'

@Injectable()
export class ClassService {
	constructor(
		private prisma: PrismaService,
		private roomService: RoomService,
		private scheduleService: ScheduleService,
		private employmentInfoService: EmploymentInfoService,
		private disciplineService: DisciplineService,
		private groupService: GroupService,
		private subgroupService: SubgroupService
	) {}

	getById(id: string, userId?: string) {
		return this.prisma.class.findUnique({
			where: { id },
			select: {
				...returnClassObject,
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
			select: returnClassObject
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
				group: groupConnect,
				subgroup: subgroupConnect
			}
		})
	}

	update(id: string, dto: UpdateClassDto) {
		const lesson = this.getById(id)
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

		return this.prisma.class.update({
			where: { id },
			data: {
				type,
				pairNumbers,
				isPublic,
				roomId,
				teacherId,
				disciplineId,
				scheduleId,
				subgroupId,
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
	}

	delete(id: string) {
		const lesson = this.getById(id)
		if (!lesson) throw new NotFoundException('Занятие не найдено')

		return this.prisma.class.delete({
			where: { id }
		})
	}
}
