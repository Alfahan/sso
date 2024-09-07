import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository'; // Importing the AuthRepository
import * as bcrypt from 'bcrypt'; // Importing bcrypt for hashing the password
import { Request } from 'express'; // Importing Request from express for type safety
import { USER_ACTIVE } from '@app/const'; // Importing user status constant

/**
 * @service RegisterUseCase
 * @description
 * Handles the user registration process, including validation of email and phone number, password hashing, and saving the user to the database.
 */
@Injectable()
export class RegisterUseCase {
	// Injecting AuthRepository for interacting with the database
	private readonly repository: AuthRepository;

	/**
	 * @constructor
	 * @param {AuthRepository} repository - The repository instance used for database interactions.
	 */
	constructor(repository: AuthRepository) {
		this.repository = repository;
	}

	/**
	 * @method register
	 * @description
	 * Registers a new user by validating the provided email and phone number, hashing the password, and saving the user data to the database.
	 *
	 * The method performs the following steps:
	 * 1. Validates that the provided email and phone number are not already in use.
	 * 2. Hashes the password using bcrypt for secure storage.
	 * 3. Saves the user information to the database.
	 *
	 * @param {Request} req - The Express request object containing the registration details. The request body should include `username`, `email`, `phone_number`, and `password`.
	 * @returns {Promise<any>} - Returns the result of the registration process, which is typically the saved user data.
	 * @throws {BadRequestException} - Throws an exception if the email or phone number is already in use, ensuring no duplicates are allowed.
	 *
	 * @example
	 * const result = await registerUseCase.register({
	 *   body: { username: 'user123', email: 'test@example.com', phone_number: '1234567890', password: 'securePassword' },
	 * });
	 * // result will contain the registered user data
	 */
	async register(req: Request) {
		const { username, email, phone_number, password } = req.body;

		let find: any = null; // Variable to hold the result of database lookups

		// Checking if the email is provided and if it already exists in the database
		if (email !== undefined) {
			find = await this.repository.findByEmail('users', email);
			if (find) {
				// Throw an error if the email is already registered
				throw new BadRequestException('Email already in use');
			}
		}

		// Checking if the phone number is provided and if it already exists in the database
		if (phone_number !== undefined) {
			find = await this.repository.findByPhoneNumber(
				'users',
				phone_number,
			);
			if (find) {
				// Throw an error if the phone number is already registered
				throw new BadRequestException('Phone number already in use');
			}
		}

		// Hashing the password using bcrypt with a salt factor of 10
		const hashedPassword = await bcrypt.hash(password, 10);

		// Registering the new user in the database
		const result = await this.repository.register('users', {
			username: username,
			email: email, // Email provided by the user
			password: hashedPassword, // Hashed password for security
			phone_number: phone_number, // Phone number provided by the user
			status: USER_ACTIVE, // Status of the new user
		});

		// Returning the result of the registration process
		return result;
	}
}
