import { Module } from '@nestjs/common'
import { GroupService } from 'src/group/group.service'
import { PrismaService } from 'src/prisma.service'
import { SubgroupController } from './subgroup.controller'
import { SubgroupService } from './subgroup.service'

@Module({
	controllers: [SubgroupController],
	providers: [SubgroupService, PrismaService, GroupService]
})
export class SubgroupModule {}
