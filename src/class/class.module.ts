import { Module } from '@nestjs/common'
import { DisciplineService } from 'src/discipline/discipline.service'
import { EmploymentInfoService } from 'src/employment-info/employment-info.service'
import { GroupService } from 'src/group/group.service'
import { PrismaService } from 'src/prisma.service'
import { RoomService } from 'src/room/room.service'
import { ScheduleService } from 'src/schedule/schedule.service'
import { ClassController } from './class.controller'
import { ClassService } from './class.service'

@Module({
	controllers: [ClassController],
	providers: [
		ClassService,
		PrismaService,
		DisciplineService,
		EmploymentInfoService,
		RoomService,
		ScheduleService,
		GroupService
	]
})
export class ClassModule {}
