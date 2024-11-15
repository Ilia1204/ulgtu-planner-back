import { Module } from '@nestjs/common'
import { GroupService } from 'src/group/group.service'
import { PrismaService } from 'src/prisma.service'
import { ScheduleController } from './schedule.controller'
import { ScheduleService } from './schedule.service'

@Module({
	controllers: [ScheduleController],
	providers: [ScheduleService, PrismaService, GroupService]
})
export class ScheduleModule {}
