import { config } from 'dotenv';

// Load environment variables from a .env file into process.env
config();

// Application name, usually used for logging or application identification
export const APP_NAME = process.env.APP_NAME;

// Port on which the application will run
export const PORT = process.env.PORT;

// Database host address
export const DB_HOST = process.env.DB_HOST;

// Database port number
export const DB_PORT = process.env.DB_PORT;

// Database username
export const DB_USER = process.env.DB_USER;

// Database password
export const DB_PASS = process.env.DB_PASS;

// Database name
export const DB_NAME = process.env.DB_NAME;

// Secret key used for encryption or signing tokens
export const SECRET_KEY = process.env.SECRET_KEY;
