import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiKeyRepository } from '../../repository/apiKey.repository';
import { Request } from 'express';
import { API_KEY_VALID } from '@app/const';
import * as crypto from 'crypto';
import { generateRandomString } from '../apikey.helper';
import { validateRotateAndRevoke } from '../apikey.validate';

@Injectable()
export class RotateApiKeyUseCase {
	constructor(private readonly repository: ApiKeyRepository) {}

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
			name: name,
			key: hashedApiKey,
			status: API_KEY_VALID,
		});

		// Return the updated API key record
		return rotateApiKey[0];
	}
}
