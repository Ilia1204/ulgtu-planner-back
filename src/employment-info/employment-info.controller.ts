import {
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { EmploymentInfoService } from './employment-info.service'

@Controller('employment-info')
export class EmploymentInfoController {
	constructor(private readonly employmentInfoService: EmploymentInfoService) {}

	@Auth()
	@Get()
	async getAll() {
		return this.employmentInfoService.getAll()
	}

	@Get(':id')
	@Auth()
	async getById(@Param('id') id: string) {
		return this.employmentInfoService.getById(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	async createStudentInfo(@CurrentUser('id') id: string) {
		return this.employmentInfoService.create(id)
	}

	@HttpCode(200)
	@Get()
	async getByUserId(@CurrentUser('id') id: string) {
		return this.employmentInfoService.getByUserId(id)
	}
}
