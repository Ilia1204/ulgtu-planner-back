import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { FlowDto, UpdateFlowDto } from './flow.dto'
import { returnFlowObject } from './return-flow.object'

@Injectable()
export class FlowService {
	constructor(private prisma: PrismaService) {}

	getById(id: string) {
		return this.prisma.flow.findUnique({
			where: { id },
			select: returnFlowObject
		})
	}

	async getAll(searchTerm?: string) {
		if (searchTerm) return this.search(searchTerm)

		return this.prisma.flow.findMany({
			select: returnFlowObject
		})
	}

	private async search(searchTerm: string) {
		return this.prisma.flow.findMany({
			where: {
				OR: [
					{
						name: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				]
			}
		})
	}

	async create(dto: FlowDto) {
		return this.prisma.flow.create({
			data: {
				name: dto.name,
				department: {
					connect: {
						id: dto.departmentId
					}
				}
			}
		})
	}

	async update(id: string, dto: UpdateFlowDto) {
		const flow = await this.getById(id)
		if (!flow) throw new NotFoundException('Поток не найден')

		const { name } = dto

		return this.prisma.flow.update({
			where: { id },
			data: { name }
		})
	}

	async delete(id: string) {
		const flow = await this.getById(id)
		if (!flow) throw new NotFoundException('Поток не найден')

		return this.prisma.flow.delete({
			where: { id }
		})
	}
}
