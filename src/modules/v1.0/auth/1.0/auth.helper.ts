import { AuthRepository } from '../repositories/auth.repository';
import * as bcrypt from 'bcrypt'; // bcrypt library for hashing and comparing passwords
import * as path from 'path';
import Notification from 'notif-agent-ts';
import { BadRequestException } from '@nestjs/common';

export class AuthHelper {
	constructor(private readonly repository: AuthRepository) {}

	/**
	 * Validates the given plain password against the hashed password stored in the database.
	 *
	 * @param {string} plainPassword - The plain password provided by the user.
	 * @param {string} hashedPassword - The hashed password stored in the database.
	 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the password is valid.
	 */
	async isPasswordValid(
		plainPassword: string,
		hashedPassword: string,
	): Promise<boolean> {
		return bcrypt.compare(plainPassword, hashedPassword);
	}

	/**
	 * Utility method to add a specified number of minutes to a given date.
	 *
	 * @param {Date} date - The original date to add minutes to.
	 * @param {number} minutes - The number of minutes to add.
	 * @returns {Date} - The new date with the minutes added.
	 */
	addMinutesToDate(date: Date, minutes: number): Date {
		const newDate = new Date(date.getTime() + minutes * 60000);
		return newDate;
	}

	/**
	 * Sends an OTP verification email to the user's email address.
	 *
	 * @param {string} email - The recipient's email address where the OTP will be sent.
	 * @param {string} otpCode - The OTP code that will be sent to the user.
	 *
	 * This function uses Nodemailer to send an OTP verification email
	 * to the provided email address. The HTML email template is stored in the `assets`
	 * folder and will be rendered with the provided data (in this case, the OTP code).
	 *
	 * Example usage:
	 *
	 * ```typescript
	 * sendOtpVerification('user@example.com', '123456');
	 * ```
	 *
	 * The email template should contain a placeholder for the `otpCode`,
	 * for example in the HTML template:
	 *
	 * ```html
	 * <p>Your OTP code is: {{otpCode}}</p>
	 * ```
	 *
	 * If there is an error while sending the email, it will be handled and logged
	 * using `console.error`.
	 */
	sendOtpVerification(email: string, otpCode: string): void {
		const mailOptions = {
			from: 'sso.fabdigital@gmail.com',
			to: [email],
			subject: 'OTP Verification',
			templatePath: path.join(
				process.cwd(),
				'assets',
				'otpVerification.html',
			),
			context: {
				otpCode: otpCode,
			},
		};

		Notification.sendMail(mailOptions).catch(console.error);
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
	async sendOtpToUser(phone_number: string, otpCode: string): Promise<void> {
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

	validateDomain(email: string): void {
		const forbiddenDomains = [
			'example.com',
			'example.net',
			'example.org',
			'mailinator.com',
			'test.com',
			'yopmail.com',
			'ethereal.email',
		];
		// Check if the email is from a forbidden domain
		const emailDomain = email.split('@')[1]; // Extract domain from email
		if (forbiddenDomains.includes(emailDomain)) {
			throw new BadRequestException(
				'Registration using testing email domains is not allowed',
			);
		}
	}
}
