import { IsString } from 'class-validator'

export class StudentInfoDto {
	@IsString()
	creditCardNumber: string
}

export type UpdateStudentInfo = Partial<StudentInfoDto>
