import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { NoteDto, UpdateNoteDto } from './note.dto'
import { NoteService } from './note.service'

@Controller('notes')
export class NoteController {
	constructor(private readonly noteService: NoteService) {}

	@Get()
	@Auth()
	async getAll(@CurrentUser('id') id: string) {
		return this.noteService.getAll(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post()
	async createNote(@CurrentUser('id') id: string, @Body() dto: NoteDto) {
		return this.noteService.create(id, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Delete('delete-all-by-user/:classId')
	@Auth()
	async deleteAllNotesByUser(
		@CurrentUser('id') id: string,
		@Param('classId') classId: string
	) {
		return this.noteService.deleteAllByUser(id, classId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async updateNote(@Param('id') id: string, @Body() dto: UpdateNoteDto) {
		return this.noteService.update(id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async deleteNote(@Param('id') id: string) {
		return this.noteService.delete(id)
	}

	@HttpCode(200)
	@Get(':id')
	@Auth()
	async getNoteById(@Param('id') id: string) {
		return this.noteService.getById(id)
	}
}
