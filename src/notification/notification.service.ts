import { Injectable, NotFoundException } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { addMinutes, isWithinInterval, startOfDay } from 'date-fns'
import { Expo } from 'expo-server-sdk'
import { returnClassObject } from 'src/class/return-class.object'
import { PrismaService } from 'src/prisma.service'
import { returnUserObject } from 'src/user/return-user.object'
import { UserService } from 'src/user/user.service'
import { breakMessages } from 'src/utils/break.messages'
import {
	studentMessages,
	studentTitles
} from 'src/utils/student-nofications.messages'
import {
	teacherMessages,
	teacherTitles
} from 'src/utils/teacher-notifications.messages'

@Injectable()
export class NotificationService {
	private expo = new Expo()
	constructor(
		private prisma: PrismaService,
		private userService: UserService
	) {}

	private pairStartTimes = {
		1: { hour: 8, minute: 30 },
		2: { hour: 10, minute: 0 },
		3: { hour: 11, minute: 30 },
		4: { hour: 13, minute: 30 },
		5: { hour: 15, minute: 0 },
		6: { hour: 16, minute: 30 },
		7: { hour: 18, minute: 0 },
		8: { hour: 19, minute: 30 }
	}

	private getPairStartTime(pairNumber: number, scheduleDate: Date): Date {
		const pairTime = this.pairStartTimes[pairNumber]
		if (!pairTime)
			throw new Error(`Нет времени для пары с номером ${pairNumber}`)

		const dateWithoutTime = startOfDay(scheduleDate)

		return new Date(
			dateWithoutTime.getFullYear(),
			dateWithoutTime.getMonth(),
			dateWithoutTime.getDate(),
			pairTime.hour,
			pairTime.minute
		)
	}

	async sendNotification(userId, title, message) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId }
		})

		if (user?.pushToken) {
			const messages = [
				{
					to: user.pushToken,
					sound: 'default',
					title,
					body: message
				}
			]

			try {
				const tickets = await this.expo.sendPushNotificationsAsync(messages)

				if (
					tickets[0].status === 'error' &&
					tickets[0].details?.error === 'DeviceNotRegistered'
				)
					await this.prisma.user.update({
						where: { id: userId },
						data: { pushToken: null }
					})
			} catch (error) {
				console.error('Error sending notification:', error)
			}
		}
	}

	async sendNotificationToStudentsAndTeachers(classItem) {
		let students

		if (classItem.type === 'lecture' && classItem.flows) {
			const flowGroupIds = classItem.flows.flatMap(flow =>
				flow.groups.map(group => group.id)
			)

			students = await this.prisma.user.findMany({
				where: {
					studentInfo: {
						groupId: { in: flowGroupIds }
					}
				},
				select: returnUserObject
			})
		} else {
			students = await this.prisma.user.findMany({
				where: {
					studentInfo: {
						groupId: classItem.groupId
					},
					...(classItem.subgroupId && {
						studentInfo: {
							subgroupId: classItem.subgroupId
						}
					})
				},
				select: returnUserObject
			})
		}

		const sendStudentNotifications = students.map(async student => {
			const titles = studentTitles(student?.fullName.split(' ')[1])
			const title = titles[Math.floor(Math.random() * titles.length)]

			const messages = studentMessages(classItem)
			const message = messages[Math.floor(Math.random() * messages.length)]

			await this.sendNotification(student.id, title, message)
		})

		await Promise.all(sendStudentNotifications)

		const teachers = await this.prisma.user.findMany({
			where: {
				employmentInfo: {
					classes: {
						some: {
							id: classItem.id
						}
					}
				}
			}
		})

		const sendTeacherNotifications = teachers.map(async teacher => {
			const title =
				teacherTitles[Math.floor(Math.random() * teacherTitles.length)]
			const messages = teacherMessages(classItem)
			const message = messages[Math.floor(Math.random() * messages.length)]

			await this.sendNotification(teacher.id, title, message)
		})

		await Promise.all(sendTeacherNotifications)
	}

	async sendNotificationsForClassSchedule() {
		const now = new Date()
		const todayStart = startOfDay(now)

		const schedules = await this.prisma.schedule.findMany({
			where: {
				date: {
					gte: todayStart,
					lt: addMinutes(todayStart, 24 * 60)
				}
			},
			include: {
				classes: {
					select: {
						...returnClassObject,
						flows: {
							select: {
								id: true,
								name: true,
								groups: true
							}
						}
					}
				}
			}
		})

		for (const schedule of schedules) {
			const dateWithoutTime = startOfDay(new Date(schedule.date))

			if (dateWithoutTime.getTime() === todayStart.getTime()) {
				for (const classItem of schedule.classes) {
					for (const pairNumber of classItem.pairNumbers) {
						const pairStartTime = this.getPairStartTime(
							pairNumber,
							dateWithoutTime
						)
						const notificationTime = addMinutes(pairStartTime, -5)

						if (
							isWithinInterval(now, {
								start: notificationTime,
								end: addMinutes(notificationTime, 1)
							})
						)
							await this.sendNotificationToStudentsAndTeachers(classItem)
					}
				}
			}
		}
	}

	@Cron('* * * * *')
	async checkScheduleAndSendNotifications() {
		await this.sendNotificationsForClassSchedule()
	}

	async savePushToken(id: string, token: string) {
		const user = await this.userService.getById(id)
		if (!user) throw new NotFoundException('Пользователь не найден')

		return this.prisma.user.update({
			where: { id: user.id },
			data: { pushToken: token }
		})
	}

	@Cron('50 12 * * *')
	async sendBreakNotifications() {
		const today = startOfDay(new Date())
		const schedules = await this.prisma.schedule.findMany({
			where: {
				date: {
					gte: today,
					lt: addMinutes(today, 24 * 60)
				}
			},
			include: {
				classes: {
					select: {
						id: true,
						pairNumbers: true,
						group: {
							select: {
								id: true
							}
						},
						subgroupId: true
					}
				}
			}
		})

		for (const schedule of schedules) {
			for (const classItem of schedule.classes) {
				if (classItem.pairNumbers.includes(3)) {
					const hasBothPairs = classItem.pairNumbers.includes(4)

					const nextClass = hasBothPairs
						? classItem
						: schedule.classes.find(
								nextItem =>
									nextItem.group.id === classItem.group.id &&
									nextItem.subgroupId === classItem.subgroupId &&
									nextItem.pairNumbers.includes(4)
						  )

					if (nextClass) {
						const students = await this.prisma.user.findMany({
							where: {
								studentInfo: {
									groupId: classItem.group.id,
									...(classItem.subgroupId && {
										subgroupId: classItem.subgroupId
									})
								}
							}
						})

						const sendStudentNotifications = students.map(async student => {
							const message =
								breakMessages[Math.floor(Math.random() * breakMessages.length)]
							await this.sendNotification(
								student.id,
								'Перерыв на 40 минут',
								message
							)
						})

						await Promise.all(sendStudentNotifications)

						const teachers = await this.prisma.user.findMany({
							where: {
								employmentInfo: {
									classes: {
										some: {
											id: nextClass.id
										}
									}
								}
							}
						})

						const sendTeacherNotifications = teachers.map(async teacher => {
							const message =
								breakMessages[Math.floor(Math.random() * breakMessages.length)]
							await this.sendNotification(
								teacher.id,
								'Перерыв на 40 минут',
								message
							)
						})

						await Promise.all(sendTeacherNotifications)
					}
				}
			}
		}
	}
}
