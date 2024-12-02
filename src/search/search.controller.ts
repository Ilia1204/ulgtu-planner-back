import { Controller } from '@nestjs/common'
import { SearchService } from './search.service'

@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	// @Get()
	// async getAll(@Query('searchTerm') searchTerm?: string) {
	// 	return this.searchService.search(searchTerm)
	// }
}
