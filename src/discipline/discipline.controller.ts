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
import { DisciplineDto, UpdateDisciplineDto } from './discipline.dto'
import { DisciplineService } from './discipline.service'

@Controller('disciplines')
export class DisciplineController {
	constructor(private readonly disciplineService: DisciplineService) {}

	@Get()
		async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.disciplineService.getAll(searchTerm)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('admin')
	@Post()
	async createDiscipline(@Body() dto: DisciplineDto) {
		return this.disciplineService.create(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth('admin')
	async updateDiscipline(
		@Param('id') id: string,
		@Body() dto: UpdateDisciplineDto
	) {
		return this.disciplineService.update(id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth('admin')
	async deleteDiscipline(@Param('id') id: string) {
		return this.disciplineService.delete(id)
	}

	@HttpCode(200)
	@Get(':id')
	@Auth('admin')
	async getDisciplineById(@Param('id') id: string) {
		return this.disciplineService.getById(id)
	}
}
