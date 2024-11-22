import { DayWeek, WeekType } from '@prisma/client'
import {
	IsArray,
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
	@IsEnum(WeekType)
	weekType: WeekType

	@IsOptional()
	@IsString()
	groupId: string

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	classes: string[]
}
