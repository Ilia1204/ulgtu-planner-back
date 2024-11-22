import { Prisma } from '@prisma/client'

export const returnStudentInfoObject: Prisma.StudentInfoSelect = {
	id: true,
	studyForm: true,
	educationLevel: true,
	fundingSource: true,
	courses: true,
	userId: true,
	creditCardNumber: true,
	user: {
		select: {
			fullName: true,
			roles: true
		}
	},
	subgroup: {
		select: {
			name: true,
			group: {
				select: {
					name: true,
					flow: {
						select: {
							id: true,
							name: true,
							faculty: true
						}
					}
				}
			}
		}
	},
	studentExamsResults: true
}
