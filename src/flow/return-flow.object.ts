import { Prisma } from '@prisma/client'

export const returnFlowObject: Prisma.FlowSelect = {
	id: true,
	createdAt: true,
	name: true,
	department: {
		select: {
			name: true
		}
	},
	semesters: {
		select: {
			id: true,
			number: true
		}
	}
}
