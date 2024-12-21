import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { NoteDto, UpdateNoteDto } from './note.dto'
import { returnNoteObject } from './return-note.object'

@Injectable()
export class NoteService {
	constructor(private prisma: PrismaService) {}

	getById(id: string) {
		return this.prisma.note.findUnique({
			where: { id },
			select: returnNoteObject
		})
	}

	async getAll(userId: string) {
		return this.prisma.note.findMany({
			where: {
				OR: [{ isPrivate: false }, { isPrivate: true, userId }]
			},
			select: returnNoteObject,
			orderBy: [{ isPrivate: 'asc' }, { createdAt: 'desc' }]
		})
	}

	async create(userId: string, dto: NoteDto, pairNumber: number) {
		return this.prisma.note.create({
			data: {
				content: dto.content,
				isPrivate: dto.isPrivate,
				pairNumber: +pairNumber,
				class: {
					connect: {
						id: dto.classId
					}
				},
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
	}

	async update(id: string, dto: UpdateNoteDto) {
		const note = await this.getById(id)
		if (!note) throw new NotFoundException('Заметка не найдена')

		const { content, isPrivate, classId } = dto

		return this.prisma.note.update({
			where: { id },
			data: {
				content,
				isPrivate,
				classId
			}
		})
	}

	async delete(id: string) {
		const note = await this.getById(id)
		if (!note) throw new NotFoundException('Заметка не найдена')

		return this.prisma.note.delete({
			where: { id }
		})
	}

	deleteAllByUser(userId: string, classId: string) {
		return this.prisma.note.deleteMany({
			where: {
				userId,
				classId
			}
		})
	}
}
