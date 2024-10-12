import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthRepository {
	constructor(private dataSource: DataSource) {}

	async saveToken(table: string, payload: any): Promise<void> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
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
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error saving token:', error);
			await queryRunner.release();
			return null;
		}
	}

	async saveTokenUserResetPass(table: string, payload: any): Promise<void> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		const query = `INSERT INTO ${table} (user_id, token, status) VALUES ($1, $2, $3)`;
		const values = [payload.user_id, payload.token, payload.status];

		try {
			// Execute the query to insert the token data into the database
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error saving reset token:', error);
			await queryRunner.release();
			return null;
		}
	}

	async updateToken(table: string, payload: any, id: string): Promise<void> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		const query = `UPDATE ${table} SET token=$1, refresh_token=$2 WHERE id = $3`;
		const values = [payload.token, payload.refresh_token, id];

		try {
			// Execute the query to update the token data in the database
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error updating token:', error);
			await queryRunner.release();
			return null;
		}
	}

	async saveOtp(table: string, payload: any): Promise<void> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
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
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error saving OTP:', error);
			await queryRunner.release();
			return null;
		}
	}

	async updateTokenResetPass(
		table: string,
		status: string,
		user_id: string,
	): Promise<void> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		const query = `UPDATE ${table} SET status = $1 WHERE user_id = $2`;
		const values = [status, user_id];

		try {
			// Execute the query to update the token status in the database
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error updating token status:', error);
			await queryRunner.release();
			return null;
		}
	}

	async updateTokenStatus(
		table: string,
		status: string,
		id: string,
	): Promise<void> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		const query = `UPDATE ${table} SET status = $1 WHERE id = $2`;
		const values = [status, id];

		try {
			// Execute the query to update the token status in the database
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error updating token status:', error);
			await queryRunner.release();
			return null;
		}
	}

	async updateTokenStatusByUserId(
		table: string,
		status: string,
		id: string,
	): Promise<void> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		const query = `UPDATE ${table} SET status = $1 WHERE user_id = $2`;
		const values = [status, id];

		try {
			// Execute the query to update the token status in the database
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error updating token status:', error);
			await queryRunner.release();
			return null;
		}
	}

	async resetPassword(table: string, payload: any): Promise<void> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		const query = `UPDATE ${table} SET password = $1 WHERE id = $2`;
		const values = [payload.password, payload.id];

		try {
			// Execute the query to update the password in the database
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error updating password:', error);
			await queryRunner.release();
			return null;
		}
	}

	async cekValidateToken(table: string, payload: any): Promise<any | null> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
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
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result[0];
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving token:', error);
			await queryRunner.release();
			return null;
		}
	}

	async checkTokenUserResetPassByUserId(
		table: string,
		payload: any,
	): Promise<any | null> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		const query = `SELECT id, token, status FROM ${table} WHERE user_id=$1 AND status=$2 ORDER BY token DESC LIMIT 1`;

		const values = [payload.user_id, payload.status];

		try {
			// Execute the query to retrieve the latest token
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result[0];
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving token:', error);
			await queryRunner.release();
			return null;
		}
	}

	async checkSessions(table: string, payload: any): Promise<any | null> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
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
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result[0];
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving session:', error);
			await queryRunner.release();
			return null;
		}
	}

	async findByPhoneNumber(table: string, phone: string): Promise<any | null> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		const query = `SELECT id, email, password FROM ${table} WHERE phone_bidx=$1 LIMIT 1`;
		const values = [phone];

		try {
			// Execute the query to retrieve the user by phone number
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result[0] || null;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error finding user by phone number:', error);
			await queryRunner.release();
			return null;
		}
	}

	async findByUsername(table: string, username: string): Promise<any | null> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		const query = `SELECT id, password FROM ${table} WHERE username_bidx=$1 LIMIT 1`;
		const values = [username];

		try {
			// Execute the query to retrieve the user by username
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result[0] || null;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error finding user by username:', error);
			await queryRunner.release();
			return null;
		}
	}

	async findByEmail(table: string, email: string): Promise<any | null> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		const query = `SELECT id, email, password FROM ${table} WHERE email_bidx=$1 LIMIT 1`;
		const values = [email];

		try {
			// Execute the query to retrieve the user by email
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result[0] || null;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error finding user by email:', error);
			await queryRunner.release();
			return null;
		}
	}

	async findByNik(table: string, nik: string): Promise<any | null> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		const query = `SELECT 
			i.nik  AS nik, 
			u.id AS id,
			u.email AS email,
			u.password AS password 
		FROM ${table} i 
		LEFT JOIN users u ON i.user_id = u.id 
		WHERE i.nik_bidx=$1 LIMIT 1`;
		const values = [nik];

		try {
			// Execute the query to retrieve the user by email
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result[0] || null;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error finding user by email:', error);
			await queryRunner.release();
			return null;
		}
	}

	async findById(table: string, id: string): Promise<any | null> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		const query = `SELECT id, password FROM ${table} WHERE id=$1 LIMIT 1`;
		const values = [id];

		try {
			// Execute the query to retrieve the user by ID
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result[0] || null;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error finding user by id:', error);
			await queryRunner.release();
			return null;
		}
	}

	async saveAuthHistory(table: string, payload: any): Promise<void> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
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
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error saving authentication history:', error);
			await queryRunner.release();
			return null;
		}
	}

	async register(table: string, payload: any): Promise<boolean> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		const query = `INSERT INTO ${table} (id, username, username_bidx, email, email_bidx, password, phone, phone_bidx, segment, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
		const values = [
			payload.id,
			payload.username,
			payload.username_bidx,
			payload.email,
			payload.email_bidx,
			payload.password,
			payload.phone,
			payload.phone_bidx,
			payload.segment,
			payload.status,
		];

		try {
			// Execute the query to insert the new user data into the database
			await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return true;
		} catch (error) {
			// Log any errors that occur during the database query
			console.log('Error registering user:', error);
			await queryRunner.release();
			return false;
		}
	}

	async registerNik(table: string, payload: any): Promise<boolean> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		const query = `INSERT INTO ${table} (user_id, nik, nik_bidx, position, position_bidx, directorate, directorate_bidx, division, division_bidx, unit, unit_bidx, employee_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;
		const values = [
			payload.user_id,
			payload.nik,
			payload.nik_bidx,
			payload.position,
			payload.position_bidx,
			payload.directorate,
			payload.directorate_bidx,
			payload.division,
			payload.division_bidx,
			payload.unit,
			payload.unit_bidx,
			payload.employee_status,
		];

		try {
			// Execute the query to insert the new user data into the database
			await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return true;
		} catch (error) {
			// Log any errors that occur during the database query
			console.log('Error registering user:', error);
			await queryRunner.release();
			return false;
		}
	}

	async getLastLoginLocation(table: string, user_id: string): Promise<any> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		const query = `SELECT ip_origin, geolocation, os_type, country, browser, os_type, device FROM ${table} WHERE user_id=$1 ORDER BY user_id DESC LIMIT 1`;
		const values = [user_id];

		try {
			// Execute the query to retrieve the last login details from the database
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result[0] || null;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving last login location:', error);
			await queryRunner.release();
			return null;
		}
	}

	async findFailedLoginAttempts(
		table: string,
		user_id: string,
	): Promise<any> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		const query = `SELECT failed_login_attempts, updated_at FROM ${table} WHERE id=$1 LIMIT 1`;
		const values = [user_id];

		try {
			// Execute the query to retrieve the failed login attempts and update timestamp
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result[0] || null;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving failed login attempts:', error);
			await queryRunner.release();
			return null;
		}
	}

	async findOtpByUserId(
		table: string,
		status: string,
		user_id: string,
	): Promise<any> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
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
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result[0] || null;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving last OTP:', error);
			await queryRunner.release();
			return null;
		}
	}

	async findOtpByCode(
		table: string,
		status: string,
		otp_code: string,
	): Promise<any> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
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
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result[0] || null;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving last OTP:', error);
			await queryRunner.release();
			return null;
		}
	}

	async updateOtp(table: string, status: string, id: string): Promise<any> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		const query = `UPDATE ${table} SET status = $1 WHERE id = $2`;
		const values = [status, id];

		try {
			// Execute the query to update the OTP status in the database
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result[0] || null;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error updating status:', error);
			await queryRunner.release();
			return null;
		}
	}

	async saveCode(table: string, payload: any): Promise<void> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
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
			const result = await this.dataSource.manager.query(query, values);
			await queryRunner.release();
			return result;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error saving OTP:', error);
			await queryRunner.release();
			return null;
		}
	}

	async checkValidateCode(table: string, payload: any): Promise<any | null> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();

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
			const result = await queryRunner.manager.query(query, values);
			await queryRunner.release();
			return result[0];
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving token:', error);
			await queryRunner.release();
			return null;
		}
	}

	async updateCodeStatus(
		table: string,
		status: string,
		id: string,
	): Promise<void> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();

		const query = `UPDATE ${table} SET status = $1 WHERE id = $2`;
		const values = [status, id];

		try {
			// Execute the query to update the token status in the database
			const result = await queryRunner.manager.query(query, values);
			await queryRunner.release();
			return result;
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error updating token status:', error);
			await queryRunner.release();
			return null;
		}
	}

	async updateCodeToExpired(
		table: string,
		user_id: string,
		expires_at: Date,
	): Promise<void> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		const query = `UPDATE ${table} set status='INVALID', expires_at=$1 WHERE user_id= $2`;

		const values = [expires_at, user_id];

		try {
			const result = await queryRunner.manager.query(query, values);
			await queryRunner.release();
			return result;
		} catch (error) {
			console.error('Error updating:', error);
			await queryRunner.release();
			return null;
		}
	}

	async findCode(table: string, code: string): Promise<any> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
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
			const result = await queryRunner.manager.query(query, values);
			await queryRunner.release();
			return result[0] || null; // Return the data if found
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving last OTP:', error);
			await queryRunner.release();
			return null;
		}
	}

	async checkValidateCodeI(table: string, payload: any): Promise<any | null> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
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
			const result = await queryRunner.manager.query(query, values);
			await queryRunner.release();
			return result[0];
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving token:', error);
			await queryRunner.release();
			return null;
		}
	}

	async findSession(table: string, payload): Promise<any | null> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		const query = `SELECT id, user_id FROM ${table} WHERE id=$1 AND api_key_id=$2 LIMIT 1`;

		const values = [payload.id, payload.api_key_id];

		try {
			// Execute the query to retrieve the latest token
			const result = await queryRunner.manager.query(query, values);
			await queryRunner.release();
			return result[0];
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error retrieving token:', error);
			await queryRunner.release();
			return null;
		}
	}
}
