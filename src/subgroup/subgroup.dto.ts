import { IsArray, IsOptional, IsString } from 'class-validator'

export class SubgroupDto {
	@IsString()
	name: string

	@IsString()
	groupId: string

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	students: string[]

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	classes: string[]
}
