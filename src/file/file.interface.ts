export interface IFileResponse {
	_id: number
	path: string
	name: string
	size: string
}

export interface IFileResponseData {
	status: string
	message: string
	data: IFileResponse[]
}
