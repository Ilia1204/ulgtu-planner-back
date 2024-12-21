import { Prisma } from '@prisma/client'

export const returnClassObject: Prisma.ClassSelect = {
	id: true,
	createdAt: true,
	pairNumbers: true,
	type: true,
	courseNumber: true,
	updatedAt: true,
	subgroupId: true,
	groupId: true,
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
			id: true,
			name: true
		}
	},
	subgroup: {
		select: {
			id: true,
			name: true
		}
	},
	schedule: {
		select: {
			id: true,
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
			id: true,
			name: true,
			teachers: {
				select: {
					user: {
						select: {
							fullName: true
						}
					}
				}
			}
		}
	},
	flows: true,
	attachments: true,
	notes: true
}
