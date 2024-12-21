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
import { SubgroupDto } from './subgroup.dto'
import { SubgroupService } from './subgroup.service'

@Controller('subgroups')
export class SubgroupController {
	constructor(private readonly subgroupService: SubgroupService) {}

	@Get()
	@Auth('admin')
	async getAllSubgroups(@Query('searchTerm') searchTerm?: string) {
		return this.subgroupService.getAll(searchTerm)
	}

	@HttpCode(200)
	@Get('by-group/:groupId')
	@Auth('admin')
	async getSubgroupsByGroup(@Param('groupId') groupId: string) {
		return this.subgroupService.getAllByGroup(groupId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('admin')
	@Post()
	async createSubGroupGroup(@Body() dto: SubgroupDto) {
		return this.subgroupService.create(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth('admin')
	async updateSubGroup(@Param('id') id: string, @Body() dto: SubgroupDto) {
		return this.subgroupService.update(id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth('admin')
	async deleteSubGroup(@Param('id') id: string) {
		return this.subgroupService.delete(id)
	}

	@HttpCode(200)
	@Get(':id')
	@Auth('admin')
	async getSubGroupById(@Param('id') id: string) {
		return this.subgroupService.getById(id)
	}
}
