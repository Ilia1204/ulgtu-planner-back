import { ExamType } from '@prisma/client'
import {
	IsArray,
	IsDateString,
	IsEnum,
	IsOptional,
	IsString
} from 'class-validator'

export class FinalTestDto {
	@IsOptional()
	@IsDateString()
	date: string

	@IsOptional()
	@IsArray()
	@IsEnum(ExamType, { each: true })
	types: ExamType[]

	@IsOptional()
	@IsString()
	roomId: string

	@IsOptional()
	@IsString()
	disciplineId: string

	@IsOptional()
	@IsString()
	teacherId: string

	@IsOptional()
	@IsString()
	semesterId: string

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	studentExamResult: string[]
}

export type UpdateFinalTestDto = Partial<FinalTestDto>
