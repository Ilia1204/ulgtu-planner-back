import {
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { Auth } from './decorators/auth.decorator'
import { CurrentUser } from './decorators/user.decorator'
import { AuthDto } from './dto/auth.dto'

@Controller('auth')
@UsePipes(new ValidationPipe())
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(200)
	@Post('register')
	async register(
		@Body() dto: AuthDto,
		@Res({ passthrough: true }) res: Response
	) {
		const { refreshToken, ...response } = await this.authService.register(dto)
		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto) {
		return this.authService.initiateLogin(dto)
	}

	@HttpCode(200)
	@Post('set-password')
	@Auth()
	async setPassword(
		@CurrentUser('id') id: string,
		@Body() body: { password: string }
	) {
		return this.authService.setPassword(id, body.password)
	}

	@HttpCode(200)
	@Post('validate-password')
	@Auth()
	async validatePassword(
		@CurrentUser('id') id: string,
		@Body() body: { password: string }
	) {
		return this.authService.validatePassword(id, body.password)
	}

	@HttpCode(200)
	@Post('set-recovery-email')
	@Auth()
	async setRecoveryEmail(
		@CurrentUser('id') id: string,
		@Body() body: { recoveryEmail: string }
	) {
		return this.authService.setRecoveryEmail(id, body.recoveryEmail)
	}

	@HttpCode(200)
	@Post('login/access-token')
	async getNewTokens(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		const refreshTokenFromCookies =
			req.cookies[this.authService.REFRESH_TOKEN_NAME]

		if (!refreshTokenFromCookies) {
			this.authService.removeRefreshTokenFromResponse(res)
			throw new UnauthorizedException('Refresh token not passed')
		}

		const { refreshToken, ...response } = await this.authService.getNewTokens(
			refreshTokenFromCookies
		)

		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@HttpCode(200)
	@Post('logout')
	async logout(@Res({ passthrough: true }) res: Response) {
		this.authService.removeRefreshTokenFromResponse(res)
		return true
	}
}
