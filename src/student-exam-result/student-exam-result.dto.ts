import { ExamResult, ExamType } from '@prisma/client'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class StudentExamResultDto {
	@IsOptional()
	@IsEnum(ExamResult)
	result: ExamResult

	@IsOptional()
	@IsEnum(ExamType)
	type: ExamType

	@IsOptional()
	@IsString()
	studentId: string

	@IsOptional()
	@IsString()
	finalTestId: string
}

export type UpdateStudentExamResultDto = Partial<StudentExamResultDto>
