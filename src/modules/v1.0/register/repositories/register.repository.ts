import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class RegisterRepository {
	constructor(private dataSource: DataSource) {}

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
}
