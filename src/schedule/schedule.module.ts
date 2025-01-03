import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ScheduleController } from './schedule.controller'
import { ScheduleService } from './schedule.service'

@Module({
	controllers: [ScheduleController],
	providers: [ScheduleService, PrismaService]
})
export class ScheduleModule {}
