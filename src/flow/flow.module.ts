import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { FlowController } from './flow.controller'
import { FlowService } from './flow.service'

@Module({
	controllers: [FlowController],
	providers: [FlowService, PrismaService]
})
export class FlowModule {}
