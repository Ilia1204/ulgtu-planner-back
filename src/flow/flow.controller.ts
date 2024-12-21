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
import { FlowDto, UpdateFlowDto } from './flow.dto'
import { FlowService } from './flow.service'

@Controller('flows')
export class FlowController {
	constructor(private readonly flowService: FlowService) {}

	@Get()
	@Auth('admin')
	async getAllFlows(@Query('searchTerm') searchTerm?: string) {
		return this.flowService.getAll(searchTerm)
	}

	@HttpCode(200)
	@Get('for-class')
	@Auth('admin')
	async getAllFlowsForClass() {
		return this.flowService.getAllForClass()
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('admin')
	@Post()
	async createFlow(@Body() dto: FlowDto) {
		return this.flowService.create(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth('admin')
	async updateFlow(@Param('id') id: string, @Body() dto: UpdateFlowDto) {
		return this.flowService.update(id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth('admin')
	async deleteFlow(@Param('id') id: string) {
		return this.flowService.delete(id)
	}

	@HttpCode(200)
	@Get(':id')
	@Auth('admin')
	async getFlowById(@Param('id') id: string) {
		return this.flowService.getById(id)
	}
}
