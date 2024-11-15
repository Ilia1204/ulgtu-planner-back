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

	async create(dto: ScheduleDto) {
		const group = await this.groupService.getById(dto.groupId)
		if (!group) throw new NotFoundException('Группа не найдена')

		return this.prisma.schedule.create({
			data: {
				timeStart: dto.timeStart,
				timeEnd: dto.timeEnd,
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

		const { timeStart, timeEnd, dayWeek, groupId, weekType } = dto

		return this.prisma.schedule.update({
			where: { id },
			data: {
				timeStart,
				timeEnd,
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
