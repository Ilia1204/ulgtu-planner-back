import { Prisma } from '@prisma/client'

export const returnClassObject: Prisma.ClassSelect = {
	id: true,
	createdAt: true,

	pairNumber: true,
	type: true,
	room: {
		select: {
			name: true,
			address: true,
			type: true
		}
	},
	schedule: {
		select: {
			dayWeek: true
		}
	},
	teacher: {
		select: {
			position: true,
			user: {
				select: {
					fullName: true
				}
			}
		}
	},
	discipline: {
		select: {
			name: true
		}
	},
	flows: true,
	attachments: true,
	notes: true
}
