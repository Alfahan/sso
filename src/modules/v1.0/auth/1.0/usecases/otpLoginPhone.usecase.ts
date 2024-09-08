import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { Request } from 'express';
import CryptoTs from 'pii-agent-ts';
import {
	checkRateLimit,
	incrementFailedAttempts,
	resetFailedAttempts,
} from '@app/middlewares/checkRateLimit.middleware';
import { TOKEN_VALID } from '@app/const';
import { AuthHelper } from '../auth.helper';

@Injectable()
export class OtpLoginPhoneUseCase {
	constructor(
		private readonly repository: AuthRepository,
		private readonly helper: AuthHelper,
	) {}

	/**
	 * Handles OTP request for login via phone number.
	 *
	 * This method performs several tasks:
	 * 1. Checks if the user exists based on the provided phone number.
	 * 2. Enforces rate limiting to prevent abuse of OTP requests.
	 * 3. Ensures that a new OTP is only generated if no valid OTP exists for the user.
	 * 4. Encrypts the new OTP code and saves it, along with its expiration time, to the database.
	 * 5. Sends the OTP to the user's phone number using a messaging service.
	 * 6. Resets failed login attempts if the OTP request is successful.
	 *
	 * @param req - The Express request object containing the phone number in the request body.
	 * @returns Promise<void> - Returns a promise indicating successful completion or throws an error.
	 * @throws Error - Throws an error if the user is not found, if an OTP is already valid, or if rate limits are breached.
	 *
	 * @example
	 * await otpLoginPhoneUseCase.requestOtp({
	 *   body: { phone_number: '+1234567890' }
	 * });
	 *
	 * @summary Steps:
	 * - Extract the phone number from the request body.
	 * - Verify if the user exists using the phone number.
	 * - Check and enforce rate limiting for OTP requests.
	 * - Check if there is an existing valid OTP.
	 * - Generate a new OTP if necessary, encrypt it, and save it to the database.
	 * - Send the OTP to the user's phone number.
	 * - Reset failed attempts counter on successful OTP request.
	 */
	async requestOtp(req: Request): Promise<void> {
		const { phone_number } = req.body;

		// Check if user exists by phone number
		const user = await this.repository.findByPhoneNumber(
			'users',
			phone_number,
		);

		if (!user) {
			throw new Error('User not found');
		}

		// Check rate limiting for OTP requests
		await checkRateLimit(user.id, this.repository);

		// Check if the user already has an active OTP that hasn't expired
		const lastOtp = await this.repository.findLastOtp(
			'mfa_infos',
			TOKEN_VALID,
			user.id,
		);
		const currentTime = new Date();

		// If an OTP is still active, block the request and inform the user when they can request again
		if (lastOtp && lastOtp.otp_expired_at > currentTime) {
			const timeDifference =
				(lastOtp.otp_expired_at.getTime() - currentTime.getTime()) /
				60000;
			await incrementFailedAttempts(user.id, this.repository); // Increment failed attempts if trying too soon
			throw new Error(
				`OTP already sent. Please wait ${Math.ceil(timeDifference)} minute(s) to request again.`,
			);
		}

		// Generate a new OTP code
		const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

		// Encrypt the OTP using AES-256-CBC encryption
		const encryptOtp = CryptoTs.encryptWithAes('AES_256_CBC', otpCode);

		// Set the expiration time for the OTP to 5 minutes from now
		const otpExpired = this.helper.addMinutesToDate(new Date(), 5);

		// Save the encrypted OTP and its expiration time to the database
		await this.repository.saveOtp('mfa_infos', {
			otp_code: encryptOtp.Value.toString(),
			otp_expired_at: otpExpired,
			user_id: user.id,
			status: TOKEN_VALID,
		});

		// Send the OTP code to the user's phone number
		await this.helper.sendOtpToUser(phone_number, otpCode);

		// Reset the failed login attempts after a successful OTP request
		await resetFailedAttempts(user.id, this.repository);

		return null;
	}
}
