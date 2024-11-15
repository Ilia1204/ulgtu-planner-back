import { RoomType } from '@prisma/client'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class RoomDto {
	@IsString()
	name: string

	@IsOptional()
	@IsEnum(RoomType)
	type?: RoomType
	@IsString()
	address: string
}
