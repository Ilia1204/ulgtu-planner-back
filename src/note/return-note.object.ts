import { Prisma } from '@prisma/client'

export const returnNoteObject: Prisma.NoteSelect = {
	id: true,
	createdAt: true,
	content: true,
	isPrivate: true,
	user: {
		select: {
			fullName: true
		}
	},
	userId: true,
	classId: true
}
