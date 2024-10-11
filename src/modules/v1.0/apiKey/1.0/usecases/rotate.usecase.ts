import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiKeyRepository } from '../../repository/apiKey.repository';
import { Request } from 'express';
import { API_KEY_VALID, NODE_ENV } from '@app/const';
import * as crypto from 'crypto';
import { validateRotateAndRevoke } from '../apikey.validate';
import { RedisLibs } from '@app/libraries/redis';
import Redis from 'ioredis';
import CryptoTs from 'pii-agent-ts';
import { generateRandomString } from '@app/libraries/helpers';

@Injectable()
export class RotateApiKeyUseCase {
	private redisLib: RedisLibs;

	constructor(private readonly repository: ApiKeyRepository) {
		const redisClient = new Redis();
		this.redisLib = new RedisLibs(redisClient);
	}

	/**
	 * recreateApiKey
	 * @author telkomdev-alfahan
	 * @date 2024-10-06
	 * @param { Request } req
	 * @returns { Promise<any> }
	 */
	async recreateApiKey(req: Request): Promise<any> {
		validateRotateAndRevoke(req.body);

		const { name } = req.body;

		// Check if the API key exists
		const cekApiKey = await this.repository.findApiKey('api_keys', {
			name: name,
			status: API_KEY_VALID,
		});

		if (!cekApiKey) {
			// Throw an error if the API key is not found
			throw new BadRequestException(`Api Key Not Found`);
		}

		// Generate a new API key
		const rdmStr = await generateRandomString(48);
		const hashedApiKey: string = crypto
			.createHash('sha256')
			.update(rdmStr)
			.digest('base64');

		// Update the API key in the database
		const rotateApiKey = await this.repository.updateApiKey('api_keys', {
			id: cekApiKey.id,
			key: hashedApiKey,
			status: API_KEY_VALID,
		});

		const payloadRedis = {
			name: rotateApiKey[0].name,
			ip_origin: rotateApiKey[0].ip_origin,
			domain: rotateApiKey[0].domain,
			key: rotateApiKey[0].key,
			status: rotateApiKey[0].status,
		};
		await this.redisLib.set(
			`service-sso:${NODE_ENV}-api_key:${name}`,
			CryptoTs.encryptWithAes('AES_256_CBC', JSON.stringify(payloadRedis))
				.Value,
		);

		// Return the updated API key record
		return rotateApiKey[0];
	}
}
