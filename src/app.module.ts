import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule as CronModule } from '@nestjs/schedule'
import { ServeStaticModule } from '@nestjs/serve-static'
import { path } from 'app-root-path'
import { AuthModule } from './auth/auth.module'
import { ClassModule } from './class/class.module'
import { DepartmentModule } from './department/department.module'
import { DisciplineModule } from './discipline/discipline.module'
import { EmploymentInfoModule } from './employment-info/employment-info.module'
import { FileModule } from './file/file.module'
import { FinalTestModule } from './final-test/final-test.module'
import { FlowModule } from './flow/flow.module'
import { GroupModule } from './group/group.module'
import { NoteModule } from './note/note.module'
import { RoomModule } from './room/room.module'
import { ScheduleModule } from './schedule/schedule.module'
import { SearchModule } from './search/search.module'
import { SemesterModule } from './semester/semester.module'
import { StudentExamResultModule } from './student-exam-result/student-exam-result.module'
import { StudentInfoModule } from './student-info/student-info.module'
import { SubgroupModule } from './subgroup/subgroup.module'
import { UserModule } from './user/user.module'
import { NotificationModule } from './notification/notification.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
	imports: [
		CronModule.forRoot(),
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/uploads'
		}),
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		StudentInfoModule,
		EmploymentInfoModule,
		GroupModule,
		RoomModule,
		ClassModule,
		ScheduleModule,
		DepartmentModule,
		FlowModule,
		SemesterModule,
		DisciplineModule,
		FinalTestModule,
		StudentExamResultModule,
		FileModule,
		SubgroupModule,
		NoteModule,
		SearchModule,
		NotificationModule,
		StatisticsModule
	]
})
export class AppModule {}
