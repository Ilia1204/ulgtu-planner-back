import { IsArray, IsOptional, IsString } from 'class-validator'

export class FlowDto {
	@IsString()
	name: string

	@IsString()
	departmentId: string

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	groups: string[]

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	classes: string[]
}

export type UpdateFlowDto = Partial<FlowDto>
