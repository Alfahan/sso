import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiKeyRepository } from '../../repository/apiKey.repository';
import { Request } from 'express';
import { API_KEY_VALID } from '@app/const';
import * as crypto from 'crypto';
import { generateRandomString } from '../apikey.helper';

/**
 * @service RotateApiKeyUseCase
 * @description
 * This service handles the logic for rotating (recreating) an API key for a given third party. It verifies if the current API key exists,
 * generates a new one, hashes it, and updates the API key record in the database.
 */
@Injectable()
export class RotateApiKeyUseCase {
	constructor(private readonly repository: ApiKeyRepository) {}

	/**
	 * @method recreateApiKey
	 * @description
	 * Rotates (recreates) the API key for a given third party by generating a new random key, hashing it, and updating the record in the database.
	 *
	 * @param {Request} req - The HTTP request object containing the third party name in the body.
	 * @returns {Promise<any>} - Returns the updated API key record.
	 *
	 * @throws {BadRequestException} - Throws an exception if the API key for the provided third party name is not found.
	 *
	 * @example
	 * POST /api-key/rotate
	 * Body: { "third_party_name": "example" }
	 */
	async recreateApiKey(req: Request): Promise<any> {
		const { third_party_name } = req.body;

		// Check if the API key exists
		const cekApiKey = await this.repository.findApiKey('api_keys', {
			third_party_name: third_party_name,
			status: API_KEY_VALID,
		});

		if (!cekApiKey) {
			// Throw an error if the API key is not found
			throw new BadRequestException(`Api Key Not Found`);
		}

		// Generate a new API key
		const strKey = await generateRandomString(48);
		const hashedApiKey: string = crypto
			.createHash('sha256')
			.update(strKey)
			.digest('base64');

		// Update the API key in the database
		const rotateApiKey = await this.repository.updateApiKey('api_keys', {
			third_party_name: third_party_name,
			key: hashedApiKey,
			status: API_KEY_VALID,
		});

		// Return the updated API key record
		return rotateApiKey[0];
	}
}
