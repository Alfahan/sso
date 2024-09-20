import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ApiKeyRepository } from '../../repository/apiKey.repository';
import { API_KEY_VALID } from '@app/const';
import * as crypto from 'crypto';
import { generateRandomString } from '../apikey.helper';

/**
 * @service GenerateApiKeyUseCase
 * @description
 * This service handles the generation of a new API key. It checks if an existing valid API key is associated with the
 * provided third party, and if not, generates a new random API key, hashes it using SHA-256, and saves it to the database.
 */
@Injectable()
export class GenerateApiKeyUseCase {
	constructor(private readonly repository: ApiKeyRepository) {}

	/**
	 * @method createApiKey
	 * @description
	 * Generates a new API key for a given third party name. If an existing valid API key is found, it returns that key.
	 * Otherwise, it creates a new key, hashes it using SHA-256, and stores it in the database.
	 *
	 * @param {Request} req - The HTTP request object containing the third party name in the body.
	 * @returns {Promise<any>} - Returns the newly created API key or the existing valid API key.
	 *
	 * @example
	 * POST /api-key/generate
	 * Body: {
			"name": "example",
			"ip_origin": "127.0.0.1",
			"domain": "localhost:3000",
		}
	 */
	async createApiKey(req: Request): Promise<any> {
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
