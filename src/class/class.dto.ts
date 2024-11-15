import { ClassType } from '@prisma/client'
import {
	IsArray,
	IsDateString,
	IsEnum,
	IsOptional,
	IsString
} from 'class-validator'

export class ClassDto {
	@IsOptional()
	@IsDateString()
	startTime: string

	@IsOptional()
	@IsDateString()
	endTime: string

	@IsOptional()
	@IsEnum(ClassType)
	type?: ClassType

	@IsOptional()
	@IsString()
	roomId: string

	@IsOptional()
	@IsString()
	scheduleId: string

	@IsOptional()
	@IsString()
	teacherId: string

	@IsOptional()
	@IsString()
	disciplineId: string

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	flows: string[]

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	attachments: string[]

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	notes: string[]
}

export type UpdateClassDto = Partial<ClassDto>
