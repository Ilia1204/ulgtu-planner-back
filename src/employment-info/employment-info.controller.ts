import {
	Controller,
	Get,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { EmploymentInfoService } from './employment-info.service'

@Controller('employment-info')
export class EmploymentInfoController {
	constructor(private readonly employmentInfoService: EmploymentInfoService) {}

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
