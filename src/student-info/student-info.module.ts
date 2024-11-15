import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { StudentInfoController } from './student-info.controller'
import { StudentInfoService } from './student-info.service'

@Module({
	controllers: [StudentInfoController],
	providers: [StudentInfoService, PrismaService]
})
export class StudentInfoModule {}
