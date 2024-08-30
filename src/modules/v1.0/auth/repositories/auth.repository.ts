import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as useragent from 'useragent'; // Library to parse and identify user agent (e.g., browser, OS)
import * as geoip from 'geoip-lite'; // Library to get geolocation data from IP addresses

@Injectable()
export class AuthRepository {
	constructor(private dataSource: DataSource) {} // Inject the DataSource for database access

	// Function to save the JWT token in the specified table with user ID and status
	async saveToken(table: string, payload: any): Promise<void> {
		const query = `INSERT INTO ${table} (user_id, token, status) VALUES ($1, $2, $3)`;
		const values = [payload.user_id, payload.token, payload.status];

		try {
			// Execute the query to insert the token data into the database
			await this.dataSource.query(query, values);
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error:', error);
		}
	}

	// Function to find a user by phone number in the specified table
	async findByNoPhone(
		table: string,
		no_phone: string,
	): Promise<string | null> {
		const query = `SELECT id, password FROM ${table} WHERE no_phone=$1 LIMIT 1`;
		const value = [no_phone];

		try {
			// Execute the query to retrieve the user by phone number
			const result = await this.dataSource.query(query, value);
			return result[0]; // Return the first result if found
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error:', error);
		}
	}

	// Function to find a user by email in the specified table
	async findByEmail(table: string, email: string): Promise<string | null> {
		const query = `SELECT id, password FROM ${table} WHERE email=$1 LIMIT 1`;
		const value = [email];

		try {
			// Execute the query to retrieve the user by email
			const result = await this.dataSource.query(query, value);
			return result[0]; // Return the first result if found
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error:', error);
		}
	}

	// Function to save login logs, including the user agent and location information
	async saveLoginLogs(
		user_id: string,
		ip: string,
		action: string,
		userAgentString: string,
	): Promise<void> {
		// Parse the user agent string to extract OS, browser, and device information
		const agent = useragent.parse(userAgentString);
		// Lookup the geolocation information from the IP address
		const geo = geoip.lookup(ip);

		// Query to insert the login log into the login_logs table
		const query = `INSERT INTO login_logs (user_id, ip, os, browser, country, device, action) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
		const values = [
			user_id,
			ip,
			agent.os.toString(), // Extracted OS information
			agent.toAgent(), // Extracted browser information
			geo?.country || 'Unknown', // Extracted country information or 'Unknown' if not found
			agent.device.toString(), // Extracted device information
			action, // Login action (e.g., 'Login')
		];

		try {
			// Execute the query to insert the login log data into the database
			await this.dataSource.query(query, values);
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error saving token:', error);
		}
	}

	// Function to register a new user by inserting the necessary information into the specified table
	async register(table: string, payload: any): Promise<void> {
		// Query to insert the new user data (email, password, phone number, status) into the table
		const query = `INSERT INTO ${table} (email, password, no_phone, status) VALUES ($1, $2, $3, $4)`;
		const values = [
			payload.email,
			payload.password,
			payload.no_phone,
			payload.status,
		];

		try {
			// Execute the query to insert the new user data into the database
			await this.dataSource.query(query, values);
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error:', error);
		}
	}

	// Function to retrieve the last login location and device details for a user from the specified table
	async getLastLoginLocation(table: string, user_id: string): Promise<any> {
		// Query to select the last login details (country, IP, OS, browser, device) for the user
		const query = `SELECT country, ip, os, browser, device FROM ${table} WHERE user_id=$1 ORDER BY user_id DESC LIMIT 1`;
		const values = [user_id];

		try {
			// Execute the query to retrieve the last login details from the database
			const result = await this.dataSource.query(query, values);
			return result[0]; // Return the first result if found
		} catch (error) {
			// Log any errors that occur during the database query
			console.error('Error:', error);
		}
	}
}
