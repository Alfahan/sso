import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { RegisterUseCase } from './usecases/register.usecase';
import { RegisterHelper } from './register.helper';
import { RegisterControllerV10 } from './register.controller';
import { ApiKeyMiddleware } from '@app/middlewares/checkApiKey.middleware';
import { ApiKeyRepository } from '../../apiKey/repository/apiKey.repository';
import { RegisterRepository } from '../repositories/register.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([])],
	providers: [
		ApiKeyRepository,
		RegisterRepository,
		RegisterHelper,
		RegisterUseCase,
	],
	controllers: [RegisterControllerV10],
})
export class RegisterModuelV10 {
	/**
	 * @method configure
	 * @description
	 * Configures middleware for the AuthModuleV10. The ApiKeyMiddleware is applied to validate API keys for all routes under the 'v1.0/auth/*' path.
	 *
	 * @param {MiddlewareConsumer} consumer - The MiddlewareConsumer instance is used to apply middlewares to specific routes.
	 */
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(ApiKeyMiddleware) // Applying the ApiKeyMiddleware to check the validity of the API key
			.forRoutes({
				path: 'sso/v1.0/register/*',
				method: RequestMethod.ALL,
			}); // Applying the middleware to all routes that start with 'v1.0/auth/*'
	}
}
