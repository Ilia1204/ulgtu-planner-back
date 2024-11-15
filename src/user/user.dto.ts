import { IsEmail, IsOptional } from 'class-validator'

export class UserDto {
	@IsOptional()
	@IsEmail()
	email: string
}
