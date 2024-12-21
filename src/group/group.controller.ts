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
import { GroupDto } from './group.dto'
import { GroupService } from './group.service'

@Controller('groups')
export class GroupController {
	constructor(private readonly groupService: GroupService) {}

	@Get()
	@Auth('admin')
	async getAllGroups(@Query('searchTerm') searchTerm?: string) {
		return this.groupService.getAll(searchTerm)
	}

	@Get('for-class')
	@Auth('admin')
	async getAllGroupsForClass() {
		return this.groupService.getAllForClass()
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('admin')
	@Post()
	async createGroup(@Body() dto: GroupDto) {
		return this.groupService.create(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth('admin')
	async updateGroup(@Param('id') id: string, @Body() dto: GroupDto) {
		return this.groupService.update(id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth('admin')
	async deleteGroup(@Param('id') id: string) {
		return this.groupService.delete(id)
	}

	@HttpCode(200)
	@Get(':groupId')
	@Auth()
	async getGroupById(@Param('groupId') groupId: string) {
		return this.groupService.getById(groupId)
	}
}
