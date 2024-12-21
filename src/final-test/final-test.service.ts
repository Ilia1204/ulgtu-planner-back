import { Injectable, NotFoundException } from '@nestjs/common'
import { ExamResult } from '@prisma/client'
import { DisciplineService } from 'src/discipline/discipline.service'
import { EmploymentInfoService } from 'src/employment-info/employment-info.service'
import { GroupService } from 'src/group/group.service'
import { PrismaService } from 'src/prisma.service'
import { RoomService } from 'src/room/room.service'
import { ScheduleService } from 'src/schedule/schedule.service'
import { SemesterService } from 'src/semester/semester.service'
import { FinalTestDto, UpdateFinalTestDto } from './final-test.dto'
import { returnFinalTestObject } from './return-final-test.object'

@Injectable()
export class FinalTestService {
	constructor(
		private prisma: PrismaService,
		private roomService: RoomService,
		private semesterService: SemesterService,
		private employmentInfoService: EmploymentInfoService,
		private disciplineService: DisciplineService,
		private scheduleService: ScheduleService,
		private groupService: GroupService
	) {}

	getById(id: string) {
		return this.prisma.finalTest.findUnique({
			where: { id },
			select: returnFinalTestObject
		})
	}

	async getAll(searchTerm?: string) {
		if (searchTerm) return this.search(searchTerm)

		return this.prisma.finalTest.findMany({
			select: returnFinalTestObject
		})
	}

	private async search(searchTerm: string) {
		return this.prisma.finalTest.findMany({
			where: {
				OR: [
					{
						discipline: {
							name: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						},
						teacher: {
							user: {
								fullName: {
									contains: searchTerm,
									mode: 'insensitive'
								}
							}
						}
					}
				]
			}
		})
	}

	async create(dto: FinalTestDto) {
		if (dto.roomId) {
			const room = this.roomService.getById(dto.roomId)
			if (!room) throw new NotFoundException('Помещение не найдено')
		}

		if (dto.scheduleId) {
			const schedule = this.scheduleService.getById(dto.scheduleId)
			if (!schedule) throw new NotFoundException('Расписание не найдено')
		}

		if (dto.teacherId) {
			const teacher = this.employmentInfoService.getById(dto.teacherId)
			if (!teacher) throw new NotFoundException('Преподаватель не найден')
		}

		const semester = this.semesterService.getById(dto.semesterId)
		if (!semester) throw new NotFoundException('Семестр не найдено')

		const group = this.groupService.getById(dto.groupId)
		if (!group) throw new NotFoundException('Группа не найдена')

		const discipline = this.disciplineService.getById(dto.disciplineId)
		if (!discipline) throw new NotFoundException('Дисциплина не найдена')

		const data: any = {
			pairNumbers: dto.pairNumbers,
			types: dto.types,
			semester: {
				connect: {
					id: dto.semesterId
				}
			},
			group: {
				connect: {
					id: dto.groupId
				}
			},
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
				: {})
		}

		if (dto.roomId) data.room = { connect: { id: dto.roomId } }
		if (dto.scheduleId) data.schedule = { connect: { id: dto.scheduleId } }
		if (dto.teacherId) data.teacher = { connect: { id: dto.teacherId } }
		const finalTest = await this.prisma.finalTest.create({ data: { ...data } })

		const studentsInGroup = await this.prisma.studentInfo.findMany({
			where: { groupId: dto.groupId }
		})
		const studentIds = studentsInGroup.map(student => student.id)

		const studentExamResults = studentIds.flatMap(studentId =>
			dto.types
				.filter(type => type !== 'calculation_graphic_work')
				.map(type => ({
					studentId,
					finalTestId: finalTest.id,
					result: ExamResult.none,
					type,
					isPublic: true
				}))
		)

		await this.prisma.studentExamResult.createMany({
			data: studentExamResults
		})

		return finalTest
	}

	update(id: string, dto: UpdateFinalTestDto) {
		const finalTest = this.getById(id)
		if (!finalTest) throw new NotFoundException('Итоговое испытание не найдено')

		const {
			pairNumbers,
			types,
			roomId,
			teacherId,
			disciplineId,
			semesterId,
			scheduleId,
			groupId,
			flows,
			courseNumber
		} = dto

		return this.prisma.finalTest.update({
			where: { id },
			data: {
				pairNumbers,
				types,
				roomId,
				teacherId,
				disciplineId,
				semesterId,
				groupId,
				scheduleId,
				courseNumber,
				flows: {
					set: flows.map(flowId => ({ id: flowId })),
					disconnect: flows
						?.filter(flowId => !flows.includes(flowId))
						.map(flowId => ({ id: flowId }))
				}
			}
		})
	}

	delete(id: string) {
		const finalTest = this.getById(id)
		if (!finalTest) throw new NotFoundException('Итоговое испытание не найдено')

		return this.prisma.finalTest.delete({
			where: { id }
		})
	}
}
