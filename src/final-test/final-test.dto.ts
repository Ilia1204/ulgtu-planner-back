import { ExamType } from '@prisma/client'
import {
	IsArray,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString
} from 'class-validator'

export class FinalTestDto {
	@IsOptional()
	@IsArray()
	@IsEnum(ExamType, { each: true })
	types: ExamType[]

	@IsOptional()
	@IsArray()
	pairNumbers: number[]

	@IsOptional()
	@IsString()
	roomId: string

	@IsOptional()
	@IsNumber()
	courseNumber: number

	@IsOptional()
	@IsString()
	disciplineId: string

	@IsOptional()
	@IsString()
	teacherId: string

	@IsOptional()
	@IsString()
	semesterId: string

	@IsOptional()
	@IsString()
	groupId: string

	@IsOptional()
	@IsString()
	scheduleId: string

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	studentExamResult: string[]

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	flows: string[]
}

export type UpdateFinalTestDto = Partial<FinalTestDto>
