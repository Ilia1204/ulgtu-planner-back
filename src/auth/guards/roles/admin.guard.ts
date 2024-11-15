import {
	CanActivate,
	ExecutionContext,
	ForbiddenException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { User } from '@prisma/client'

export class OnlyAdminGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest<{ user: User }>()
		const user = request.user

		if (!user.roles.includes('admin'))
			throw new ForbiddenException('У Вас нет прав!')

		return true
	}
}
