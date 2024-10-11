import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiKeyRepository } from '../../repository/apiKey.repository';
import { API_KEY_INVALID, API_KEY_VALID, NODE_ENV } from '@app/const';
import { Request } from 'express';
import { validateRotateAndRevoke } from '../apikey.validate';
import { RedisLibs } from '@app/libraries/redis';
import Redis from 'ioredis';

@Injectable()
export class RevokeApiKeyUseCase {
	private redisLib: RedisLibs;

	constructor(private readonly repository: ApiKeyRepository) {
		const redisClient = new Redis();
		this.redisLib = new RedisLibs(redisClient);
	}

	/**
	 * removeApiKey
	 * @author telkomdev-alfahan
	 * @date 2024-10-06
	 * @param { Request } req
	 * @returns { Promise<any> }
	 */
	async removeApiKey(req: Request): Promise<any> {
		validateRotateAndRevoke(req.body);

		const { name } = req.body;

		const cachedApiKey = await this.redisLib.get(`api_key:${name}`);
		if (cachedApiKey) {
			await this.redisLib.del(`service-sso:${NODE_ENV}-api_key:${name}`);
		}

		// Check if the API key exists
		const cekApiKey = await this.repository.findApiKey('api_keys', {
			name: name,
			status: API_KEY_VALID,
		});

		if (!cekApiKey) {
			// Throw an error if the API key is not found
			throw new BadRequestException(`Api Key Not Found`);
		}

		// Update the API key status to invalid
		const result = await this.repository.updateApiKey('api_keys', {
			id: cekApiKey.id,
			status: API_KEY_INVALID,
		});

		// Return the updated API key record after revoking
		return result[0];
	}
}
