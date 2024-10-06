import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '@app/const';
import { Injectable } from '@nestjs/common';
import { RedisOptions } from 'ioredis';

@Injectable()
export class RedisConfig {
	public static getRedisConfig(): RedisOptions {
		return {
			host: REDIS_HOST || 'localhost', // This points to your Docker Redis host
			port: parseInt(REDIS_PORT, 10) || 6379, // The default Redis port
			password: REDIS_PASSWORD || undefined, // Set this if you have a password
		};
	}
}
