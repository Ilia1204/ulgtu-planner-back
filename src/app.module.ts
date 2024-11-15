import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { path } from 'app-root-path'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module';
import { StudentInfoModule } from './student-info/student-info.module';
import { EmploymentInfoModule } from './employment-info/employment-info.module';
import { GroupModule } from './group/group.module';
import { RoomModule } from './room/room.module';
import { ClassModule } from './class/class.module';
import { ScheduleModule } from './schedule/schedule.module';
import { CourseModule } from './course/course.module';
import { DepartmentModule } from './department/department.module';
import { FlowModule } from './flow/flow.module';
import { SemesterModule } from './semester/semester.module';
import { DisciplineModule } from './discipline/discipline.module';
import { FinalTestModule } from './final-test/final-test.module';
import { StudentExamResultModule } from './student-exam-result/student-exam-result.module';

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/uploads'
		}),
		AuthModule,
		UserModule,
		StudentInfoModule,
		EmploymentInfoModule,
		GroupModule,
		RoomModule,
		ClassModule,
		ScheduleModule,
		CourseModule,
		DepartmentModule,
		FlowModule,
		SemesterModule,
		DisciplineModule,
		FinalTestModule,
		StudentExamResultModule
	]
})
export class AppModule {}
