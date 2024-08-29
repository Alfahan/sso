import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as useragent from 'useragent';
import * as geoip from 'geoip-lite';

@Injectable()
export class AuthRepository {
	constructor(private dataSource: DataSource) {}

	async saveToken(table: string, payload: any): Promise<void> {
		const query = `INSERT INTO ${table} (user_id, token, status) VALUES ($1, $2, $3)`;
		const values = [payload.user_id, payload.token, payload.status];

		try {
			await this.dataSource.query(query, values);
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async findByNoPhone(
		table: string,
		no_phone: string,
	): Promise<string | null> {
		const query = `SELECT id, password FROM ${table} WHERE no_phone=$1 LIMIT 1`;
		const value = [no_phone];

		try {
			const result = await this.dataSource.query(query, value);
			return result[0];
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async findByEmail(table: string, email: string): Promise<string | null> {
		const query = `SELECT id, password FROM ${table} WHERE email=$1 LIMIT 1`;
		const value = [email];

		try {
			const result = await this.dataSource.query(query, value);
			return result[0];
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async saveLoginLogs(
		user_id: string,
		ip: string,
		action: string,
		userAgentString: string,
	): Promise<void> {
		const agent = useragent.parse(userAgentString);
		const geo = geoip.lookup(ip);

		const query = `INSERT INTO login_logs (user_id, ip, os, browser, country, action) VALUES ($1, $2, $3, $4, $5, $6)`;
		const values = [
			user_id,
			ip,
			agent.os.toString(),
			agent.toAgent(),
			geo?.country || 'Unknown',
			action,
		];

		try {
			await this.dataSource.query(query, values);
		} catch (error) {
			console.error('Error saving token:', error);
		}
	}

	async register(table: string, payload: any): Promise<void> {
		const query = `INSERT INTO ${table} (email, password, no_phone, status) VALUES ($1, $2, $3, $4)`;
		const values = [
			payload.email,
			payload.password,
			payload.no_phone,
			payload.status,
		];

		try {
			await this.dataSource.query(query, values);
		} catch (error) {
			console.error('Error:', error);
		}
	}
}
