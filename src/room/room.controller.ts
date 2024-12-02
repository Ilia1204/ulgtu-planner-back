import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { RoomDto } from './room.dto'
import { RoomService } from './room.service'

@Controller('rooms')
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.roomService.getAll(searchTerm)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('admin')
	@Post()
	async createRoom(@Body() dto: RoomDto) {
		return this.roomService.create(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth('admin')
	async updateRoom(@Param('id') id: string, @Body() dto: RoomDto) {
		return this.roomService.update(id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth('admin')
	async deleteRoom(@Param('id') id: string) {
		return this.roomService.delete(id)
	}

	@HttpCode(200)
	@Get(':id')
	@Auth()
	async getRoomById(@Param('id') id: string) {
		return this.roomService.getById(id)
	}
}
