import { Module } from '@nestjs/common'
import { EmploymentInfoService } from 'src/employment-info/employment-info.service'
import { FinalTestService } from 'src/final-test/final-test.service'
import { PrismaService } from 'src/prisma.service'
import { RoomService } from 'src/room/room.service'
import { SemesterService } from 'src/semester/semester.service'
import { StudentInfoService } from 'src/student-info/student-info.service'
import { StudentExamResultController } from './student-exam-result.controller'
import { StudentExamResultService } from './student-exam-result.service'
import { DisciplineService } from 'src/discipline/discipline.service'

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
		DisciplineService
	]
})
export class StudentExamResultModule {}
