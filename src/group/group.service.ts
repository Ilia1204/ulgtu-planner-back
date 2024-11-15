import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { GroupDto } from './group.dto'
import { returnGroupObject } from './return-group.object'

@Injectable()
export class GroupService {
	constructor(private prisma: PrismaService) {}

	getById(id: string) {
		return this.prisma.group.findUnique({
			where: { id },
			select: returnGroupObject
		})
	}

	async getAll(searchTerm?: string) {
		if (searchTerm) return this.search(searchTerm)

		return this.prisma.group.findMany({
			select: returnGroupObject
		})
	}

	private async search(searchTerm: string) {
		return this.prisma.group.findMany({
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

	async create() {
		return this.prisma.group.create({
			data: {
				name: '',
				description: ''
			}
		})
	}

	async update(id: string, dto: GroupDto) {
		const { name, description } = dto

		return this.prisma.group.update({
			where: { id },
			data: {
				name,
				description
			}
		})
	}

	async delete(id: string) {
		const group = await this.getById(id)
		if (!group) throw new NotFoundException('Группа не найдена')

		return this.prisma.group.delete({
			where: { id }
		})
	}
}
