import {
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
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

	async create(userId: string, dto: NoteDto) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: {
				studentInfo: {
					select: {
						subgroup: {
							select: {
								group: true
							}
						}
					}
				},
				employmentInfo: true
			}
		})

		const lesson = await this.prisma.class.findUnique({
			where: { id: dto.classId },
			include: {
				group: true,
				teacher: true,
				flows: {
					select: { id: true }
				}
			}
		})

		if (user.studentInfo) {
			if (
				lesson.type !== 'lecture' ||
				!lesson.flows.some(
					flow => flow.id === user.studentInfo.subgroup.group.flowId
				)
			) {
				if (lesson.group.id !== user.studentInfo.subgroup.group.id) {
					throw new ForbiddenException(
						'Вы не можете создавать заметки к занятиям другой группы'
					)
				}
			}
		} else if (user.employmentInfo)
			if (lesson.teacher.id !== user.employmentInfo.id) {
				throw new ForbiddenException(
					'Вы не можете создавать заметки к занятиям, которые не ведете'
				)
			}

		return this.prisma.note.create({
			data: {
				content: dto.content,
				isPrivate: dto.isPrivate,
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

	async update(id: string, dto: UpdateNoteDto, userId: string) {
		const note = await this.getById(id)
		if (!note) throw new NotFoundException('Заметка не найдена')

		if (note.userId !== userId)
			throw new NotFoundException(
				'Вы не можете обновлять заметку другого автора'
			)

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

	async delete(userId: string, id: string) {
		const note = await this.getById(id)
		if (!note) throw new NotFoundException('Заметка не найдена')

		if (note.userId !== userId)
			throw new NotFoundException('Вы не можете удалять заметку другого автора')

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
