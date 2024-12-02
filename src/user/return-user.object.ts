import { Prisma } from '@prisma/client'
import { returnStudentInfoObject } from '../student-info/return-student-info.object'

export const returnUserObject: Prisma.UserSelect = {
	id: true,
	createdAt: true,
	email: true,
	password: false,
	fullName: true,
	username: true,
	roles: true,
	avatarPath: true,
	phoneNumber: true,
	recoveryEmail: true,
	birthDate: true,
	libraryCardNumber: true,
	studentInfo: {
		select: {
			...returnStudentInfoObject
		}
	},
	employmentInfo: {
		select: {
			department: {
				select: {
					name: true
				}
			},
			position: true,
			departmentId: true
		}
	},
	chatGroups: true,
	messages: true
}
