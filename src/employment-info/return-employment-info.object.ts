import { Prisma } from '@prisma/client'
import { returnClassObject } from './../class/return-class.object'

export const returnEmploymentInfoObject: Prisma.EmploymentInfoSelect = {
	id: true,
	position: true,
	user: {
		select: {
			fullName: true,
			avatarPath: true,
			email: true
		}
	},
	department: {
		select: {
			name: true
		}
	},
	classes: {
		select: {
			...returnClassObject,
			teacher: false,
			flows: false,
			attachments: false,
			notes: false
		},
		orderBy: [
			{
				schedule: {
					date: 'asc'
				}
			},
			{ pairNumbers: 'asc' }
		]
	}
}
