import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { returnRoomObject } from './return-room.object'
import { RoomDto } from './room.dto'

@Injectable()
export class RoomService {
	constructor(private prisma: PrismaService) {}

	getById(id: string) {
		return this.prisma.room.findUnique({
			where: { id },
			select: returnRoomObject
		})
	}

	async getAll(searchTerm?: string) {
		if (searchTerm) return this.search(searchTerm)

		return this.prisma.room.findMany({
			select: returnRoomObject
		})
	}

	private async search(searchTerm: string) {
		return this.prisma.room.findMany({
			where: {
				OR: [
					{
						name: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					},
					{
						address: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				]
			}
		})
	}

	async create() {
		return this.prisma.room.create({
			data: {
				name: '',
				address: '',
				type: 'cabinet'
			}
		})
	}

	async update(id: string, dto: RoomDto) {
		const room = await this.getById(id)
		if (!room) throw new NotFoundException('Помещение не найдено')

		const { name, address, type } = dto

		return this.prisma.room.update({
			where: { id },
			data: {
				name,
				address,
				type
			}
		})
	}

	async delete(id: string) {
		const room = await this.getById(id)
		if (!room) throw new NotFoundException('Помещение не найдено')

		return this.prisma.room.delete({
			where: { id }
		})
	}
}
