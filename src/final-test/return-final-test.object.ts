import { Prisma } from '@prisma/client'

export const returnFinalTestObject: Prisma.FinalTestSelect = {
	id: true,
	createdAt: true,
	pairNumbers: true,
	types: true,
	updatedAt: true,
	discipline: {
		select: {
			name: true
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
	room: {
		select: {
			id: true,
			name: true,
			address: true,
			type: true
		}
	},
	semester: {
		select: {
			number: true
		}
	},
	schedule: {
		select: {
			id: true,
			dayWeek: true,
			date: true
		}
	},
	group: {
		select: {
			id: true,
			name: true
		}
	},
	courseNumber: true,
	flows: true,
	studentExamsResults: {
		select: {
			result: true,
			type: true,
			student: {
				select: {
					user: {
						select: {
							fullName: true
						}
					},
					subgroup: {
						select: {
							name: true
						}
					}
				}
			}
		}
	}
}
