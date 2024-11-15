import { Prisma } from '@prisma/client'

export const returnScheduleObject: Prisma.ScheduleSelect = {
	id: true,
	createdAt: true,
	timeStart: true,
	timeEnd: true,
	dayWeek: true,
	weekType: true,
	group: {
		select: {
			name: true
		}
	},
	classes: {
		select: {
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
