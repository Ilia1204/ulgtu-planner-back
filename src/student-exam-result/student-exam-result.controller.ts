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
import {
	StudentExamResultDto,
	UpdateStudentExamResultDto
} from './student-exam-result.dto'
import { StudentExamResultService } from './student-exam-result.service'

@Controller('student-exams-results')
export class StudentExamResultController {
	constructor(
		private readonly studentExamResultService: StudentExamResultService
	) {}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.studentExamResultService.getAll(searchTerm)
	}

	@HttpCode(200)
	@Get('by-semester/:semesterId')
	@Auth()
	async getExamsResultsByUserAndSemesterId(
		@CurrentUser('id') id: string,
		@Param('semesterId') semesterId: string
	) {
		return this.studentExamResultService.getByUserAndSemesterId(id, semesterId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('admin')
	@Post()
	async createStudentExamResult(@Body() dto: StudentExamResultDto) {
		return this.studentExamResultService.create(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth('admin')
	async updateStudentExamResult(
		@Param('id') id: string,
		@Body() dto: UpdateStudentExamResultDto
	) {
		return this.studentExamResultService.update(id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth('admin')
	async deleteStudentExamResult(@Param('id') id: string) {
		return this.studentExamResultService.delete(id)
	}

	@HttpCode(200)
	@Get(':id')
	@Auth('admin')
	async getStudentExamResultById(@Param('id') id: string) {
		return this.studentExamResultService.getById(id)
	}
}
