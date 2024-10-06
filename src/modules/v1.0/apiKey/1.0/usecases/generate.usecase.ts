import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ApiKeyRepository } from '../../repository/apiKey.repository';
import { API_KEY_VALID } from '@app/const';
import * as crypto from 'crypto';
import { generateRandomString } from '../apikey.helper';
import { validateGenerate } from '../apikey.validate';

@Injectable()
export class GenerateApiKeyUseCase {
	constructor(private readonly repository: ApiKeyRepository) {}

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

			// Save the new API key in the database
			const saveApiKey = await this.repository.saveApiKey('api_keys', {
				name: name,
				ip_origin: ip_origin,
				domain: domain,
				key: hashedApiKey,
				status: API_KEY_VALID,
			});

			// Return the newly saved API key
			return saveApiKey;
		}

		// Return the existing valid API key if found
		return cekApiKey;
	}
}
