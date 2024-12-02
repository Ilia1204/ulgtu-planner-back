import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class NoteDto {
	@IsString()
	content: string

	@IsOptional()
	@IsBoolean()
	isPrivate: boolean

	@IsString()
	classId: string
}

export type UpdateNoteDto = Partial<NoteDto>
