import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository'; // Importing the AuthRepository
import { Request, Response } from 'express'; // Importing Request from express for type safety
import * as useragent from 'useragent';
import * as geoip from 'geoip-lite';
import { TOKEN_INVALID } from '@app/const';
import { helperSplit } from '@app/libraries/helpers';

/**
 * @service ValidateUseCase
 * @description
 * Handles the validation of email, phone number, and username by checking their existence in the repository.
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
	 * This method will check if the email is provided and then look up the email in the database.
	 * If the email is not found or if no email is provided, it throws a BadRequestException.
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
		if (!email) {
			throw new BadRequestException('Email is required');
		}

		// Find the email in the repository
		const fullHeap = await helperSplit(email, 'email_text_heap');
		const find = await this.repository.findByEmail('users', fullHeap);

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
	 * This method will check if the phone number is provided and then look up the phone number in the database.
	 * If the phone number is not found or if no phone number is provided, it throws a BadRequestException.
	 *
	 * @param {Request} req - The Express request object containing the phone number in the request body.
	 * @returns {Promise<boolean>} - Returns true if the phone number is found, otherwise false.
	 * @throws {BadRequestException} - Throws an exception if the phone number is not provided or not found.
	 *
	 * @example
	 * const result = await validateUseCase.validatePhone({
	 *   body: { phone: '1234567890' },
	 * });
	 */
	async validatePhone(req: Request): Promise<boolean> {
		const { phone } = req.body;

		// Check if phone number is provided
		if (phone === undefined) {
			throw new BadRequestException('Phone is required');
		}

		// Find the email in the repository
		const fullHeap = await helperSplit(phone, 'phone_text_heap');
		// Find the phone number in the repository
		const find = await this.repository.findByPhoneNumber('users', fullHeap);

		// Check if the phone number exists in the repository
		if (find == undefined) {
			throw new BadRequestException('Phone Not Found');
		}

		// Return true if phone number is found, otherwise false
		return find !== undefined;
	}

	/**
	 * @method validateUsername
	 * @description
	 * Validates if the provided username exists in the repository.
	 *
	 * This method will check if the username is provided and then look up the username in the database.
	 * If the username is not found or if no username is provided, it throws a BadRequestException.
	 *
	 * @param {Request} req - The Express request object containing the username in the request body.
	 * @returns {Promise<boolean>} - Returns true if the username is found, otherwise false.
	 * @throws {BadRequestException} - Throws an exception if the username is not provided or not found.
	 *
	 * @example
	 * const result = await validateUseCase.validateUsername({
	 *   body: { username: 'john_doe' },
	 * });
	 */
	async validateUsername(req: Request): Promise<boolean> {
		const { username } = req.body;

		// Check if username is provided
		if (username === undefined) {
			throw new BadRequestException('Username is required');
		}

		// Find the email in the repository
		const fullHeap = await helperSplit(username, 'username_text_heap');
		// Find the username in the repository
		const find = await this.repository.findByUsername('users', fullHeap);

		// Check if the username exists in the repository
		if (find == undefined) {
			throw new BadRequestException('Username Not Found');
		}

		// Return true if username is found, otherwise false
		return find !== undefined;
	}

	/**
	 * @method validateCode
	 * @description
	 * Validates if the provided Code exists in the repository.
	 *
	 * This method will check if the code is provided and then look up the username in the database.
	 * If the username is not found or if no username is provided, it throws a BadRequestException.
	 *
	 * @param {Request} req - The Express request object containing the username in the request body.
	 * @returns {Promise<boolean>} - Returns true if the username is found, otherwise false.
	 * @throws {BadRequestException} - Throws an exception if the username is not provided or not found.
	 *
	 * @example
	 * const result = await validateUseCase.validateUsername({
	 *   body: { code: 'john_doe' },
	 * });
	 */
	async validateCode(
		res: Response,
		req: Request,
	): Promise<{ is_expired: boolean }> {
		const { code } = req.body;
		const currentTime = new Date();
		const api_key_id = res.locals.api_key_id;
		const geo = geoip.lookup(req.ip);
		const agent = useragent.parse(req.headers['user-agent']);

		const find = await this.repository.checkValidateCodeI('auth_codes', {
			code: code,
			api_key_id,
			geolocation: geo
				? `${geo.city}, ${geo.region}, ${geo.country}`
				: 'Unknown',
			country: geo?.country || 'Unknown',
			browser: agent.toAgent(),
			os_type: agent.os.toString(),
			device: agent.device.toString(),
		});

		if (find && find.expires_at < currentTime) {
			await this.repository.updateCodeStatus(
				'auth_codes',
				TOKEN_INVALID,
				find.id,
			);
			return {
				is_expired: true,
			};
		}

		return {
			is_expired: false,
		};
	}
}
