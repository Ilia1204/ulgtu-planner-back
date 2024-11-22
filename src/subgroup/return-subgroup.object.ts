import { Prisma } from '@prisma/client'

export const returnSubgroupObject: Prisma.SubgroupSelect = {
	id: true,
	name: true,
	createdAt: true,
	group: {
		select: {
			name: true
		}
	},
	classes: true,
	students: {
		select: {
			user: {
				select: {
					fullName: true
				}
			}
		}
	}
}
