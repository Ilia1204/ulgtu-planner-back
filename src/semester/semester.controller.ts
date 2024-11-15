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
import { SemesterDto, UpdateSemesterDto } from './semester.dto'
import { SemesterService } from './semester.service'

@Controller('semesters')
export class SemesterController {
	constructor(private readonly semesterService: SemesterService) {}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.semesterService.getAll(searchTerm)
	}

	@HttpCode(200)
	@Get('by-user')
	@Auth()
	async getSemestersByUserId(@CurrentUser('id') id: string) {
		return this.semesterService.getSemestersByUserId(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('admin')
	@Post()
	async createSemester(@Body() dto: SemesterDto) {
		return this.semesterService.create(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth('admin')
	async updateSemester(
		@Param('id') id: string,
		@Body() dto: UpdateSemesterDto
	) {
		return this.semesterService.update(id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth('admin')
	async deleteSemester(@Param('id') id: string) {
		return this.semesterService.delete(id)
	}

	@HttpCode(200)
	@Get(':id')
	@Auth('admin')
	async getSemesterById(@Param('id') id: string) {
		return this.semesterService.getById(id)
	}
}
