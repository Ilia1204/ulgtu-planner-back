import { Injectable, NotFoundException } from '@nestjs/common'
import { FinalTestService } from 'src/final-test/final-test.service'
import { PrismaService } from 'src/prisma.service'
import { StudentInfoService } from 'src/student-info/student-info.service'
import { returnStudentExamResultObject } from './return-student-exam-result.object'
import {
	StudentExamResultDto,
	UpdateStudentExamResultDto
} from './student-exam-result.dto'

@Injectable()
export class StudentExamResultService {
	constructor(
		private prisma: PrismaService,
		private studentInfoService: StudentInfoService,
		private finalTestService: FinalTestService
	) {}

	getById(id: string) {
		return this.prisma.studentExamResult.findUnique({
			where: { id },
			select: returnStudentExamResultObject
		})
	}

	async getByUserAndSemesterId(userId: string, semesterId: string) {
		return this.prisma.studentExamResult.findMany({
			where: {
				student: { userId },
				finalTest: { semesterId }
			},
			select: {
				result: true,
				type: true,
				finalTest: {
					select: {
						teacher: {
							select: {
								user: {
									select: {
										fullName: true
									}
								}
							}
						},
						discipline: {
							select: {
								name: true
							}
						},
						date: true
					}
				}
			}
		})
	}

	async getAll(searchTerm?: string) {
		if (searchTerm) return this.search(searchTerm)

		return this.prisma.studentExamResult.findMany({
			select: returnStudentExamResultObject
		})
	}

	private async search(searchTerm: string) {
		return this.prisma.studentExamResult.findMany({
			where: {
				OR: [
					{
						student: {
							user: {
								fullName: {
									contains: searchTerm,
									mode: 'insensitive'
								}
							}
						},
						finalTest: {
							discipline: {
								name: {
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

	async create(dto: StudentExamResultDto) {
		const student = await this.studentInfoService.getById(dto.studentId)
		if (!student) throw new NotFoundException('Студент не найден')

		const finalTest = await this.finalTestService.getById(dto.finalTestId)
		if (!finalTest) throw new NotFoundException('Итоговое испытание не найдено')

		return this.prisma.studentExamResult.create({
			data: {
				result: dto.result,
				type: dto.type,
				student: {
					connect: {
						id: dto.studentId
					}
				},
				finalTest: {
					connect: {
						id: dto.finalTestId
					}
				}
			}
		})
	}

	async update(id: string, dto: UpdateStudentExamResultDto) {
		const studentExamResult = await this.getById(id)
		if (!studentExamResult)
			throw new NotFoundException('Результат экзамена не найден')

		const { result, type, studentId, finalTestId } = dto

		return this.prisma.studentExamResult.update({
			where: { id },
			data: {
				result,
				type,
				studentId,
				finalTestId
			}
		})
	}

	async delete(id: string) {
		const studentExamResult = await this.getById(id)
		if (!studentExamResult)
			throw new NotFoundException('Результат экзамена не найден')

		return this.prisma.studentExamResult.delete({
			where: { id }
		})
	}
}
