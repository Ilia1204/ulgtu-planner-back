import { Module } from '@nestjs/common'
import { DisciplineService } from 'src/discipline/discipline.service'
import { EmploymentInfoService } from 'src/employment-info/employment-info.service'
import { GroupService } from 'src/group/group.service'
import { NotificationService } from 'src/notification/notification.service'
import { PrismaService } from 'src/prisma.service'
import { RoomService } from 'src/room/room.service'
import { ScheduleService } from 'src/schedule/schedule.service'
import { SubgroupService } from 'src/subgroup/subgroup.service'
import { UserService } from 'src/user/user.service'
import { ClassController } from './class.controller'
import { ClassService } from './class.service'
import { StudentInfoService } from 'src/student-info/student-info.service'

@Module({
	controllers: [ClassController],
	providers: [
		ClassService,
		PrismaService,
		DisciplineService,
		EmploymentInfoService,
		RoomService,
		ScheduleService,
		GroupService,
		SubgroupService,
		NotificationService,
		UserService,
		StudentInfoService
	]
})
export class ClassModule {}
