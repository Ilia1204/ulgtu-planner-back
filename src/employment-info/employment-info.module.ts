import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { EmploymentInfoController } from './employment-info.controller'
import { EmploymentInfoService } from './employment-info.service'

@Module({
	controllers: [EmploymentInfoController],
	providers: [EmploymentInfoService, PrismaService]
})
export class EmploymentInfoModule {}
