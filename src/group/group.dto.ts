import { IsOptional, IsString } from 'class-validator'

export class GroupDto {
	@IsString()
	name: string

	@IsOptional()
	@IsString()
	description?: string
}
