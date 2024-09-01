import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiKeyRepository } from '../../repository/apiKey.repository';
import { API_KEY_INVALID, API_KEY_VALID } from '@app/const';
import { Request } from 'express';

/**
 * @service RevokeApiKeyUseCase
 * @description
 * This service handles the logic for revoking an API key by marking it as invalid in the database. It verifies if the current API key exists,
 * and then updates its status to `API_KEY_INVALID`.
 */
@Injectable()
export class RevokeApiKeyUseCase {
	constructor(private readonly repository: ApiKeyRepository) {}

	/**
	 * @method removeApiKey
	 * @description
	 * Revokes the API key for a given third party by setting its status to `API_KEY_INVALID`.
	 *
	 * @param {Request} req - The HTTP request object containing the third party name in the body.
	 * @returns {Promise<any>} - Returns the updated API key record after being revoked.
	 *
	 * @throws {BadRequestException} - Throws an exception if the API key for the provided third party name is not found.
	 *
	 * @example
	 * DELETE /api-key/revoke
	 * Body: { "third_party_name": "example" }
	 */
	async removeApiKey(req: Request): Promise<any> {
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

		// Update the API key status to invalid
		const result = await this.repository.updateApiKey('api_keys', {
			third_party_name: third_party_name,
			status: API_KEY_INVALID,
		});

		// Return the updated API key record after revoking
		return result[0];
	}
}
