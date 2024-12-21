import { addMinutes, parseISO } from 'date-fns'

const pairTimes = {
	1: { start: '08:30', end: '09:50' },
	2: { start: '10:00', end: '11:20' },
	3: { start: '13:14', end: '12:50' },
	4: { start: '13:30', end: '14:50' },
	5: { start: '15:00', end: '16:20' },
	6: { start: '16:30', end: '17:50' },
	7: { start: '18:00', end: '19:20' },
	8: { start: '19:30', end: '20:50' }
}

export function getNotificationTime(pairNumber, date) {
	const pairStartTime = pairTimes[pairNumber]?.start
	if (!pairStartTime) {
		return null
	}

	const classDate = parseISO(date)
	const [hours, minutes] = pairStartTime.split(':')
	const pairStartMoment = new Date(classDate.setHours(hours, minutes))

	const notificationTime = addMinutes(pairStartMoment, -5)
	return notificationTime
}
