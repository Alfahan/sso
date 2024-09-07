import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { Request } from 'express';
import CryptoTs from 'pii-agent-ts';
import Notification from 'notif-agent-ts';
import {
	checkRateLimit,
	incrementFailedAttempts,
	resetFailedAttempts,
} from '@app/middlewares/checkRateLimit.middleware';
import { TOKEN_VALID } from '@app/const';

@Injectable()
export class OtpLoginPhoneUseCase {
	constructor(private readonly repository: AuthRepository) {}

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
		const otpExpired = this.addMinutesToDate(new Date(), 5);

		// Save the encrypted OTP and its expiration time to the database
		await this.repository.saveOtp('mfa_infos', {
			otp_code: encryptOtp.Value.toString(),
			otp_expired_at: otpExpired,
			user_id: user.id,
			status: TOKEN_VALID,
		});

		// Send the OTP code to the user's phone number
		await this.sendOtpToUser(phone_number, otpCode);

		// Reset the failed login attempts after a successful OTP request
		await resetFailedAttempts(user.id, this.repository);

		return null;
	}

	/**
	 * Sends the OTP code to the user via a messaging service.
	 *
	 * This method uses the `notif-agent-ts` library to send a WhatsApp message with the OTP code.
	 *
	 * @param phone_number - The phone number to which the OTP will be sent.
	 * @param otpCode - The OTP code to be sent to the user.
	 * @returns Promise<void> - Logs the result of the messaging operation.
	 * @throws Error - Throws an error if the message could not be sent.
	 *
	 * @example
	 * await sendOtpToUser('+1234567890', '123456');
	 */
	private async sendOtpToUser(
		phone_number: string,
		otpCode: string,
	): Promise<void> {
		const messageData = {
			phone_numbers: [phone_number], // The recipient's phone number
			message: {
				type: 'template',
				template: {
					template_code_id:
						'4fd64ce5_88ac_4983_a0ac_900dd0e98d0e:2stepverification', // OTP template ID
					payload: [
						{
							position: 'body',
							parameters: [
								{
									type: 'text',
									text: otpCode, // The OTP code to be inserted in the template
								},
							],
						},
						{
							position: 'button',
							parameters: [
								{
									sub_type: 'url',
									index: '0',
									parameters: [
										{
											type: 'text',
											text: otpCode, // Reiterating the OTP in the button text
										},
									],
								},
							],
						},
					],
				},
			},
		};

		try {
			// Send the message using the sendOcaWa function from the Notification object
			const response = await Notification.sendOcaWa(messageData);
			console.log('Message sent successfully:', response); // Log success response
		} catch (error) {
			console.error('Failed to send message:', error.message); // Handle and log any messaging errors
		}
	}

	/**
	 * Adds a specified number of minutes to a given date.
	 *
	 * @param date - The original date to which minutes will be added.
	 * @param minutes - The number of minutes to add.
	 * @returns Date - The new date with the minutes added.
	 *
	 * @example
	 * const futureDate = addMinutesToDate(new Date(), 10);
	 * console.log(futureDate); // Logs the date 10 minutes from now
	 */
	private addMinutesToDate(date: Date, minutes: number): Date {
		const newDate = new Date(date.getTime() + minutes * 60000);
		return newDate;
	}
}
