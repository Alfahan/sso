import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository'; // Importing the AuthRepository
import * as bcrypt from 'bcrypt'; // Importing bcrypt for hashing the password
import { Request } from 'express'; // Importing Request from express for type safety
import { NODE_ENV, USER_ACTIVE } from '@app/const'; // Importing user status constant
import { AuthHelper } from '../auth.helper';
import { User } from '@app/entities/user.entity';
import CryptoTs from 'pii-agent-ts';

/**
 * @service RegisterUseCase
 * @description
 * Handles the user registration process, including validation of email and phone number, password hashing, and saving the user to the database.
 */
@Injectable()
export class RegisterUseCase {
	constructor(
		private readonly repository: AuthRepository,
		private readonly helper: AuthHelper,
	) {}

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
	 * @param {Request} req - The Express request object containing the registration details. The request body should include `username`, `email`, `phone`, and `password`.
	 * @returns {Promise<any>} - Returns the result of the registration process, which is typically the saved user data.
	 * @throws {BadRequestException} - Throws an exception if the email or phone number is already in use, ensuring no duplicates are allowed.
	 *
	 * @example
	 * const result = await registerUseCase.register({
	 *   body: { username: 'user123', email: 'test@example.com', phone: '1234567890', password: 'securePassword' },
	 * });
	 * // result will contain the registered user data
	 */
	async register(req: Request) {
		const { username, email, phone, password } = req.body;

		if (NODE_ENV === 'PRODUCTION') {
			// Validate the email domain before proceeding
			this.helper.validateDomain(email);
		}

		// Hashing the password using bcrypt with a salt factor of 10
		const hashedPassword = await bcrypt.hash(password, 10);

		const user = new User();
		user.username = CryptoTs.encryptWithAes('AES_256_CBC', username);
		user.email = CryptoTs.encryptWithAes('AES_256_CBC', email);
		user.phone = CryptoTs.encryptWithAes('AES_256_CBC', phone);

		const saveToHeap = await CryptoTs.buildBlindIndex(user);

		// Registering the new user in the database
		const result = await this.repository.register('users', {
			username: saveToHeap.username,
			username_bidx: saveToHeap.username_bidx,
			email: saveToHeap.email,
			email_bidx: saveToHeap.email_bidx,
			password: hashedPassword,
			phone: saveToHeap.phone,
			phone_bidx: saveToHeap.phone_bidx,
			status: USER_ACTIVE,
		});
		// Return the result of the successful registration
		if (result === false) {
			console.log('Error during registration');
			throw new BadRequestException(
				'Failed to register user. Username, Email, Phone has been registered',
			);
		}
	}
}
