import { Prisma } from '@prisma/client'

export const returnGroupObject: Prisma.GroupSelect = {
	id: true,
	name: true,
	createdAt: true,
	studentInfo: {
		orderBy: {
			user: {
				createdAt: 'asc'
			}
		},
		select: {
			educationLevel: true,
			studyForm: true,
			user: {
				select: {
					fullName: true
				}
			}
		}
	},
	flow: {
		select: {
			semesters: {
				select: {
					number: true,
					finalTests: {
						select: {
							types: true,
							date: true,
							studentExamResults: {
								select: {
									result: true,
									type: true
								}
							}
						}
					}
				}
			}
		}
	},
	schedule: true
}
