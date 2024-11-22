import { Prisma } from '@prisma/client'

export const returnScheduleObject: Prisma.ScheduleSelect = {
	id: true,
	createdAt: true,
	dayWeek: true,
	weekType: true,
	classes: {
		orderBy: {
			pairNumber: 'asc'
		},
		select: {
			roomId: false,
			teacherId: false,
			disciplineId: false,
			pairNumber: true,
			type: true,
			discipline: {
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
			room: {
				select: {
					name: true,
					address: true
				}
			},
			subgroup: true
		}
	}
}
