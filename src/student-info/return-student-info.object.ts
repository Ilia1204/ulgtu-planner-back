import { Prisma } from '@prisma/client'

export const returnStudentInfoObject: Prisma.StudentInfoSelect = {
	id: true,
	userId: true,
	creditCardNumber: true,
	groupId: true,
	subgroupId: true,
	user: {
		select: {
			fullName: true,
			roles: true
		}
	},
	group: {
		select: {
			id: true,
			educationLevel: true,
			studyForm: true,
			name: true,
			flow: {
				select: {
					id: true,
					name: true,
					faculty: true
				}
			}
		}
	},
	subgroup: {
		select: {
			name: true
		}
	},
	studentExamsResults: true
}
