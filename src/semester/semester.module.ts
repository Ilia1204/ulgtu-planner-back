import { Module } from '@nestjs/common'
import { SemesterController } from './semester.controller'
import { SemesterService } from './semester.service'
import { PrismaService } from 'src/prisma.service'

@Module({
	controllers: [SemesterController],
	providers: [SemesterService, PrismaService]
})
export class SemesterModule {}
