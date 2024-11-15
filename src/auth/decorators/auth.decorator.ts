import { applyDecorators, UseGuards } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { JwtAuthGuard } from '../guards/jwt.guard'
import { OnlyAdminGuard } from '../guards/roles/admin.guard'
import { OnlyAssistantGuard } from '../guards/roles/assistant.guard'
import { OnlyCourseCreatorGuard } from '../guards/roles/course-creator.guard'
import { OnlyTeacherGuard } from '../guards/roles/teacher.guard'

export const Auth = (role: UserRole = UserRole.student) => {
	if (role === UserRole.admin)
		return applyDecorators(UseGuards(JwtAuthGuard, OnlyAdminGuard))
	if (role === UserRole.teacher)
		return applyDecorators(UseGuards(JwtAuthGuard, OnlyTeacherGuard))
	if (role === UserRole.assistant)
		return applyDecorators(UseGuards(JwtAuthGuard, OnlyAssistantGuard))
	if (role === UserRole.course_creator)
		return applyDecorators(UseGuards(JwtAuthGuard, OnlyCourseCreatorGuard))

	return applyDecorators(UseGuards(JwtAuthGuard))
}
