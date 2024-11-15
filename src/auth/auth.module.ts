import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config'
import { EmploymentInfoService } from 'src/employment-info/employment-info.service'
import { PrismaService } from 'src/prisma.service'
import { StudentInfoService } from 'src/student-info/student-info.service'
import { UserModule } from 'src/user/user.module'
import { UserService } from 'src/user/user.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
	imports: [
		UserModule,
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig
		})
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		JwtStrategy,
		UserService,
		PrismaService,
		StudentInfoService,
		EmploymentInfoService
	]
})
export class AuthModule {}
