import { Prisma } from '@prisma/client'

export const returnRoomObject: Prisma.RoomSelect = {
	id: true,
	createdAt: true,
	name: true,
	type: true,
	address: true,
	classes: true,
	finalTests: true
}
