import { IsNumber, IsOptional, IsString } from 'class-validator'

export class EmploymentInfoDto {
	@IsString()
	position: string

	@IsString()
	department: string

	@IsOptional()
	@IsString()
	education?: string

	@IsOptional()
	@IsNumber()
	workExperience?: number
}
