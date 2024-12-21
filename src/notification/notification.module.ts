import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { StudentInfoService } from 'src/student-info/student-info.service'
import { UserService } from 'src/user/user.service'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'
import { EmploymentInfoService } from 'src/employment-info/employment-info.service'

@Module({
	controllers: [NotificationController],
	providers: [
		NotificationService,
		PrismaService,
		UserService,
		StudentInfoService,
		EmploymentInfoService
	]
})
export class NotificationModule {}
