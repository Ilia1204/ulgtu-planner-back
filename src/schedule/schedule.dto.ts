import { DayWeek, ScheduleType, WeekType } from '@prisma/client'
import {
	IsArray,
	IsBoolean,
	IsDateString,
	IsEnum,
	IsOptional,
	IsString
} from 'class-validator'

export class ScheduleDto {
	@IsOptional()
	@IsDateString()
	date: string

	@IsOptional()
	@IsEnum(DayWeek)
	dayWeek: DayWeek

	@IsOptional()
	@IsEnum(ScheduleType)
	type: ScheduleType

	@IsOptional()
	@IsBoolean()
	isPublic: boolean

	@IsOptional()
	@IsEnum(WeekType)
	weekType: WeekType

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	classes: string[]
}
