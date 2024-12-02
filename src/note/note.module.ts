import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { StudentInfoService } from 'src/student-info/student-info.service'
import { UserService } from 'src/user/user.service'
import { NoteController } from './note.controller'
import { NoteService } from './note.service'
import { EmploymentInfoService } from 'src/employment-info/employment-info.service'

@Module({
	controllers: [NoteController],
	providers: [
		NoteService,
		PrismaService,
		UserService,
		StudentInfoService,
		EmploymentInfoService
	]
})
export class NoteModule {}
