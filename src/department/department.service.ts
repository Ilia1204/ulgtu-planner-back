import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { DepartmentDto } from './department.dto'
import { returnDepartmentObject } from './return-department.object'

@Injectable()
export class DepartmentService {
	constructor(private prisma: PrismaService) {}

	getById(id: string) {
		return this.prisma.department.findUnique({
			where: { id },
			select: returnDepartmentObject
		})
	}

	async getAll(searchTerm?: string) {
		if (searchTerm) return this.search(searchTerm)

		return this.prisma.department.findMany({
			select: returnDepartmentObject
		})
	}

	private async search(searchTerm: string) {
		return this.prisma.department.findMany({
			where: {
				OR: [
					{
						name: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					},
					{
						description: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				]
			}
		})
	}

	async create(dto: DepartmentDto) {
		return this.prisma.department.create({
			data: {
				name: dto.name,
				description: dto.description
			}
		})
	}

	async update(id: string, dto: DepartmentDto) {
		const department = await this.getById(id)
		if (!department) throw new NotFoundException('Кафедра не найдена')

		const { name, description } = dto

		return this.prisma.department.update({
			where: { id },
			data: {
				name,
				description
			}
		})
	}

	async delete(id: string) {
		const department = await this.getById(id)
		if (!department) throw new NotFoundException('Кафедра не найдена')

		return this.prisma.department.delete({
			where: { id }
		})
	}
}
