import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as useragent from 'useragent'; // Library to parse and identify user agent (e.g., browser, OS)
import * as geoip from 'geoip-lite'; // Library to get geolocation data from IP addresses

/**
 * Repository class for handling authentication-related database operations.
 */
@Injectable()
export class AuthRepository {
	constructor(private dataSource: DataSource) {} // Inject the DataSource for database access

	/**
	 * Saves a JWT token in the specified table with user ID and status.
	 * @param {string} table - The name of the table where the token will be saved.
	 * @param {any} payload - The payload containing user_id, token, and status.
	 * @returns {Promise<void>} - A promise that resolves when the token is saved.
	 */
	async saveToken(table: string, payload: any): Promise<void> {
		const query = `INSERT INTO ${table} (user_id, token, status) VALUES ($1, $2, $3)`;
		const values = [payload.user_id, payload.token, payload.status];

		try {
			// Execute the query to insert the token data into the database
			await this.dataSource.query(query, values);
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error saving token:', error);
		}
	}

	/**
	 * @method updateTokenStatus
	 * @description Updates the status of a token in the `user_tokens` table.
	 *
	 * @param {string} tableName - The name of the table (e.g., 'user_tokens').
	 * @param {string} token - The token that needs to be updated.
	 * @param {string} newStatus - The new status to set for the token (e.g., TOKEN_INVALID).
	 * @returns {Promise<void>} - Resolves when the token status has been updated.
	 *
	 * @example
	 * await updateTokenStatus('user_tokens', 'someToken', 'INVALID');
	 */
	async updateTokenStatus(
		tableName: string,
		token: string,
		newStatus: string,
	): Promise<void> {
		// Assuming your `user_tokens` table has a `token` column and `status` column.
		const query = `UPDATE ${tableName} SET status = $1 WHERE token = $2`;
		const values = [newStatus, token];

		try {
			// Execute the query to insert the token data into the database
			await this.dataSource.query(query, values);
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error saving token:', error);
		}
	}

	async resetPassword(table: string, payload: any): Promise<void> {
		const query = `UPDATE ${table} SET password = $1 WHERE id = $2`;
		const values = [payload.password, payload.id];

		try {
			// Execute the query to insert the token data into the database
			await this.dataSource.query(query, values);
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error saving token:', error);
		}
	}

	/**
	 * Retrieves the latest token for a user from the specified table based on status.
	 * @param {string} table - The name of the table to query.
	 * @param {any} payload - The payload containing user ID and status.
	 * @returns {Promise<string | null>} - A promise that resolves to the token if found, or null if not found.
	 */
	async cekValidateToken(
		table: string,
		payload: any,
	): Promise<string | null> {
		const query = `SELECT token FROM ${table} WHERE user_id=$1 AND status=$2 ORDER BY token DESC LIMIT 1`;
		const values = [payload.user_id, payload.status];

		try {
			// Execute the query to retrieve the latest token
			const result = await this.dataSource.query(query, values);
			return result[0]?.token || null;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving token:', error);
		}
	}

	/**
	 * Finds a user by phone number in the specified table.
	 * @param {string} table - The name of the table to query.
	 * @param {string} phone_number - The phone number of the user.
	 * @returns {Promise<string | null>} - A promise that resolves to the user data if found, or null if not found.
	 */
	async findByPhoneNumber(
		table: string,
		phone_number: string,
	): Promise<any | null> {
		const query = `SELECT id, password FROM ${table} WHERE phone_number=$1 LIMIT 1`;
		const value = [phone_number];

		try {
			// Execute the query to retrieve the user by phone number
			const result = await this.dataSource.query(query, value);
			return result[0] || null; // Return the user data if found
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error finding user by phone number:', error);
		}
	}

	/**
	 * Finds a user by email in the specified table.
	 * @param {string} table - The name of the table to query.
	 * @param {string} email - The email of the user.
	 * @returns {Promise<string | null>} - A promise that resolves to the user data if found, or null if not found.
	 */
	async findByEmail(table: string, email: string): Promise<any | null> {
		const query = `SELECT id, password FROM ${table} WHERE email=$1 LIMIT 1`;
		const value = [email];

		try {
			// Execute the query to retrieve the user by email
			const result = await this.dataSource.query(query, value);
			return result[0] || null; // Return the user data if found
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error finding user by email:', error);
		}
	}

	async findById(table: string, id: string): Promise<any | null> {
		const query = `SELECT id, password FROM ${table} WHERE id=$1 LIMIT 1`;
		const value = [id];
		try {
			// Execute the query to retrieve the user by email
			const result = await this.dataSource.query(query, value);
			return result[0] || null; // Return the user data if found
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error finding user by id:', error);
		}
	}

	/**
	 * Saves login activity logs, including user agent and location information.
	 * @param {string} user_id - The ID of the user.
	 * @param {string} ip - The IP address of the user.
	 * @param {string} action - The action performed by the user (e.g., 'Login').
	 * @param {string} userAgentString - The user agent string from the request.
	 * @returns {Promise<void>} - A promise that resolves when the activity log is saved.
	 */
	async saveAuthHistory(
		user_id: string,
		ip: string,
		action: string,
		userAgentString: string,
	): Promise<void> {
		// Parse the user agent string to extract OS, browser, and device information
		const agent = useragent.parse(userAgentString);
		// Lookup the geolocation information from the IP address
		const geo = geoip.lookup(ip);

		// Values for the SQL query
		const values = [
			user_id,
			ip,
			geo ? `${geo.city}, ${geo.region}, ${geo.country}` : 'Unknown', // Geolocation information or 'Unknown'
			geo?.country || 'Unknown', // Extracted country information or 'Unknown'
			agent.toAgent(), // Extracted browser information
			agent.os.toString(), // Extracted OS information
			agent.device.toString(), // Extracted device information
			action, // Action performed (e.g., 'login', 'logout')
		];

		// SQL query to insert the authentication history into the auth_histories table
		const query = `
			INSERT INTO auth_histories (user_id, ip_origin, geolocation, country, browser, os_type, device, action_type)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		`;

		try {
			// Execute the query to insert the authentication history into the database
			await this.dataSource.query(query, values);
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error saving authentication history:', error);
		}
	}

	/**
	 * Registers a new user by inserting the necessary information into the specified table.
	 * @param {string} table - The name of the table where the new user will be registered.
	 * @param {any} payload - The payload containing email, password, phone number, and status.
	 * @returns {Promise<void>} - A promise that resolves when the user is registered.
	 */
	async register(table: string, payload: any): Promise<void> {
		// Query to insert the new user data (email, password, phone number, status) into the table
		const query = `INSERT INTO ${table} (username, email, password, phone_number, status) VALUES ($1, $2, $3, $4, $5)`;
		const values = [
			payload.username,
			payload.email,
			payload.password,
			payload.phone_number,
			payload.status,
		];

		try {
			// Execute the query to insert the new user data into the database
			await this.dataSource.query(query, values);
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error registering user:', error);
		}
	}

	/**
	 * Retrieves the last login location and device details for a user from the specified table.
	 * @param {string} table - The name of the table to query.
	 * @param {string} user_id - The ID of the user.
	 * @param {string} action - The action to filter by (e.g., 'Login').
	 * @returns {Promise<any>} - A promise that resolves to the last login details if found.
	 */
	async getLastLoginLocation(table: string, user_id: string): Promise<any> {
		// Query to select the last login details (country, IP, OS, browser, device) for the user
		const query = `SELECT ip_origin, geolocation, os_type, country, browser, os_type, device FROM ${table} WHERE user_id=$1 ORDER BY user_id DESC LIMIT 1`;
		const values = [user_id];

		try {
			// Execute the query to retrieve the last login details from the database
			const result = await this.dataSource.query(query, values);
			return result[0] || null; // Return the last login details if found
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving last login location:', error);
		}
	}

	async findFailedLoginAttempts(
		table: string,
		user_id: string,
	): Promise<any> {
		const query = `SELECT failed_login_attempts, updated_at FROM ${table} WHERE id=$1 LIMIT 1`;
		const values = [user_id];

		try {
			// Execute the query to retrieve the last login details from the database
			const result = await this.dataSource.query(query, values);
			return result[0] || null; // Return the last login details if found
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving last login location:', error);
		}
	}

	async addFailedLoginAttempts(
		table: string,
		payload: any,
		user_id: string,
	): Promise<any> {
		const query = `UPDATE ${table} SET failed_login_attempts = $1, updated_at = $2, updated_by = $3, updated_name = $4 WHERE id = $5`;
		const values = [
			payload.failed_login_attempts,
			payload.updated_at,
			'1', // System ID or user responsible for the update
			'SYSTEM', // System user
			user_id, // User ID whose record is being updated
		];

		try {
			// Execute the query to retrieve the last login details from the database
			const result = await this.dataSource.query(query, values);
			return result[0] || null; // Return the last login details if found
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving last login location:', error);
		}
	}
}
