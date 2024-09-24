import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthRepository {
	constructor(private dataSource: DataSource) {}

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

	async updateTokenStatusByUserId(
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
			// Execute the query to retrieve the failed login attempts and update timestamp
			const result = await this.dataSource.query(query, values);
			return result[0] || null; // Return the data if found
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving failed login attempts:', error);
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

	async checkValidateCode(table: string, payload: any): Promise<any | null> {
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

	async updateCodeToExpired(
		table: string,
		user_id: string,
		expires_at: Date,
	): Promise<void> {
		const query = `UPDATE ${table} set status='INVALID', expires_at=$1 WHERE user_id= $2`;

		const values = [expires_at, user_id];

		try {
			await this.dataSource.query(query, values);
		} catch (error) {
			console.error('Error updating:', error);
		}
	}

	async findCode(table: string, code: string): Promise<any> {
		const query = `SELECT 
            ac.id as ac_id, 
			ac.status,
            ac.code,
            ac.expires_at, 
            u.id as user_id,
			u.email as email
        FROM ${table} ac left join users u on ac.user_id = u.id WHERE 
        ac.code=$1 AND ac.status='VALID'
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

	async checkValidateCodeI(table: string, payload: any): Promise<any | null> {
		const query = `SELECT id, code, status, expires_at FROM ${table} WHERE code=$1 AND geolocation=$2 AND country=$3 AND browser=$4 AND os_type=$5 AND device=$6 AND api_key_id=$7 ORDER BY expires_at DESC LIMIT 1`;

		const values = [
			payload.code,
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

	async findSession(table: string, payload): Promise<any | null> {
		const query = `SELECT id, user_id FROM ${table} WHERE id=$1 AND api_key_id=$2 LIMIT 1`;

		const values = [payload.id, payload.api_key_id];

		try {
			// Execute the query to retrieve the latest token
			const result = await this.dataSource.query(query, values);
			return result[0];
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving token:', error);
		}
	}
}
