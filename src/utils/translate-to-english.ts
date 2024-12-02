import { EducationLevel, StudyForm } from '@prisma/client'

export const reverseStudyFormTranslations: Record<string, string> = {
	очная: 'full_time',
	'очно-заочная': 'part_time',
	заочная: 'extramural',
	дистанционная: 'distance',
	смешанная: 'mixed',
	экстернатная: 'externship'
}

export const reverseEducationalLevelTranslations: Record<string, string> = {
	бакалавриат: 'bachelor',
	магистратура: 'master',
	докторантура: 'doctorate',
	специалитет: 'specialty',
	'профессиональная подготовка': 'vocational',
	аспирантура: 'postgraduate'
}

export const getStudyFormFromTranslation = (
	value: string
): StudyForm | null => {
	return (reverseStudyFormTranslations[value] as StudyForm) || null
}

export const getEducationLevelFromTranslation = (
	value: string
): EducationLevel | null => {
	return (reverseEducationalLevelTranslations[value] as EducationLevel) || null
}
