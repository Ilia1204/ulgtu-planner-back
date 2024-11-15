import { Injectable, NotFoundException } from '@nestjs/common'
import { DisciplineService } from 'src/discipline/discipline.service'
import { EmploymentInfoService } from 'src/employment-info/employment-info.service'
import { PrismaService } from 'src/prisma.service'
import { RoomService } from 'src/room/room.service'
import { ScheduleService } from 'src/schedule/schedule.service'
import { ClassDto, UpdateClassDto } from './class.dto'
import { returnClassObject } from './return-class.object'

@Injectable()
export class ClassService {
	constructor(
		private prisma: PrismaService,
		private roomService: RoomService,
		private scheduleService: ScheduleService,
		private employmentInfoService: EmploymentInfoService,
		private disciplineService: DisciplineService
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

		return this.prisma.class.create({
			data: {
				startTime: dto.startTime,
				endTime: dto.endTime,
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
				}
			}
		})
	}

	async update(id: string, dto: UpdateClassDto) {
		const lesson = await this.getById(id)
		if (!lesson) throw new NotFoundException('Занятие не найдено')

		const {
			startTime,
			endTime,
			type,
			roomId,
			teacherId,
			disciplineId,
			scheduleId
		} = dto

		return this.prisma.class.update({
			where: { id },
			data: {
				startTime,
				endTime,
				type,
				roomId,
				teacherId,
				disciplineId,
				scheduleId
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
