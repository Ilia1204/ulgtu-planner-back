import { Prisma } from '@prisma/client'

export const returnClassObject: Prisma.ClassSelect = {
	id: true,
	createdAt: true,
	pairNumbers: true,
	type: true,
	updatedAt: true,
	room: {
		select: {
			id: true,
			name: true,
			address: true,
			type: true
		}
	},
	group: {
		select: {
			name: true
		}
	},
	subgroup: {
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
			id: true,
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
	flows: {
		select: {
			groups: {
				select: {
					name: true
				}
			}
		}
	},
	attachments: true,
	notes: true
}
