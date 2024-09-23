import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * Repository class for handling authentication-related database operations.
 */
@Injectable()
export class AuthRepository {
	constructor(private dataSource: DataSource) {} // Inject the DataSource for database access

	/**
	 * Saves a JWT token in the specified table with user ID and status.
	 *
	 * @param {string} table - The name of the table where the token will be saved.
	 * @param {any} payload - The payload containing user_id, token, and status.
	 *   @property {string} user_id - The user ID associated with the token.
	 *   @property {string} token - The JWT token to be saved.
	 *   @property {string} status - The status of the token (e.g., valid, expired).
	 * @returns {Promise<void>} - A promise that resolves when the token is successfully saved in the database.
	 *
	 * @throws Will log an error if the database query fails.
	 *
	 * @example
	 * const payload = {
	 *   user_id: '12345',
	 *   token: 'jwt-token-value',
	 *   status: 'valid'
	 * };
	 * await saveToken('user_tokens', payload);
	 */
	async saveToken(table: string, payload: any): Promise<void> {
		const query = `INSERT INTO ${table} (id, user_id, api_key_id, token, refresh_token, status, ip_origin, geolocation, country, browser, os_type, device) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;
		const values = [
			payload.id,
			payload.user_id,
			payload.api_key_id,
			payload.token,
			payload.refresh_token,
			payload.status,
			payload.ip_origin,
			payload.geolocation,
			payload.country,
			payload.browser,
			payload.os_type,
			payload.device,
		];

		try {
			// Execute the query to insert the token data into the database
			await this.dataSource.query(query, values);
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error saving token:', error);
		}
	}

	/**
	 * Saves a token for a user's password reset request into the specified table.
	 * @param {string} table - The name of the table to insert the token into.
	 * @param {object} payload - The token data to be inserted.
	 * @param {string} payload.user_id - The ID of the user requesting the password reset.
	 * @param {string} payload.token - The reset token to be saved.
	 * @param {string} payload.status - The status of the token (e.g., 'active', 'expired').
	 * @returns {Promise<void>} - A promise that resolves when the token has been successfully saved.
	 *
	 * @throws Will log an error if the database query fails.
	 *
	 * @example
	 * const payload = {
	 *   user_id: '12345',
	 *   token: 'reset-token-example',
	 *   status: 'active'
	 * };
	 * await saveTokenUserResetPass('user_reset_tokens', payload);
	 */
	async saveTokenUserResetPass(table: string, payload: any): Promise<void> {
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
	 * Updates an existing token in the specified table based on the provided ID.
	 * @param {string} table - The name of the table to update the token in.
	 * @param {object} payload - The updated token data.
	 * @param {string} payload.token - The new token value.
	 * @param {string} payload.refresh_token - The new refresh token value.
	 * @param {string} id - The ID of the record to update.
	 * @returns {Promise<void>} - A promise that resolves when the token has been successfully updated.
	 *
	 * @throws Will log an error if the database query fails.
	 *
	 * @example
	 * const payload = {
	 *   token: 'new-token-value',
	 *   refresh_token: 'new-refresh-token-value'
	 * };
	 * const id = 'existing-record-id';
	 * await updateToken('user_tokens', payload, id);
	 */
	async updateToken(table: string, payload: any, id: string): Promise<void> {
		const query = `UPDATE ${table} SET token=$1, refresh_token=$2 WHERE id = $3`;
		const values = [payload.token, payload.refresh_token, id];

		try {
			// Execute the query to update the token data in the database
			await this.dataSource.query(query, values);
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error updating token:', error);
		}
	}

	/**
	 * Saves an OTP code in the specified table with user ID, OTP code, and expiry time.
	 *
	 * @param {string} table - The name of the table where the OTP will be saved.
	 * @param {any} payload - The payload containing user_id, otp_code, and expires_at.
	 *   @property {string} user_id - The user ID associated with the OTP.
	 *   @property {string} otp_code - The OTP code to be saved.
	 *   @property {Date} expires_at - The expiry time of the OTP code.
	 * @returns {Promise<void>} - A promise that resolves when the OTP data is successfully saved in the database.
	 *
	 * @throws Will log an error if the database query fails.
	 *
	 * @example
	 * const payload = {
	 *   user_id: '12345',
	 *   otp_code: '67890',
	 *   expires_at: new Date()
	 * };
	 * await saveOtp('user_otps', payload);
	 */
	async saveOtp(table: string, payload: any): Promise<void> {
		const query = `INSERT INTO ${table} (user_id, otp_code, expires_at, status, api_key_id) VALUES ($1, $2, $3, $4, $5)`;
		const values = [
			payload.user_id,
			payload.otp_code,
			payload.expires_at,
			payload.status,
			payload.api_key_id,
		];

		try {
			// Execute the query to insert the OTP data into the database
			await this.dataSource.query(query, values);
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error saving OTP:', error);
		}
	}

	/**
	 * Updates the status of a reset token for a specific user in the specified table.
	 * @param {string} table - The name of the table where the token status should be updated.
	 * @param {string} status - The new status of the token (e.g., 'active', 'expired').
	 * @param {string} user_id - The ID of the user whose token status is being updated.
	 * @returns {Promise<void>} - A promise that resolves when the status has been successfully updated.
	 *
	 * @throws Will log an error if the database query fails.
	 *
	 * @example
	 * const status = 'expired';
	 * const user_id = '12345';
	 * await updateTokenResetPass('user_reset_tokens', status, user_id);
	 */
	async updateTokenResetPass(
		table: string,
		status: string,
		user_id: string,
	): Promise<void> {
		const query = `UPDATE ${table} SET status = $1 WHERE user_id = $2`;
		const values = [status, user_id];

		try {
			// Execute the query to update the token status in the database
			await this.dataSource.query(query, values);
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error updating token status:', error);
		}
	}

	/**
	 * Updates the status of a token based on its ID in the specified table.
	 * @param {string} table - The name of the table where the token status should be updated.
	 * @param {string} status - The new status of the token (e.g., 'active', 'expired').
	 * @param {string} id - The ID of the token record to be updated.
	 * @returns {Promise<void>} - A promise that resolves when the status has been successfully updated.
	 *
	 * @throws Will log an error if the database query fails.
	 *
	 * @example
	 * const status = 'inactive';
	 * const id = 'existing-token-id';
	 * await updateTokenStatus('user_tokens', status, id);
	 */
	async updateTokenStatus(
		table: string,
		status: string,
		id: string,
	): Promise<void> {
		const query = `UPDATE ${table} SET status = $1 WHERE id = $2`;
		const values = [status, id];

		try {
			// Execute the query to update the token status in the database
			await this.dataSource.query(query, values);
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error updating token status:', error);
		}
	}

	/**
	 * Resets the password for a user in the specified table based on user ID.
	 *
	 * @param {string} table - The name of the table where the password will be updated.
	 * @param {any} payload - The payload containing the new password and user ID.
	 *   @property {string} password - The new password to be set for the user.
	 *   @property {string} id - The user ID for which the password needs to be updated.
	 * @returns {Promise<void>} - A promise that resolves when the password is successfully updated in the database.
	 *
	 * @throws Will log an error if the database query fails.
	 *
	 * @example
	 * const payload = {
	 *   password: 'newPassword123',
	 *   id: '12345'
	 * };
	 * await resetPassword('users', payload);
	 */
	async resetPassword(table: string, payload: any): Promise<void> {
		const query = `UPDATE ${table} SET password = $1 WHERE id = $2`;
		const values = [payload.password, payload.id];

		try {
			// Execute the query to update the password in the database
			await this.dataSource.query(query, values);
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error updating password:', error);
		}
	}

	/**
	 * Retrieves the latest token for a user from the specified table based on status.
	 * @param {string} table - The name of the table to query.
	 * @param {any} payload - The payload containing user ID and status.
	 * @returns {Promise<string | null>} - A promise that resolves to the token if found, or null if not found.
	 */
	async cekValidateToken(table: string, payload: any): Promise<any | null> {
		const query = `SELECT id, token, refresh_token, status FROM ${table} WHERE user_id=$1 AND geolocation=$2 AND country=$3 AND browser=$4 AND os_type=$5 AND device=$6 AND api_key_id=$7 ORDER BY token DESC LIMIT 1`;

		const values = [
			payload.user_id,
			payload.geolocation,
			payload.country,
			payload.browser,
			payload.os_type,
			payload.device,
			payload.api_key_id,
		];

		try {
			// Execute the query to retrieve the latest token
			const result = await this.dataSource.query(query, values);
			return result[0];
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving token:', error);
		}
	}

	/**
	 * Checks for the most recent reset token for a specific user with the given status in the specified table.
	 * @param {string} table - The name of the table where the token information is stored.
	 * @param {object} payload - An object containing the `user_id` and `status` to filter the token.
	 * @param {string} payload.user_id - The ID of the user whose token is being queried.
	 * @param {string} payload.status - The status of the token to filter by (e.g., 'active').
	 * @returns {Promise<any | null>} - A promise that resolves to the most recent token record or `null` if no matching token is found.
	 *
	 * @throws Will log an error if the database query fails.
	 *
	 * @example
	 * const payload = { user_id: '12345', status: 'active' };
	 * const token = await checkTokenUserResetPassByUserId('user_reset_tokens', payload);
	 * console.log(token);
	 */
	async checkTokenUserResetPassByUserId(
		table: string,
		payload: any,
	): Promise<any | null> {
		const query = `SELECT id, token, status FROM ${table} WHERE user_id=$1 AND status=$2 ORDER BY token DESC LIMIT 1`;

		const values = [payload.user_id, payload.status];

		try {
			// Execute the query to retrieve the latest token
			const result = await this.dataSource.query(query, values);
			return result[0];
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving token:', error);
		}
	}

	/**
	 * Checks if a session with a given ID exists in the specified table.
	 * @param {string} table - The name of the table where session information is stored.
	 * @param {string} id - The ID of the session to check for existence.
	 * @returns {Promise<any | null>} - A promise that resolves to the session record if found, or `null` if no matching session is found.
	 *
	 * @throws Will log an error if the database query fails.
	 *
	 * @example
	 * const id = 'session-id-123';
	 * const session = await checkSessions('sessions_table', id);
	 * console.log(session);
	 */
	async checkSessions(table: string, payload: any): Promise<any | null> {
		const query = `SELECT id FROM ${table} WHERE id=$1 AND ip_origin=$2 AND geolocation=$3 AND country=$4 AND browser=$5 AND os_type=$6 AND device=$7 AND api_key_id=$8 ORDER BY id LIMIT 1`;
		const values = [
			payload.id,
			payload.ip_origin,
			payload.geolocation,
			payload.country,
			payload.browser,
			payload.os_type,
			payload.device,
			payload.api_key_id,
		];

		try {
			// Execute the query to retrieve the session record
			const result = await this.dataSource.query(query, values);
			return result[0];
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving session:', error);
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
		const query = `SELECT id, email, password FROM ${table} WHERE phone_number=$1 LIMIT 1`;
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
	 * Retrieves a user by username from the specified table.
	 *
	 * @param {string} table - The name of the table from which to retrieve the user.
	 * @param {string} username - The username of the user to be retrieved.
	 * @returns {Promise<any | null>} - A promise that resolves to the user data if found, otherwise null.
	 *
	 * @throws Will log an error if the database query fails.
	 *
	 * @example
	 * const user = await findByUsername('users', 'johndoe');
	 * if (user) {
	 *   console.log('User found:', user);
	 * } else {
	 *   console.log('User not found');
	 * }
	 */
	async findByUsername(table: string, username: string): Promise<any | null> {
		const query = `SELECT id, password FROM ${table} WHERE username=$1 LIMIT 1`;
		const value = [username];

		try {
			// Execute the query to retrieve the user by username
			const result = await this.dataSource.query(query, value);
			return result[0] || null; // Return the user data if found
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error finding user by username:', error);
		}
	}

	/**
	 * Finds a user by email in the specified table.
	 * @param {string} table - The name of the table to query.
	 * @param {string} email - The email of the user to find.
	 * @returns {Promise<any | null>} - A promise that resolves to the user data if found, or `null` if not found.
	 *
	 * @throws Will log an error if the database query fails.
	 *
	 * @example
	 * const user = await findByEmail('users', 'user@example.com');
	 * console.log(user);
	 */
	async findByEmail(table: string, email: string): Promise<any | null> {
		const query = `SELECT id, email, password FROM ${table} WHERE email=$1 LIMIT 1`;
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

	/**
	 * Finds a user by ID in the specified table.
	 * @param {string} table - The name of the table to query.
	 * @param {string} id - The ID of the user to find.
	 * @returns {Promise<any | null>} - A promise that resolves to the user data if found, or `null` if not found.
	 *
	 * @throws Will log an error if the database query fails.
	 *
	 * @example
	 * const user = await findById('users', 'user-id-123');
	 * console.log(user);
	 */
	async findById(table: string, id: string): Promise<any | null> {
		const query = `SELECT id, password FROM ${table} WHERE id=$1 LIMIT 1`;
		const value = [id];

		try {
			// Execute the query to retrieve the user by ID
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
	async saveAuthHistory(table: string, payload: any): Promise<void> {
		// SQL query to insert the authentication history into the auth_histories table
		const query = `
			INSERT INTO auth_histories (user_id, ip_origin, geolocation, country, browser, os_type, device, action_type)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		`;
		// Values for the SQL query
		const values = [
			payload.user_id,
			payload.ip_origin,
			payload.geolocation,
			payload.country,
			payload.browser,
			payload.os_type,
			payload.device,
			payload.action,
		];

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

	/**
	 * Retrieves the number of failed login attempts and the last update timestamp for a specific user.
	 *
	 * @param {string} table - The name of the table from which to retrieve the data.
	 * @param {string} user_id - The ID of the user whose failed login attempts are being retrieved.
	 * @returns {Promise<any>} - A promise that resolves to the failed login attempts and last update timestamp if found, otherwise null.
	 *
	 * @throws Will log an error if the database query fails.
	 *
	 * @example
	 * const failedAttempts = await findFailedLoginAttempts('users', 'user123');
	 * console.log('Failed login attempts:', failedAttempts);
	 */
	async findFailedLoginAttempts(
		table: string,
		user_id: string,
	): Promise<any> {
		const query = `SELECT failed_login_attempts, updated_at FROM ${table} WHERE id=$1 LIMIT 1`;
		const values = [user_id];

		try {
			// Execute the query to retrieve the failed login attempts and update timestamp
			const result = await this.dataSource.query(query, values);
			return result[0] || null; // Return the data if found
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving failed login attempts:', error);
		}
	}

	/**
	 * Updates the number of failed login attempts, the update timestamp, and metadata for a specific user.
	 *
	 * @param {string} table - The name of the table where the data will be updated.
	 * @param {any} payload - The data to be updated, including failed_login_attempts and updated_at.
	 * @param {string} user_id - The ID of the user whose record is being updated.
	 * @returns {Promise<any>} - A promise that resolves when the update is completed, returns null if no data is found.
	 *
	 * @throws Will log an error if the database query fails.
	 *
	 * @example
	 * const result = await addFailedLoginAttempts('users', {
	 *   failed_login_attempts: 3,
	 *   updated_at: new Date(),
	 * }, 'user123');
	 * console.log('Update result:', result);
	 */
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
			// Execute the query to update the failed login attempts and metadata
			const result = await this.dataSource.query(query, values);
			return result[0] || null; // Return the updated data if found
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error updating failed login attempts:', error);
		}
	}

	async findOtpByUserId(
		table: string,
		status: string,
		user_id: string,
	): Promise<any> {
		const query = `SELECT
		mi.id as mi_id, 
		mi.otp_code,
		mi.expires_at,
		u.id as user_id,
		u.email as email
		FROM ${table} mi 
		LEFT JOIN users u 
		ON mi.user_id = u.id
		WHERE 
		mi.user_id=$1 AND mi.status=$2 
		ORDER BY mi.expires_at 
		DESC LIMIT 1`;
		const values = [user_id, status];

		try {
			// Execute the query to retrieve the last OTP code and expiration timestamp
			const result = await this.dataSource.query(query, values);
			return result[0] || null; // Return the data if found
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving last OTP:', error);
		}
	}

	async findOtpByCode(
		table: string,
		status: string,
		otp_code: string,
	): Promise<any> {
		const query = `SELECT
		mi.id as mi_id, 
		mi.otp_code,
		mi.expires_at,
		u.id as user_id,
		u.email as email
		FROM ${table} mi 
		LEFT JOIN users u 
		ON mi.user_id = u.id
		WHERE 
		mi.otp_code=$1 AND mi.status=$2 
		ORDER BY mi.expires_at 
		DESC LIMIT 1`;
		const values = [otp_code, status];

		try {
			// Execute the query to retrieve the last OTP code and expiration timestamp
			const result = await this.dataSource.query(query, values);
			return result[0] || null; // Return the data if found
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving last OTP:', error);
		}
	}

	/**
	 * Updates the status of an OTP (One-Time Password) entry in the specified table.
	 * @param {string} table - The name of the table where the OTP information is stored.
	 * @param {string} status - The new status to set for the OTP entry.
	 * @param {string} id - The ID of the OTP entry to update.
	 * @returns {Promise<any>} - A promise that resolves to the result of the update operation. Returns the updated record if found, or `null` if no matching record is found.
	 *
	 * @throws Will log an error if the database query fails.
	 *
	 * @example
	 * const updatedOtp = await updateOtp('otp_table', 'used', 'otp-id-123');
	 * console.log(updatedOtp);
	 */
	async updateOtp(table: string, status: string, id: string): Promise<any> {
		const query = `UPDATE ${table} SET status = $1 WHERE id = $2`;
		const values = [status, id];

		try {
			// Execute the query to update the OTP status in the database
			const result = await this.dataSource.query(query, values);
			return result[0] || null; // Return the data if found
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error updating status:', error);
		}
	}

	async saveCode(table: string, payload: any): Promise<void> {
		const query = `INSERT INTO ${table} (user_id, code, expires_at, status, api_key_id, ip_origin, geolocation, country, browser, os_type, device) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
		const values = [
			payload.user_id,
			payload.code,
			payload.expires_at,
			payload.status,
			payload.api_key_id,
			payload.ip_origin,
			payload.geolocation,
			payload.country,
			payload.browser,
			payload.os_type,
			payload.device,
		];

		try {
			// Execute the query to insert the OTP data into the database
			await this.dataSource.query(query, values);
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error saving OTP:', error);
		}
	}

	async cekValidateCode(table: string, payload: any): Promise<any | null> {
		const query = `SELECT id, code, status, expires_at FROM ${table} WHERE user_id=$1 AND geolocation=$2 AND country=$3 AND browser=$4 AND os_type=$5 AND device=$6 AND api_key_id=$7 ORDER BY expires_at DESC LIMIT 1`;

		const values = [
			payload.user_id,
			payload.geolocation,
			payload.country,
			payload.browser,
			payload.os_type,
			payload.device,
			payload.api_key_id,
		];

		try {
			// Execute the query to retrieve the latest token
			const result = await this.dataSource.query(query, values);
			return result[0];
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving token:', error);
		}
	}

	async updateCodeStatus(
		table: string,
		status: string,
		id: string,
	): Promise<void> {
		const query = `UPDATE ${table} SET status = $1 WHERE user_id = $2`;
		const values = [status, id];

		try {
			// Execute the query to update the token status in the database
			await this.dataSource.query(query, values);
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error updating token status:', error);
		}
	}

	async findCode(table: string, code: string): Promise<any> {
		const query = `SELECT 
            ac.id as ac_id, 
            ac.code, 
            ac.expires_at, 
            u.id as user_id,
			u.email as email
        FROM ${table} ac left join users u on ac.user_id = u.id WHERE 
        ac.code=$1 
        ORDER BY ac.expires_at DESC LIMIT 1`;
		const values = [code];

		try {
			// Execute the query to retrieve the last OTP code and expiration timestamp
			const result = await this.dataSource.query(query, values);
			return result[0] || null; // Return the data if found
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving last OTP:', error);
		}
	}
}
