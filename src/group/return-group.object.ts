import { Prisma } from '@prisma/client'

export const returnGroupObject: Prisma.GroupSelect = {
	id: true,
	name: true,
	createdAt: true,
	subgroups: {
		select: {
			name: true,
			students: {
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
	flow: {
		select: {
			semesters: {
				select: {
					id: true,
					number: true
				}
			}
		}
	},
	schedule: {
		select: {
			dayWeek: true,
			weekType: true,
			classes: true
		}
	}
}
