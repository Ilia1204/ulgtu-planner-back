import { Prisma } from '@prisma/client'

export const returnFinalTestObject: Prisma.FinalTestSelect = {
	id: true,
	createdAt: true,
	date: true,
	types: true,
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
	semester: {
		select: {
			number: true
		}
	},
	studentExamResults: {
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
					group: {
						select: {
							name: true
						}
					}
				}
			}
		}
	}
}
