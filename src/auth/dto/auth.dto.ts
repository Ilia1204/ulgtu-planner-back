import { UserRole } from '@prisma/client'
import {
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	MinLength
} from 'class-validator'

export class AuthDto {
	@IsOptional()
	@IsEmail()
	email: string

	@IsOptional()
	@IsString()
	fullName: string

	@IsOptional()
	@IsString()
	username: string

	@IsOptional()
	@IsString()
	creditCardNumber?: string

	@IsOptional()
	@IsString()
	libraryCardNumber: string

	@MinLength(8, {
		message: 'Пароль должен быть не менее 8 символов!'
	})
	@IsString()
	password: string

	@IsEnum(UserRole, { each: true })
	@IsOptional()
	roles: UserRole[]
}

export class LoginDto {
	@IsOptional()
	@IsEmail()
	email: string

	@IsOptional()
	@IsString()
	username: string

	@IsOptional()
	@IsString()
	creditCardNumber: string
}
