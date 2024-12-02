import { Module } from '@nestjs/common'
import { EmploymentInfoService } from 'src/employment-info/employment-info.service'
import { GroupService } from 'src/group/group.service'
import { RoomService } from 'src/room/room.service'
import { SearchController } from './search.controller'
import { SearchService } from './search.service'
import { PrismaService } from 'src/prisma.service'

@Module({
	controllers: [SearchController],
	providers: [
		SearchService,
		PrismaService,
		RoomService,
		EmploymentInfoService,
		GroupService
	]
})
export class SearchModule {}
