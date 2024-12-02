import { Prisma } from '@prisma/client'

export const returnGroupObject: Prisma.GroupSelect = {
	id: true,
	name: true,
	createdAt: true,
	studyStartDate: true,
	studyEndDate: true,
	educationLevel: true,
	studyForm: true,
	flow: {
		select: {
			id: true,
			faculty: true,
			semesters: {
				select: {
					id: true,
					number: true
				}
			}
		}
	},
	classes: {
		select: {
			id: true,
			pairNumbers: true,
			type: true,
			subgroup: {
				select: {
					name: true
				}
			},
			teacher: {
				select: {
					user: {
						select: { fullName: true }
					}
				}
			},
			discipline: {
				select: { name: true }
			},
			room: {
				select: {
					name: true,
					address: true
				}
			},
			schedule: true
		},
		orderBy: [
			{
				schedule: {
					date: 'asc'
				}
			},
			{
				pairNumbers: 'asc'
			}
		]
	}
}
