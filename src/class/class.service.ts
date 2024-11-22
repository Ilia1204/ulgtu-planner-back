import { Injectable, NotFoundException } from '@nestjs/common'
import { DisciplineService } from 'src/discipline/discipline.service'
import { EmploymentInfoService } from 'src/employment-info/employment-info.service'
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
		private subgroupService: SubgroupService
	) {}

	getById(id: string) {
		return this.prisma.class.findUnique({
			where: { id },
			select: returnClassObject
		})
	}

	async getAll(searchTerm?: string) {
		if (searchTerm) return this.search(searchTerm)

		return this.prisma.class.findMany({
			select: returnClassObject
		})
	}

	private async search(searchTerm: string) {
		return this.prisma.class.findMany({
			where: {
				OR: [
					{
						discipline: {
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

	async create(dto: ClassDto) {
		const room = await this.roomService.getById(dto.roomId)
		if (!room) throw new NotFoundException('Помещение не найдено')

		const schedule = await this.scheduleService.getById(dto.scheduleId)
		if (!schedule) throw new NotFoundException('Расписание не найдено')

		const teacher = await this.employmentInfoService.getById(dto.teacherId)
		if (!teacher) throw new NotFoundException('Преподаватель не найден')

		const discipline = await this.disciplineService.getById(dto.disciplineId)
		if (!discipline) throw new NotFoundException('Дисциплина не найдена')

		let subgroupConnect
		if (dto.subgroupId) {
			const subgroup = await this.subgroupService.getById(dto.subgroupId)
			if (!subgroup) throw new NotFoundException('Данная подгруппа не найдена')
			subgroupConnect = { connect: { id: dto.subgroupId } }
		}

		return this.prisma.class.create({
			data: {
				type: dto.type,
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
				teacher: {
					connect: {
						id: dto.teacherId
					}
				},
				discipline: {
					connect: {
						id: dto.disciplineId
					}
				},
				subgroup: subgroupConnect
			}
		})
	}

	async update(id: string, dto: UpdateClassDto) {
		const lesson = await this.getById(id)
		if (!lesson) throw new NotFoundException('Занятие не найдено')

		const { type, roomId, teacherId, disciplineId, scheduleId, flows } = dto

		return this.prisma.class.update({
			where: { id },
			data: {
				type,
				roomId,
				teacherId,
				disciplineId,
				scheduleId,
				flows: {
					set: flows.map(flowId => ({ id: flowId })),
					disconnect: flows
						?.filter(flowId => !flows.includes(flowId))
						.map(flowId => ({ id: flowId }))
				}
			}
		})
	}

	async delete(id: string) {
		const lesson = await this.getById(id)
		if (!lesson) throw new NotFoundException('Занятие не найдено')

		return this.prisma.class.delete({
			where: { id }
		})
	}
}
