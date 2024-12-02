import { Injectable } from '@nestjs/common'
import { EmploymentInfoService } from 'src/employment-info/employment-info.service'
import { GroupService } from 'src/group/group.service'
import { RoomService } from 'src/room/room.service'

@Injectable()
export class SearchService {
	constructor(
		private roomService: RoomService,
		private groupService: GroupService,
		private teacherService: EmploymentInfoService
	) {}

	// async search(searchTerm: string) {
	// 	const [rooms, groups, teachers] = await Promise.all([
	// 		this.roomService.search(searchTerm),
	// 		this.groupService.search(searchTerm),
	// 		this.teacherService.search(searchTerm)
	// 	])

	// 	return [...rooms, ...groups, ...teachers]
	// }
}
