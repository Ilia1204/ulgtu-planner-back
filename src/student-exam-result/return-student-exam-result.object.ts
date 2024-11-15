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
			date: true,
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
			}
		}
	}
}
