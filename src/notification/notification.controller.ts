import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { NotificationService } from './notification.service'

@Controller('notifications')
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('save-token')
	@Auth()
	async saveToken(
		@CurrentUser('id') id: string,
		@Body() body: { token: string }
	) {
		return this.notificationService.savePushToken(id, body.token)
	}
}
