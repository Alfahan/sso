import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * @repository ApiKeyRepository
 * @description
 * This repository handles interactions with the API key data in the database, including saving, finding, and updating API keys.
 */
@Injectable()
export class ApiKeyRepository {
	constructor(private dataSource: DataSource) {}

	/**
	 * @method saveApiKey
	 * @description
	 * Saves a new API key to the specified table in the database.
	 *
	 * @param {string} table - The name of the table where the API key will be saved.
	 * @param {any} payload - An object containing the API key data to be saved.
	 * @returns {Promise<any>} - Returns the saved API key data.
	 *
	 * @example
	 * await repository.saveApiKey('api_keys', {
	 *   third_party_name: 'example',
	 *   strKey: 'hashed-api-key',
	 *   status: 'valid',
	 * });
	 */
	async saveApiKey(table: string, payload: any): Promise<any> {
		const query = `INSERT INTO ${table} (third_party_name, key, status) VALUES ($1, $2, $3)`;
		const values = [
			payload.third_party_name,
			payload.strKey,
			payload.status,
		];

		try {
			await this.dataSource.query(query, values);
			const result = {
				third_party_name: payload.third_party_name,
				key: payload.strKey,
				status: payload.status,
			};
			return result;
		} catch (error) {
			console.error('Error:', error);
			throw new Error('Failed to save API key.');
		}
	}

	/**
	 * @method findApiKey
	 * @description
	 * Finds an API key by third party name and status. Returns the most recent API key if found.
	 *
	 * @param {string} table - The name of the table to query.
	 * @param {any} payload - An object containing the third party name and status to find the API key.
	 * @returns {Promise<any>} - Returns the found API key or null if not found.
	 *
	 * @example
	 * const key = await repository.findApiKey('api_keys', {
	 *   third_party_name: 'example',
	 *   status: 'valid',
	 * });
	 */
	async findApiKey(table: string, payload: any): Promise<any> {
		const query = `SELECT third_party_name, key, status FROM ${table} WHERE third_party_name=$1 AND status=$2 ORDER BY third_party_name DESC LIMIT 1`;
		const values = [payload.third_party_name, payload.status];
		try {
			const result = await this.dataSource.query(query, values);
			return result[0] || null;
		} catch (error) {
			console.error('Error:', error);
			throw new Error('Failed to find API key.');
		}
	}

	/**
	 * @method findApiKeyMid
	 * @description
	 * Finds an API key by its value and status. Returns the most recent API key if found.
	 *
	 * @param {string} table - The name of the table to query.
	 * @param {any} payload - An object containing the API key value and status to find the API key.
	 * @returns {Promise<any>} - Returns the found API key or null if not found.
	 *
	 * @example
	 * const key = await repository.findApiKeyMid('api_keys', {
	 *   api_key: 'hashed-api-key',
	 *   status: 'valid',
	 * });
	 */
	async findApiKeyMid(table: string, payload: any): Promise<any> {
		const query = `SELECT key FROM ${table} WHERE key=$1 AND status=$2 ORDER BY key DESC LIMIT 1`;
		const values = [payload.api_key, payload.status];
		try {
			const result = await this.dataSource.query(query, values);
			return result[0] || null;
		} catch (error) {
			console.error('Error:', error);
			throw new Error('Failed to find API key.');
		}
	}

	/**
	 * @method updateApiKey
	 * @description
	 * Updates existing API key records in the database with new values for specified fields.
	 *
	 * @param {string} table - The name of the table to update.
	 * @param {object} updatedFields - An object containing the fields to update and their new values.
	 * @returns {Promise<any>} - Returns the updated API key record.
	 *
	 * @example
	 * const updatedKey = await repository.updateApiKey('api_keys', {
	 *   third_party_name: 'example',
	 *   key: 'new-hashed-api-key',
	 *   status: 'valid',
	 * });
	 */
	async updateApiKey(
		table: string,
		updatedFields: {
			third_party_name?: string;
			key?: string;
			status?: string;
		},
	) {
		let setClause = '';
		const values: any[] = [];
		let index = 1;

		if (updatedFields.third_party_name) {
			setClause += `third_party_name = $${index++}, `;
			values.push(updatedFields.third_party_name);
		}

		if (updatedFields.key) {
			setClause += `key = $${index++}, `;
			values.push(updatedFields.key);
		}

		if (updatedFields.status) {
			setClause += `status = $${index++}, `;
			values.push(updatedFields.status);
		}

		setClause = setClause.slice(0, -2);

		const query = `
			UPDATE ${table}
			SET ${setClause}
			WHERE third_party_name = $${index++}
			RETURNING *;
		`;

		try {
			const result = await this.dataSource.query(query, [
				...values,
				updatedFields.third_party_name,
			]);
			return result[0] || null;
		} catch (error) {
			console.error('Error:', error);
			throw new Error('Failed to update API key.');
		}
	}
}
