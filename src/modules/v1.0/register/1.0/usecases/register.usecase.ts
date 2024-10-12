import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'; // Importing bcrypt for hashing the password
import { Request } from 'express'; // Importing Request from express for type safety
import {
	NODE_ENV,
	SEGMENT_ACCOUNT_MANAGER,
	SEGMENT_CUSTOMER,
	SEGMENT_INTERNAL,
	SEGMENT_LEADS,
	SEGMENT_PARTNER,
	USER_ACTIVE,
} from '@app/const'; // Importing user status constant
import { User } from '@app/entities/user.entity';
import CryptoTs from 'pii-agent-ts';
import { RegisterRepository } from '../../repositories/register.repository';
import { validateDomain } from '@app/libraries/helpers';
import { v4 as uuidv4 } from 'uuid';
/**
 * @service RegisterUseCase
 * @description
 * Handles the user registration process, including validation of email and phone number, password hashing, and saving the user to the database.
 */
@Injectable()
export class RegisterUseCase {
	constructor(private readonly repository: RegisterRepository) {}

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
		const { segment } = req.params;

		// Define the valid segments (all in lowercase for case-insensitive comparison)
		const validSegments = [
			SEGMENT_LEADS,
			SEGMENT_CUSTOMER,
			SEGMENT_PARTNER,
			SEGMENT_INTERNAL,
			SEGMENT_ACCOUNT_MANAGER,
		];

		// Normalize the provided segment to lowercase for validation
		const normalizedSegment = segment.toUpperCase();

		// Validate the provided segment (case-insensitive)
		if (!validSegments.includes(normalizedSegment)) {
			throw new BadRequestException('Invalid segment provided.');
		}

		if (NODE_ENV === 'PRODUCTION') {
			// Validate the email domain before proceeding
			validateDomain(email);
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
			id: uuidv4(),
			username: saveToHeap.username,
			username_bidx: saveToHeap.username_bidx,
			email: saveToHeap.email,
			email_bidx: saveToHeap.email_bidx,
			password: hashedPassword,
			phone: saveToHeap.phone,
			phone_bidx: saveToHeap.phone_bidx,
			segment: normalizedSegment,
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
