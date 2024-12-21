import { Module } from '@nestjs/common'
import { DisciplineService } from 'src/discipline/discipline.service'
import { EmploymentInfoService } from 'src/employment-info/employment-info.service'
import { FinalTestService } from 'src/final-test/final-test.service'
import { FlowService } from 'src/flow/flow.service'
import { PrismaService } from 'src/prisma.service'
import { RoomService } from 'src/room/room.service'
import { ScheduleService } from 'src/schedule/schedule.service'
import { SemesterService } from 'src/semester/semester.service'
import { StudentInfoService } from 'src/student-info/student-info.service'
import { StudentExamResultController } from './student-exam-result.controller'
import { StudentExamResultService } from './student-exam-result.service'
import { GroupService } from 'src/group/group.service'

@Module({
	controllers: [StudentExamResultController],
	providers: [
		StudentExamResultService,
		PrismaService,
		StudentInfoService,
		FinalTestService,
		RoomService,
		SemesterService,
		EmploymentInfoService,
		DisciplineService,
		FlowService,
		ScheduleService,
		GroupService
	]
})
export class StudentExamResultModule {}
