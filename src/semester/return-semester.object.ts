import { Prisma } from '@prisma/client'

export const returnSemesterObject: Prisma.SemesterSelect = {
	id: true,
	createdAt: true,
	number: true,
	flow: true,
	finalTests: true
}
