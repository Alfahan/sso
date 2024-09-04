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

@Injectable()
export class OtpLoginPhoneUseCase {
	constructor(private readonly repository: AuthRepository) {}

	/**
	 * Method to handle OTP request for login via phone number.
	 *
	 * 1. Checks if the user exists based on the phone number.
	 * 2. Ensures rate limiting is enforced to avoid repeated requests.
	 * 3. If an OTP was previously sent and is still valid, prevents sending a new OTP until it expires.
	 * 4. Generates and encrypts a new OTP code if the user is eligible for a new one.
	 * 5. Saves the OTP code and its expiration time to the database.
	 * 6. Sends the OTP to the user using a messaging system.
	 *
	 * @param req - Express Request object containing phone number in the request body.
	 * @returns Promise<void> - Returns null or throws an error in case of failure.
	 * @throws Error - If the user is not found, OTP is already sent, or rate limiting conditions are breached.
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
		const lastOtp = await this.repository.findLastOtp('mfa_infos', user.id);
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
		});

		// Send the OTP code to the user's phone number
		await this.sendOtpToUser(phone_number, otpCode);

		// Reset the failed login attempts after a successful OTP request
		await resetFailedAttempts(user.id, this.repository);

		return null;
	}

	/**
	 * Helper method to send the OTP code to the user via a messaging service.
	 *
	 * This method uses the `notif-agent-ts` to send a WhatsApp message with an OTP.
	 *
	 * @param phone_number - The phone number to send the OTP to.
	 * @param otpCode - The OTP code to be sent to the user.
	 * @returns Promise<void> - Logs the result of the messaging operation.
	 * @throws Error - In case of failure to send the message, logs the error.
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
	 * Utility method to add a specified number of minutes to a given date.
	 *
	 * @param date - The original date to add minutes to.
	 * @param minutes - The number of minutes to add.
	 * @returns Date - The new date with the minutes added.
	 */
	private addMinutesToDate(date: Date, minutes: number): Date {
		const newDate = new Date(date.getTime() + minutes * 60000);
		return newDate;
	}
}
