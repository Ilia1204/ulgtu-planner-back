import { IsArray, IsOptional, IsString } from 'class-validator'

export class DepartmentDto {
	@IsString()
	name: string

	@IsOptional()
	@IsString()
	description: string

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	flows: string[]

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	disciplines: string[]

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	teachers: string[]
}
