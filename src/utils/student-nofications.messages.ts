import { formatDisciplineName } from './format-discipline-name'

export const studentTitles = (studentName: string) => {
	return [
		`🚀 ${studentName}, беги, не опоздай!`,
		'⏰ Уже пора, хватай сумку!',
		`🏃‍♀️ ${studentName}! Не задерживайся, стартуем скоро!`,
		'📚 Долг зовёт, спеши!',
		'🔔 Пора вставать, начнём!',
		'💡 Готовься, вот-вот начнём!',
		'⏳ Пора на занятие, давай!',
		`⚡️ ${studentName}! Не пропусти начало!`,
		'🎓 Стартуем скоро, держись!',
		'🔔 Будь готов, начинается!',
		`🧠 ${studentName}, погнали получать знания!`,
		'🚀 Начинаем! Вперёд!',
		'💥 Скоро начнём! Быстрее!',
		`🎒 ${studentName}, время на пары!`,
		'📚 Готовься к занятию!',
		'🎓 Не опоздай, пора на занятие!',
		'🏃‍♂️ Пора на учебу, бегом!',
		`⏰ ${studentName}, не пропусти старт!`,
		'⏳ Готовься, начинаем!'
	]
}

export const studentMessages = classItem => {
	const formattedName = formatDisciplineName(classItem.discipline.name)
	const roomName = `${
		classItem.room.type === 'auditorium'
			? `Ауд. ${classItem.room.name}`
			: `Каб. ${classItem.room.name}`
	}`

	const classType = `${
		classItem.type === 'lab'
			? 'лаба'
			: classItem.type === 'lecture'
			? 'лекция'
			: 'практика'
	}`

	return [
		`👨‍🏫 Ваша ${classType} «${formattedName}» начнётся через 5 минут. ${roomName}`,
		`🚀 Пара «${formattedName}» начинается через 5 минут! ${roomName}`,
		`🎓 Не забудьте, ${classType} «${formattedName}» через 5 минут. ${roomName}`,
		`📚 Пара «${formattedName}» начнётся через 5 минут. ${roomName}`,
		`⏰ Через 5 минут начнётся ${classType} «${formattedName}»! ${roomName}`,
		`🎒 Время для «${formattedName}» - пара начнётся через 5 минут! ${roomName}`,
		`💡 Пара «${formattedName}» стартует через 5 минут! ${roomName}`,
		`🚶‍♂️ Не опоздайте на пару «${formattedName}» (${classType}), она начнётся через 5 минут! 🏃‍♂️ ${roomName}`,
		`🎓 «${formattedName}» - ${classType} через 5 минут! ${roomName}`,
		`🕒 Напоминаем, ваша ${classType} «${formattedName}» начнётся через 5 минут! ${roomName}`,
		`🔔 Будьте готовы, ${classType} «${formattedName}» начнётся через 5 минут. ${roomName}`,
		`🏃‍♀️ Занятие «${formattedName}» (${classType}) начнётся через 5 минут! ${roomName}`,
		`📚 Пара «${formattedName}» через 5 минут! ${roomName}`,
		`🔥 Пара «${formattedName}» через 5 минут, не опоздай! ${roomName}`,
		`💥 Пара «${formattedName}» через 5 минут! ${roomName}`,
		`⏳ Через 5 минут начнётся ${classType} «${formattedName}»! ${roomName}`,
		`🎓 Готовься, ${classType} «${formattedName}» начнётся через 5 минут! ${roomName}`,
		`💡 Пара «${formattedName}» через 5 минут! ${roomName}`,
		`🏃‍♂️ Время не ждёт, ${classType} «${formattedName}» начнётся через 5 минут! ${roomName}`,
		`⚡️ Занятие «${formattedName}» (${classType}) через 5 минут! ${roomName}`
	]
}
