import { IsArray, IsOptional, IsString } from 'class-validator'

export class SemesterDto {
	@IsString()
	number: string

	@IsString()
	flowId: string

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	finalTests: string[]
}

export type UpdateSemesterDto = Partial<SemesterDto>
