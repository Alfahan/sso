import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository'; // Importing the AuthRepository
import { Request } from 'express'; // Importing Request from express for type safety

/**
 * @service ValidateUseCase
 * @description
 * Handles the validation of email and phone number by checking their existence in the repository.
 */
@Injectable()
export class ValidateUseCase {
	private readonly repository: AuthRepository;

	/**
	 * @constructor
	 * @param {AuthRepository} repository - The AuthRepository instance used for database operations.
	 */
	constructor(repository: AuthRepository) {
		this.repository = repository;
	}

	/**
	 * @method validateEmail
	 * @description
	 * Validates if the provided email exists in the repository.
	 *
	 * @param {Request} req - The Express request object containing the email in the request body.
	 * @returns {Promise<boolean>} - Returns true if the email is found, otherwise false.
	 * @throws {BadRequestException} - Throws an exception if the email is not provided or not found.
	 *
	 * @example
	 * const result = await validateUseCase.validateEmail({
	 *   body: { email: 'test@example.com' },
	 * });
	 */
	async validateEmail(req: Request): Promise<boolean> {
		const { email } = req.body;

		// Check if email is provided
		if (email === undefined) {
			throw new BadRequestException('Email is required');
		}

		// Find the email in the repository
		const find = await this.repository.findByEmail('users', email);

		// Check if the email exists in the repository
		if (find == undefined) {
			throw new BadRequestException('Email Not Found');
		}

		// Return true if email is found, otherwise false
		return find !== undefined;
	}

	/**
	 * @method validatePhone
	 * @description
	 * Validates if the provided phone number exists in the repository.
	 *
	 * @param {Request} req - The Express request object containing the phone number in the request body.
	 * @returns {Promise<boolean>} - Returns true if the phone number is found, otherwise false.
	 * @throws {BadRequestException} - Throws an exception if the phone number is not provided or not found.
	 *
	 * @example
	 * const result = await validateUseCase.validatePhone({
	 *   body: { phone_number: '1234567890' },
	 * });
	 */
	async validatePhone(req: Request): Promise<boolean> {
		const { phone_number } = req.body;

		// Check if phone number is provided
		if (phone_number === undefined) {
			throw new BadRequestException('Phone is required');
		}

		// Find the phone number in the repository
		const find = await this.repository.findByPhoneNumber(
			'users',
			phone_number,
		);

		// Check if the phone number exists in the repository
		if (find == undefined) {
			throw new BadRequestException('Phone Not Found');
		}

		// Return true if phone number is found, otherwise false
		return find !== undefined;
	}
}
