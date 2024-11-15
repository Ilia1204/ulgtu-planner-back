import { Prisma } from '@prisma/client'

export const returnDepartmentObject: Prisma.DepartmentSelect = {
	id: true,
	createdAt: true,
	name: true,
	description: true,
	flows: true,
	disciplines: true,
	teachers: true
}
