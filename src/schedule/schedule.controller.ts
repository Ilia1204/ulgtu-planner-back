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
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { ScheduleDto } from './schedule.dto'
import { ScheduleService } from './schedule.service'

@Controller('schedules')
export class ScheduleController {
	constructor(private readonly scheduleService: ScheduleService) {}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.scheduleService.getAll(searchTerm)
	}

	@HttpCode(200)
	@Get('get-schedule-for-student')
	@Auth()
	async getScheduleForStudent(@CurrentUser('id') id: string) {
		return this.scheduleService.getScheduleForStudent(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('admin')
	@Post()
	async createSchedule(@Body() dto: ScheduleDto) {
		return this.scheduleService.create(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth('admin')
	async updateSchedule(@Param('id') id: string, @Body() dto: ScheduleDto) {
		return this.scheduleService.update(id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth('admin')
	async deleteSchedule(@Param('id') id: string) {
		return this.scheduleService.delete(id)
	}

	@HttpCode(200)
	@Get(':id')
	@Auth('admin')
	async getScheduleById(@Param('id') id: string) {
		return this.scheduleService.getById(id)
	}
}
