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
import { ClassDto, UpdateClassDto } from './class.dto'
import { ClassService } from './class.service'

@Controller('classes')
export class ClassController {
	constructor(private readonly classService: ClassService) {}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.classService.getAll(searchTerm)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('admin')
	@Post()
	async createClass(@Body() dto: ClassDto) {
		return this.classService.create(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth('admin')
	async updateClass(@Param('id') id: string, @Body() dto: UpdateClassDto) {
		return this.classService.update(id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth('admin')
	async deleteClass(@Param('id') id: string) {
		return this.classService.delete(id)
	}

	@HttpCode(200)
	@Get(':id')
	@Auth('admin')
	async getClassById(@Param('id') id: string) {
		return this.classService.getById(id)
	}
}
