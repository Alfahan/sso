import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ApiKeyRepository } from '../../repository/apiKey.repository';
import { API_KEY_VALID, NODE_ENV } from '@app/const';
import * as crypto from 'crypto';
import { validateGenerate } from '../apikey.validate';
import Redis from 'ioredis';
import { RedisLibs } from '@app/libraries/redis';
import CryptoTs from 'pii-agent-ts';
import { generateRandomString } from '@app/libraries/helpers';

@Injectable()
export class GenerateApiKeyUseCase {
	private redisLib: RedisLibs;

	constructor(private readonly repository: ApiKeyRepository) {
		const redisClient = new Redis();
		this.redisLib = new RedisLibs(redisClient);
	}

	/**
	 * createApiKey
	 * @author telkomdev-alfahan
	 * @date 2024-10-06
	 * @param { Request } req
	 * @returns { Promise<any> }
	 */
	async createApiKey(req: Request): Promise<any> {
		validateGenerate(req.body);

		const { name, ip_origin, domain } = req.body;

		const cachedApiKey = await this.redisLib.get(
			`service-sso:${NODE_ENV}-api_key:${name}`,
		);
		if (cachedApiKey) {
			return JSON.parse(
				CryptoTs.decryptWithAes(
					'AES_256_CBC',
					Buffer.from(cachedApiKey),
				),
			);
		}

		// Check if a valid API key already exists for the third party
		const cekApiKey = await this.repository.findApiKey('api_keys', {
			name: name,
			status: API_KEY_VALID,
		});

		// If no valid API key is found, create a new one
		if (!cekApiKey) {
			// Generate a random string for the API key
			const rdmStr = await generateRandomString(48);

			// Hash the generated key using SHA-256 and encode it in base64
			const hashedApiKey: string = crypto
				.createHash('sha256')
				.update(rdmStr)
				.digest('base64');

			const payload = {
				name: name,
				ip_origin: ip_origin,
				domain: domain,
				key: hashedApiKey,
				status: API_KEY_VALID,
			};

			// Save the new API key in the database
			const saveApiKey = await this.repository.saveApiKey(
				'api_keys',
				payload,
			);

			await this.redisLib.set(
				`service-sso:${NODE_ENV}-api_key:${name}`,
				CryptoTs.encryptWithAes('AES_256_CBC', JSON.stringify(payload))
					.Value,
			);

			// Return the newly saved API key
			return saveApiKey;
		}

		// Return the existing valid API key if found
		await this.redisLib.set(
			`service-sso:${NODE_ENV}-api_key:${name}`,
			CryptoTs.encryptWithAes('AES_256_CBC', JSON.stringify(cekApiKey))
				.Value,
		);
		return cekApiKey;
	}
}
