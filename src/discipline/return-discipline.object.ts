import { Prisma } from '@prisma/client'

export const returnDisciplineObject: Prisma.DisciplineSelect = {
	id: true,
	createdAt: true,
	name: true,
	department: {
		select: {
			name: true
		}
	},
	teachers: {
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
	finalTests: true,
	classes: true
}
