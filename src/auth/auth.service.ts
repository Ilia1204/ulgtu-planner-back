import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { hash, verify } from 'argon2'
import { Response } from 'express'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { AuthDto } from './dto/auth.dto'

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
		const user = await this.validateUser(dto)
		const tokens = this.issueTokens(user.id)
		return { user, ...tokens }
	}

	async initiateLogin(dto: AuthDto) {
		const user = await this.validateUserExistence(dto)
		if (!user)
			throw new NotFoundException(
				'Пользователь c данной почтой/логином/номером зачётки не найден'
			)
		const tokens = this.issueTokens(user.id)
		return { name: user.fullName.split(' ')[1], user, ...tokens }
	}

	private async validateUserExistence(dto: AuthDto) {
		const user = dto.email
			? await this.userService.getByEmail(dto.email)
			: dto.username
			? await this.userService.getByUsername(dto.username)
			: dto.creditCardNumber
			? await this.userService.getByCreditCardNumber(dto.creditCardNumber)
			: null
		return user
	}

	async validatePassword(userId: string, password: string) {
		const user = await this.userService.getById(userId, { password: true })
		if (!user) throw new NotFoundException('Пользователь не найден')

		const isValid = await verify(user.password, password)
		if (!isValid) throw new UnauthorizedException('Неверно введён пароль')

		return { success: isValid }
	}

	async setPassword(userId: string, password: string) {
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
				'Пользователь с таким email или username уже существует'
			)

		const { password, ...user } = await this.userService.create(dto)
		const tokens = this.issueTokens(user.id)

		return { user, ...tokens }
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('Невалидный токен')

		const { password, ...user } = await this.userService.getById(result.id)
		const tokens = this.issueTokens(user.id)

		return { user, ...tokens }
	}

	private issueTokens(userId: string) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, { expiresIn: '1h' })
		const refreshToken = this.jwt.sign(data, { expiresIn: '7d' })

		return { accessToken, refreshToken }
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.validateUserExistence(dto)
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
			domain: process.env.DOMAIN || 'localhost',
			expires: expiresIn,
			secure: true,
			sameSite: 'none' // Update for production if needed
		})
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain: process.env.DOMAIN || 'localhost',
			expires: new Date(0),
			secure: true,
			sameSite: 'none' // Update for production if needed
		})
	}
}
