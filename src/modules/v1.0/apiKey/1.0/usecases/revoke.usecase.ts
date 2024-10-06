import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiKeyRepository } from '../../repository/apiKey.repository';
import { API_KEY_INVALID, API_KEY_VALID } from '@app/const';
import { Request } from 'express';
import { validateRotateAndRevoke } from '../apikey.validate';

@Injectable()
export class RevokeApiKeyUseCase {
	constructor(private readonly repository: ApiKeyRepository) {}

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
			name: name,
			status: API_KEY_INVALID,
		});

		// Return the updated API key record after revoking
		return result[0];
	}
}
