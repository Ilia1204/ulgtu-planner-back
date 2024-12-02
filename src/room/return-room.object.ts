import { Prisma } from '@prisma/client'

export const returnRoomObject: Prisma.RoomSelect = {
	id: true,
	createdAt: true,
	name: true,
	type: true,
	address: true,
	classes: {
		select: {
			group: {
				select: {
					name: true
				}
			},
			teacher: {
				select: {
					user: {
						select: {
							fullName: true
						}
					}
				}
			},
			flows: {
				select: {
					name: true
				}
			},
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
			pairNumbers: true,
			type: true,
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
		},
		orderBy: [
			{
				schedule: {
					date: 'asc'
				}
			},
			{ pairNumbers: 'asc' }
		]
	}
}
