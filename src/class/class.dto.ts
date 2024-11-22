import { ClassType } from '@prisma/client'
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator'

export class ClassDto {
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

	@IsOptional()
	@IsString()
	subgroupId: string

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
