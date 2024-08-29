import { SECRET_KEY } from '@app/const';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthControllerV10 } from './auth.controller';
import { LoginUseCase } from './usecases/login.usecase';
import { AuthRepository } from '../repositories/auth.repository';
import { RegisterUseCase } from './usecases/register.usecase';

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			secret: SECRET_KEY,
			signOptions: { expiresIn: '60s' }, // Token lifetime
		}),
		TypeOrmModule.forFeature([]),
	],
	providers: [LoginUseCase, RegisterUseCase, AuthRepository],
	controllers: [AuthControllerV10],
})
export class AuthModuleV10 {}
