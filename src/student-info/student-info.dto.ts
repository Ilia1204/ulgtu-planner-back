import { EducationLevel, FundingSource, StudyForm } from '@prisma/client'
import { Transform } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

export class StudentInfoDto {
	@IsString()
	creditCardNumber: string

	@IsOptional()
	@IsEnum(StudyForm)
	@Transform(({ value }) => ('' + value).toLowerCase())
	studyForm?: StudyForm

	@IsOptional()
	@IsString()
	faculty?: string

	@IsOptional()
	@IsString()
	specialty?: string

	@IsOptional()
	@IsString()
	profile?: string

	@IsOptional()
	@IsNumber()
	course?: number

	@IsOptional()
	@IsEnum(EducationLevel)
	educationLevel?: EducationLevel

	@IsOptional()
	@IsEnum(FundingSource)
	findingSource?: FundingSource
}

export type UpdateStudentInfo = Partial<StudentInfoDto>
