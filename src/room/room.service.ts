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

	async getById(id: string) {
		const room = await this.prisma.room.findUnique({
			where: { id },
			select: returnRoomObject
		})

		const today = new Date()

		const currentMonday = new Date(today)
		currentMonday.setDate(today.getDate() - today.getDay())

		const nextMonday = new Date(currentMonday)
		nextMonday.setDate(currentMonday.getDate() + 7)

		const endOfNextWeek = new Date(nextMonday)
		endOfNextWeek.setDate(nextMonday.getDate() + 6)

		const classes = []

		const classesGroup = await this.prisma.class.findMany({
			where: {
				schedule: {
					date: { gte: currentMonday, lte: endOfNextWeek }
				},
				OR: [{ roomId: id }]
			},
			include: {
				subgroup: { select: { name: true } },
				teacher: {
					select: {
						user: { select: { fullName: true } }
					}
				},
				discipline: { select: { name: true } },
				room: {
					select: { name: true, address: true }
				},
				group: {
					select: {
						name: true
					}
				},
				flows: {
					select: {
						name: true,
						groups: {
							select: {
								name: true,
								courseNumber: true
							}
						}
					}
				},
				schedule: {
					select: {
						dayWeek: true,
						weekType: true,
						date: true
					}
				}
			},
			orderBy: [
				{ schedule: { date: 'asc' } },
				{ pairNumbers: 'asc' },
				{ subgroup: { name: 'asc' } }
			]
		})

		const finalTests = await this.prisma.finalTest.findMany({
			where: {
				schedule: {
					date: { gte: currentMonday, lte: endOfNextWeek }
				},
				OR: [{ roomId: id }]
			},
			orderBy: [{ schedule: { date: 'asc' } }, { pairNumbers: 'asc' }],
			select: {
				id: true,
				pairNumbers: true,
				types: true,
				discipline: {
					select: { name: true }
				},
				schedule: {
					select: {
						dayWeek: true,
						date: true
					}
				},
				group: {
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
				teacher: {
					select: {
						user: {
							select: { fullName: true }
						}
					}
				}
			}
		})

		classes.push(...classesGroup, ...finalTests)

		return { ...room, classes }
	}

	getAll(searchTerm?: string) {
		if (searchTerm) return this.search(searchTerm)

		return this.prisma.room.findMany({
			select: returnRoomObject
		})
	}

	private async search(searchTerm: string) {
		const today = new Date()
		const currentMonday = new Date(today)
		currentMonday.setDate(today.getDate() - today.getDay())
		const nextMonday = new Date(currentMonday)
		nextMonday.setDate(currentMonday.getDate() + 7)
		const endOfNextWeek = new Date(nextMonday)
		endOfNextWeek.setDate(nextMonday.getDate() + 6)

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
			select: {
				...returnRoomObject,
				finalTests: {
					where: {
						schedule: {
							date: { gte: currentMonday, lte: endOfNextWeek }
						}
					},
					select: {
						id: true,
						pairNumbers: true,
						types: true,
						discipline: {
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
						teacher: {
							select: {
								user: {
									select: { fullName: true }
								}
							}
						}
					}
				}
			},
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
					where: {
						schedule: {
							date: { gte: currentMonday, lte: endOfNextWeek }
						}
					},
					select: {
						type: true,
						pairNumbers: true,
						subgroup: {
							select: { name: true }
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
							select: { name: true }
						}
					}
				},
				finalTests: {
					where: {
						schedule: {
							date: { gte: currentMonday, lte: endOfNextWeek }
						}
					},
					select: {
						id: true,
						pairNumbers: true,
						types: true,
						discipline: {
							select: { name: true }
						},
						schedule: {
							select: {
								dayWeek: true,
								date: true
							}
						},
						teacher: {
							select: {
								user: {
									select: { fullName: true }
								}
							}
						},
						room: {
							select: {
								name: true,
								address: true
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
					where: {
						schedule: {
							date: { gte: currentMonday, lte: endOfNextWeek }
						}
					},
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
							select: { name: true }
						},
						schedule: {
							select: {
								dayWeek: true,
								date: true
							}
						},
						discipline: {
							select: { name: true }
						}
					}
				},
				finalTests: {
					where: {
						schedule: {
							date: { gte: currentMonday, lte: endOfNextWeek }
						}
					},
					select: {
						id: true,
						pairNumbers: true,
						types: true,
						discipline: {
							select: { name: true }
						},
						schedule: {
							select: {
								dayWeek: true,
								date: true
							}
						},
						room: {
							select: {
								name: true,
								address: true
							}
						}
					}
				}
			},
			orderBy: {
				user: { fullName: 'asc' }
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
