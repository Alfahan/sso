import { config } from 'dotenv';

// Load environment variables from a .env file into process.env
config();

export const NODE_ENV = process.env.NODE_ENV;

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

// User status
export const USER_ACTIVE = 'ACTIVE';
export const USER_INACTIVE = 'INACTIVE';
export const USER_BLOCKED = 'BLOCKED';

// Token status user Login
export const LOGGED_IN = 'LOGGED_IN';
export const LOGGED_OUT = 'LOGGED_OUT';
export const BLOCKED = 'BLOCKED';

// Token status
export const TOKEN_VALID = 'VALID';
export const TOKEN_INVALID = 'INVALID';

// Segment
export const SEGMENT_LEADS = 'LEADS';
export const SEGMENT_CUSTOMER = 'CUSTOMER';
export const SEGMENT_PARTNER = 'PARTNER';
export const SEGMENT_INTERNAL = 'INTERNAL';
export const SEGMENT_ACCOUNT_MANAGER = 'ACCOUNT_MANAGER';

// Service Model
export const SM_FREE = 'FREE';
export const SM_PREMIUM = 'PREMIUM';

// Customer Type
export const RETAIL = 'RETAIL';
export const INDIVIDUAL = 'INDIVIDUAL';
export const WHOLESALE = 'WHOLESALE';
export const CORPORATE = 'CORPORATE';

// Wapu Type
export const PRIVATE_ENTERPRISE = 'PRIVATE_ENTERPRISE';
export const GOVERNMENT = 'GOVERNMENT';

// ApiKey status
export const API_KEY_VALID = 'VALID';
export const API_KEY_INVALID = 'INVALID';

// ApiKey Static
export const API_KEY_STATIC = process.env.API_KEY_STATIC;
