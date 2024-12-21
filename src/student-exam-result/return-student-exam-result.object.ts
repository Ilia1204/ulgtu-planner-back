import { Prisma } from '@prisma/client'

export const returnStudentExamResultObject: Prisma.StudentExamResultSelect = {
	id: true,
	createdAt: true,
	result: true,
	type: true,
	student: {
		select: {
			user: {
				select: {
					fullName: true
				}
			}
		}
	},
	finalTest: {
		select: {
			pairNumbers: true,
			discipline: {
				select: {
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
			group: {
				select: {
					id: true,
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
			}
		}
	}
}
