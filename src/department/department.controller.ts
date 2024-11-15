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
import { DepartmentDto } from './department.dto'
import { DepartmentService } from './department.service'

@Controller('departments')
export class DepartmentController {
	constructor(private readonly departmentService: DepartmentService) {}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.departmentService.getAll(searchTerm)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('admin')
	@Post()
	async createDepartment(@Body() dto: DepartmentDto) {
		return this.departmentService.create(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth('admin')
	async updateDepartment(@Param('id') id: string, @Body() dto: DepartmentDto) {
		return this.departmentService.update(id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth('admin')
	async deleteDepartment(@Param('id') id: string) {
		return this.departmentService.delete(id)
	}

	@HttpCode(200)
	@Get(':id')
	@Auth('admin')
	async getDepartmentById(@Param('id') id: string) {
		return this.departmentService.getById(id)
	}
}
