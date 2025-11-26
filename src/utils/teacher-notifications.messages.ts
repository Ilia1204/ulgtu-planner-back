import { formatDisciplineName } from './format-discipline-name'

export const teacherTitles = [
	'⏰ Давайте, пора начинать!',
	'🎓 Готовьтесь, будет весело!',
	'📚 Учёба зовёт! Вперёд!',
	'🚀 Занятие начинается! Поехали!',
	'⏳ Готовы? Стартуем скоро!',
	'🔔 Включаемся! Это будет круто!',
	'🏃‍♂️ Пора в бой!',
	'🕒 Занятие на старте, давайте!',
	'📚 Пара зовёт! Успейте вовремя!',
	'⏰ Давайте начнём! Вперёд!',
	'📚 Занятие ждёт! Не опоздайте!',
	'🎓 Готовьтесь, будет жарко!',
	'🔥 Это будет интересно!',
	'⚡️ Не пропустите, пара начнётся!',
	'🚀 Занятие вот-вот!',
	'⏳ Готовьтесь, будет весело!',
	'💡 Пара зовёт, не зевайте!',
	'📚 Будьте на старте!',
	'🏃‍♀️ Готовьтесь, начнём скоро!',
	'⏰ Не упустите, пара начинается!'
]

export const teacherMessages = classItem => {
	const formattedName = formatDisciplineName(classItem.discipline.name)
	const roomName = `${
		classItem.room.type === 'auditorium'
			? `Ауд. ${classItem.room.name}`
			: `Каб. ${classItem.room.name}`
	}`

	const classType = `${classItem.type === 'lab' ? `лаба` : `практика`}`
	const groupName = `${
		classItem.group.name && classItem.subgroup.name
			? `${classItem.group.name} - ${classItem.subgroup.name}`
			: classItem.group.name
	}`

	return [
		`👨‍🏫 Ваша ${classType} у ${groupName} «${formattedName}» начнётся через 5 минут. ${roomName}`,
		`🚀 Пара у ${groupName} «${formattedName}» (${classType}) начинается через 5 минут! ${roomName}`,
		`🎓 Не забудьте, ${classType} у группы ${groupName} «${formattedName}» через 5 минут. ${roomName}`,
		`📚 Ваша ${classType} у ${groupName} «${formattedName}» стартует через 5 минут. ${roomName}`,
		`⏰ Через 5 минут начнётся ${classType} у ${groupName} «${formattedName}»! ${roomName}`,
		`🎒 Время для «${formattedName}» - ${classType} у ${groupName} стартует через 5 минут! ${roomName}`,
		`💡 Пара «${formattedName}» (${classType}) у группы ${groupName} стартует через 5 минут! ${roomName}`,
		`🚶‍♂️ Не опоздайте на пару «${formattedName}» (${classType}), она начнётся через 5 минут у группы ${groupName}! ${roomName}`,
		`🎓 «${formattedName}» - ${classType} у ${groupName} через 5 минут! ${roomName}`,
		`🕒 Напоминаем, ваше занятие «${formattedName}» у группы ${`${groupName} (${classType})`} стартует через 5 минут! ${roomName}`,
		`🔔 Будьте готовы, ${classType} у ${groupName} «${formattedName}» начнётся через 5 минут. ${roomName}`,
		`🏃‍♀️ Ваша ${classType} у ${groupName} «${formattedName}» начинается через 5 минут! ${roomName}`,
		`📚 Пара по предмету «${formattedName}» у группы ${`${groupName} - ${classType}`} через 5 минут! ${roomName}`,
		`🔥 Пара дисциплине «${formattedName}» у группы ${`${groupName} - ${classType}`} через 5 минут, не опоздай! ${roomName}`,
		`💥 Пара по предмету у ${groupName} «${formattedName}» через 5 минут! ${roomName}`,
		`⏳ Через 5 минут начнётся ${classType} у ${groupName} «${formattedName}»! ${roomName}`,
		`🎓 Готовьтесь, пара «${formattedName}» у группы ${groupName} начинается через 5 минут! ${roomName}`,
		`💡 Пара «${formattedName}» у ${groupName} через 5 минут! ${roomName}`,
		`🏃‍♂️ Время не ждёт, пара «${formattedName}» у ${groupName} стартует через 5 минут! ${roomName}`,
		`⚡️ Занятие «${formattedName}» у ${groupName} через 5 минут! ${roomName}`
	]
}
