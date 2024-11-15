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
	group: {
		select: {
			name: true
		}
	},
	StudentExamResult: true
}
