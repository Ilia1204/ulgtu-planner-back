import { EducationLevel, StudyForm } from '@prisma/client'
import { Transform } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

export class GroupDto {
	@IsString()
	name: string

	@IsOptional()
	@IsEnum(StudyForm)
	@Transform(({ value }) => ('' + value).toLowerCase())
	studyForm?: StudyForm

	@IsOptional()
	@IsEnum(EducationLevel)
	educationLevel?: EducationLevel

	@IsOptional()
	@IsString()
	specialty?: string

	@IsOptional()
	@IsString()
	profile?: string

	@IsOptional()
	@IsNumber()
	courseNumber?: number
}
