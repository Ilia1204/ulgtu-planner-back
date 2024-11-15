import { IsArray, IsOptional, IsString } from 'class-validator'

export class DisciplineDto {
	@IsString()
	name: string

	@IsOptional()
	@IsString()
	departmentId: string

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	teachers: string[]

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	finalTests: string[]

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	classes: string[]
}

export type UpdateDisciplineDto = Partial<DisciplineDto>
