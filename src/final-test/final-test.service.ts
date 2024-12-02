import { Injectable, NotFoundException } from '@nestjs/common'
import { DisciplineService } from 'src/discipline/discipline.service'
import { EmploymentInfoService } from 'src/employment-info/employment-info.service'
import { PrismaService } from 'src/prisma.service'
import { RoomService } from 'src/room/room.service'
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
		private disciplineService: DisciplineService
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

	create(dto: FinalTestDto) {
		if (dto.roomId) {
			const room = this.roomService.getById(dto.roomId)
			if (!room) throw new NotFoundException('Помещение не найдено')
		}

		const semester = this.semesterService.getById(dto.semesterId)
		if (!semester) throw new NotFoundException('Семестр не найдено')

		const teacher = this.employmentInfoService.getById(dto.teacherId)
		if (!teacher) throw new NotFoundException('Преподаватель не найден')

		const discipline = this.disciplineService.getById(dto.disciplineId)
		if (!discipline) throw new NotFoundException('Дисциплина не найдена')

		const data: any = {
			date: dto.date,
			types: dto.types,
			semester: {
				connect: {
					id: dto.semesterId
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

		if (dto.roomId) data.room = { connect: { id: dto.roomId } }
		return this.prisma.finalTest.create({ data: { ...data } })
	}

	update(id: string, dto: UpdateFinalTestDto) {
		const finalTest = this.getById(id)
		if (!finalTest) throw new NotFoundException('Итоговое испытание не найдено')

		const { date, types, roomId, teacherId, disciplineId, semesterId } = dto

		return this.prisma.finalTest.update({
			where: { id },
			data: {
				date,
				types,
				roomId,
				teacherId,
				disciplineId,
				semesterId
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
