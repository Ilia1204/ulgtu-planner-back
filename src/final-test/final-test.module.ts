import { Module } from '@nestjs/common'
import { DisciplineService } from 'src/discipline/discipline.service'
import { EmploymentInfoService } from 'src/employment-info/employment-info.service'
import { PrismaService } from 'src/prisma.service'
import { RoomService } from 'src/room/room.service'
import { SemesterService } from 'src/semester/semester.service'
import { FinalTestController } from './final-test.controller'
import { FinalTestService } from './final-test.service'
import { FlowService } from 'src/flow/flow.service'

@Module({
	controllers: [FinalTestController],
	providers: [
		FinalTestService,
		PrismaService,
		DisciplineService,
		EmploymentInfoService,
		RoomService,
		SemesterService,
		FlowService
	]
})
export class FinalTestModule {}
