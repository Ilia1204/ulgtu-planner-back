import { Injectable, NotFoundException } from '@nestjs/common'
import { GroupService } from 'src/group/group.service'
import { PrismaService } from 'src/prisma.service'
import { returnSubgroupObject } from './return-subgroup.object'
import { SubgroupDto } from './subgroup.dto'

@Injectable()
export class SubgroupService {
	constructor(
		private prisma: PrismaService,
		private groupService: GroupService
	) {}

	getById(id: string) {
		return this.prisma.subgroup.findUnique({
			where: { id },
			select: returnSubgroupObject
		})
	}

	async getAll(searchTerm?: string) {
		if (searchTerm) return await this.search(searchTerm)

		return this.prisma.subgroup.findMany({
			select: returnSubgroupObject
		})
	}

	async getAllByGroup(groupId: string) {
		return this.prisma.subgroup.findMany({
			where: { groupId },
			select: { id: true, name: true }
		})
	}

	private async search(searchTerm: string) {
		return this.prisma.subgroup.findMany({
			where: {
				OR: [
					{
						name: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					},
					{
						students: {
							some: {
								user: {
									fullName: {
										contains: searchTerm,
										mode: 'insensitive'
									}
								}
							}
						}
					},
					{
						group: {
							name: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						}
					}
				]
			}
		})
	}

	create(dto: SubgroupDto) {
		const group = this.groupService.getById(dto.groupId)
		if (!group) throw new NotFoundException('Группа не найдена')

		return this.prisma.subgroup.create({
			data: {
				name: dto.name,
				group: {
					connect: {
						id: dto.groupId
					}
				}
			}
		})
	}

	update(id: string, dto: SubgroupDto) {
		const subgroup = this.getById(id)
		if (!subgroup) throw new NotFoundException('Подгруппа не найдена')

		const { name, groupId } = dto

		return this.prisma.subgroup.update({
			where: { id },
			data: { name, groupId }
		})
	}

	delete(id: string) {
		const subgroup = this.getById(id)
		if (!subgroup) throw new NotFoundException('Подгруппа не найдена')

		return this.prisma.subgroup.delete({
			where: { id }
		})
	}
}
