import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import {
	getEducationLevelFromTranslation,
	getStudyFormFromTranslation
} from 'src/utils/translate-to-english'
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

	getAll(searchTerm?: string) {
		if (searchTerm) return this.search(searchTerm)

		return this.prisma.room.findMany({
			select: returnRoomObject
		})
	}

	private async search(searchTerm: string) {
		const rooms = await this.prisma.room.findMany({
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
			},
			select: returnRoomObject,
			orderBy: { name: 'asc' }
		})

		const studyFormValue = getStudyFormFromTranslation(searchTerm.toLowerCase())

		const educationLevelValue = getEducationLevelFromTranslation(
			searchTerm.toLowerCase()
		)

		const courseNumberMatch = searchTerm.match(/\d+/)
		const courseNumberValue = courseNumberMatch
			? Number(courseNumberMatch[0])
			: undefined

		const groups = await this.prisma.group.findMany({
			where: {
				OR: [
					{
						name: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					},
					{
						studyForm: studyFormValue
					},
					{
						educationLevel: educationLevelValue
					},
					...(courseNumberValue
						? [{ courseNumber: { equals: courseNumberValue } }]
						: [])
				]
			},
			select: {
				id: true,
				name: true,
				courseNumber: true,
				educationLevel: true,
				studyForm: true,
				classes: {
					select: {
						type: true,
						pairNumbers: true,
						subgroup: {
							select: {
								name: true
							}
						},
						room: {
							select: {
								name: true,
								address: true
							}
						},
						schedule: {
							select: {
								dayWeek: true,
								date: true
							}
						},
						discipline: {
							select: {
								name: true
							}
						}
					}
				}
			},
			orderBy: { name: 'asc' }
		})

		const teachers = await this.prisma.employmentInfo.findMany({
			where: {
				OR: [
					{
						user: {
							fullName: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						}
					},
					{
						position: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				]
			},
			select: {
				id: true,
				user: {
					select: {
						fullName: true
					}
				},
				position: true,
				classes: {
					select: {
						type: true,
						pairNumbers: true,
						room: {
							select: {
								name: true,
								address: true
							}
						},
						flows: {
							select: {
								name: true
							}
						},
						schedule: {
							select: {
								dayWeek: true,
								date: true
							}
						},
						discipline: {
							select: {
								name: true
							}
						}
					}
				}
			},
			orderBy: {
				user: {
					fullName: 'asc'
				}
			}
		})

		return [...rooms, ...groups, ...teachers]
	}

	async create(dto: RoomDto) {
		return this.prisma.room.create({
			data: {
				name: dto.name,
				address: dto.address,
				type: dto.type
			}
		})
	}

	update(id: string, dto: RoomDto) {
		const room = this.getById(id)
		if (!room) throw new NotFoundException('Помещение не найдено')

		const { name, address, type } = dto

		return this.prisma.room.update({
			where: { id },
			data: { name, address, type }
		})
	}

	delete(id: string) {
		const room = this.getById(id)
		if (!room) throw new NotFoundException('Помещение не найдено')

		return this.prisma.room.delete({
			where: { id }
		})
	}
}
