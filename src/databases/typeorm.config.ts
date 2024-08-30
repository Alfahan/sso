import { DataSource } from 'typeorm'; // Importing DataSource class from TypeORM to configure database connection
import { config } from 'dotenv'; // Importing config function from dotenv to load environment variables
import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from '@app/const'; // Importing database configuration from constants

config(); // Load environment variables from a .env file

// Creating and exporting a new instance of DataSource configured for PostgreSQL
export const AppDataSource = new DataSource({
	type: 'postgres', // Database type
	host: DB_HOST, // Database host from environment variables
	port: parseInt(DB_PORT), // Database port, converted to integer from environment variable
	username: DB_USER, // Database username from environment variables
	password: DB_PASS, // Database password from environment variables
	database: DB_NAME, // Database name from environment variables
	entities: [__dirname + '/../entities/*.entity{.ts,.js}'], // Path to entity files
	synchronize: false, // Disable auto synchronization of the database schema
	logging: true, // Enable logging of database queries and operations
	migrations: [`${__dirname}/migrations/*{.ts,.js}`], // Path to migration files
	migrationsTableName: 'migrations', // Name of the table to keep track of migrations
});

export default AppDataSource; // Exporting the configured DataSource instance as the default export
