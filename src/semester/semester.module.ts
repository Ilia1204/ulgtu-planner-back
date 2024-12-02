import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { SemesterController } from './semester.controller'
import { SemesterService } from './semester.service'
import { FlowService } from 'src/flow/flow.service'

@Module({
	controllers: [SemesterController],
	providers: [SemesterService, PrismaService, FlowService]
})
export class SemesterModule {}
