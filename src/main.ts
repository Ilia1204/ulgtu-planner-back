import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.setGlobalPrefix('api')
	app.use(cookieParser())
	app.enableCors({
		origin: ['https://8ada-176-116-137-120.ngrok-free.app'],
		credentials: true,
		exposedHeaders: 'set-cookie'
	})

	await app.listen(4200)
}
bootstrap()
