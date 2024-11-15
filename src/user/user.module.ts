import { Module } from '@nestjs/common'
import { EmploymentInfoService } from 'src/employment-info/employment-info.service'
import { PrismaService } from 'src/prisma.service'
import { StudentInfoService } from 'src/student-info/student-info.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	controllers: [UserController],
	providers: [
		UserService,
		PrismaService,
		StudentInfoService,
		EmploymentInfoService
	]
})
export class UserModule {}
