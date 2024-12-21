import { Module } from '@nestjs/common'
import { DisciplineService } from 'src/discipline/discipline.service'
import { EmploymentInfoService } from 'src/employment-info/employment-info.service'
import { FlowService } from 'src/flow/flow.service'
import { GroupService } from 'src/group/group.service'
import { PrismaService } from 'src/prisma.service'
import { RoomService } from 'src/room/room.service'
import { SemesterService } from 'src/semester/semester.service'
import { FinalTestController } from './final-test.controller'
import { FinalTestService } from './final-test.service'
import { ScheduleService } from 'src/schedule/schedule.service'

@Module({
	controllers: [FinalTestController],
	providers: [
		FinalTestService,
		PrismaService,
		DisciplineService,
		EmploymentInfoService,
		RoomService,
		SemesterService,
		FlowService,
		ScheduleService,
		GroupService
	]
})
export class FinalTestModule {}
