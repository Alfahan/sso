import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { Request } from 'express';

@Injectable()
export class ValidateUseCase {
	private readonly repository: AuthRepository;

	/**
	 * Constructor for initializing ValidateUseCase with the given repository.
	 * @param repository - The AuthRepository instance used for database operations.
	 */
	constructor(repository: AuthRepository) {
		this.repository = repository;
	}

	/**
	 * Validate if the provided email exists in the repository.
	 * @param req - Express Request object containing the email in the request body.
	 * @returns - Returns true if the email is found, otherwise false.
	 * @throws - Throws BadRequestException if the email is not provided.
	 */
	async validateEmail(req: Request): Promise<boolean> {
		// Extract email from the request body
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
	 * Validate if the provided phone number exists in the repository.
	 * @param req - Express Request object containing the phone number in the request body.
	 * @returns - Returns true if the phone number is found, otherwise false.
	 * @throws - Throws BadRequestException if the phone number is not provided.
	 */
	async validatePhone(req: Request): Promise<boolean> {
		// Extract phone number from the request body
		const { no_phone } = req.body;

		// Check if phone number is provided
		if (no_phone === undefined) {
			throw new BadRequestException('Phone is required');
		}

		// Find the phone number in the repository
		const find = await this.repository.findByNoPhone('users', no_phone);

		// Check if the phone number exists in the repository
		if (find == undefined) {
			throw new BadRequestException('Phone Not Found');
		}

		// Return true if phone number is found, otherwise false
		return find !== undefined;
	}
}
