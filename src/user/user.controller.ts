import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { UserDto } from './user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('id') id: string) {
		return this.userService.getById(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('profile')
	@Auth()
	async updateProfile(@CurrentUser('id') id: string, @Body() dto: UserDto) {
		return this.userService.update(id, dto)
	}

	@Get()
	@Auth('admin')
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.userService.getAll(searchTerm)
	}

	@Get(':id')
	@Auth('admin')
	async getById(@Param('id') id: string) {
		return this.userService.getById(id)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth('admin')
	async deleteUser(@Param('id') id: string) {
		return this.userService.delete(id)
	}
}
