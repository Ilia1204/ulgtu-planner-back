import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { hash, verify } from 'argon2'
import { Response } from 'express'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { AuthDto, LoginDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN = 1
	REFRESH_TOKEN_NAME = 'refreshToken'

	constructor(
		private jwt: JwtService,
		private userService: UserService,
		private prisma: PrismaService
	) {}

	async login(dto: AuthDto) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.validateUser(dto)
		const tokens = this.issueTokens(user.id)

		return { user, ...tokens }
	}

	async initiateLogin(dto: LoginDto) {
		const user = await this.validateUserExistence(dto)
		if (!user)
			throw new NotFoundException(
				'Пользователь c данной почтой/логином/номером зачётки не найден'
			)
		const tokens = this.issueTokens(user.id)

		return { name: user.fullName.split(' ')[1], user, ...tokens }
	}

	private async validateUserExistence(dto: LoginDto) {
		let user: User
		if (dto.email) user = await this.userService.getByEmail(dto.email)
		else if (dto.username)
			user = await this.userService.getByUsername(dto.username)
		else if (dto.creditCardNumber)
			user = await this.userService.getByCreditCardNumber(dto.creditCardNumber)
		return user
	}

	async setPassword(userId: string, password) {
		const user = await this.userService.getById(userId)
		if (!user) throw new NotFoundException('Пользователь не найден')

		const hashedPassword = await hash(password)

		await this.prisma.user.update({
			where: { id: userId },
			data: { password: hashedPassword }
		})

		return user
	}

	async setRecoveryEmail(userId: string, recoveryEmail: string) {
		const user = await this.userService.getById(userId)
		if (!user) throw new NotFoundException('Пользователь не найден')

		await this.prisma.user.update({
			where: { id: userId },
			data: { recoveryEmail }
		})

		return user
	}

	async register(dto: AuthDto) {
		const oldUser = await this.userService.getByEmailOrUsername(
			dto.email,
			dto.username
		)

		if (oldUser)
			throw new BadRequestException(
				'Пользователь с такие email или username уже существует'
			)

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.create(dto)
		const tokens = this.issueTokens(user.id)

		return { user, ...tokens }
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('Невалидный токен')

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.getById(result.id)
		const tokens = this.issueTokens(user.id)

		return { user, ...tokens }
	}

	private issueTokens(userId: string) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h'
		})
		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		})

		return { accessToken, refreshToken }
	}

	private async validateUser(dto: AuthDto) {
		let user
		if (dto.email) user = await this.userService.getByEmail(dto.email)
		else if (dto.username)
			user = await this.userService.getByUsername(dto.username)
		else if (dto.creditCardNumber)
			user = await this.userService.getByCreditCardNumber(dto.creditCardNumber)
		else
			throw new BadRequestException(
				'Необходимо указать email, логин или номер зачётки'
			)

		if (!user) throw new NotFoundException('Пользователь не найден')

		const isValid = await verify(user.password, dto.password)
		if (!isValid) throw new UnauthorizedException('Неправильный пароль')

		return user
	}

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain: 'localhost',
			expires: expiresIn,
			secure: true,
			// lax if production
			sameSite: 'none'
		})
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain: 'localhost',
			expires: new Date(0),
			secure: true,
			// lax if production
			sameSite: 'none'
		})
	}
}
