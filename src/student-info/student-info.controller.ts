import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { UpdateStudentInfo } from './student-info.dto'
import { StudentInfoService } from './student-info.service'

@Controller('student-info')
export class StudentInfoController {
	constructor(private readonly studentInfoService: StudentInfoService) {}

	@Auth('admin')
	@Get()
	async getAll() {
		return this.studentInfoService.getAll()
	}

	@Get(':id')
	@Auth('admin')
	async getById(@Param('id') id: string) {
		return this.studentInfoService.getById(id)
	}

	@Get('by-user')
	async getByUserId(@CurrentUser('id') id: string) {
		return this.studentInfoService.getByUserId(id)
	}

	@Get('by-credit-card-number/:creditCardNumber')
	async getByCreditCardNumber(
		@Param('creditCardNumber') creditCardNumber: string
	) {
		return this.studentInfoService.getByCreditCardNumber(creditCardNumber)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	async createStudentInfo(@CurrentUser('id') id: string) {
		return this.studentInfoService.create(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth('admin')
	async updateStudentInfo(
		@Param('id') id: string,
		@Body() dto: UpdateStudentInfo
	) {
		return this.studentInfoService.update(id, dto)
	}
}
