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
import { FinalTestDto, UpdateFinalTestDto } from './final-test.dto'
import { FinalTestService } from './final-test.service'

@Controller('final-tests')
export class FinalTestController {
	constructor(private readonly finalTestService: FinalTestService) {}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.finalTestService.getAll(searchTerm)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('admin')
	@Post()
	async createFinalTest(@Body() dto: FinalTestDto) {
		return this.finalTestService.create(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth('admin')
	async updateFinalTest(
		@Param('id') id: string,
		@Body() dto: UpdateFinalTestDto
	) {
		return this.finalTestService.update(id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth('admin')
	async deleteFinalTest(@Param('id') id: string) {
		return this.finalTestService.delete(id)
	}

	@HttpCode(200)
	@Get(':id')
	async getFinalTestById(@Param('id') id: string) {
		return this.finalTestService.getById(id)
	}
}
