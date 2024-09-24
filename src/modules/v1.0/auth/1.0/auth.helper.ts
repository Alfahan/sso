import * as bcrypt from 'bcrypt';
import * as path from 'path';
import CryptoTs from 'pii-agent-ts';
import { v4 as uuidv4 } from 'uuid';
import Notification from 'notif-agent-ts';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { TooManyRequestsException } from '@app/common/api-response/interfaces/fabd-to-many-request';
import { AuthRepository } from '../repositories/auth.repository';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TOKEN_VALID } from '@app/const';

@Injectable()
export class AuthHelper {
	constructor(
		private readonly repository: AuthRepository,
		private readonly jwtService: JwtService,
	) {}

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
	 * Metode utilitas untuk mengurangi sejumlah menit dari tanggal yang diberikan.
	 *
	 * @param {Date} date - Tanggal asli yang ingin dikurangi menitnya.
	 * @param {number} minutes - Jumlah menit yang ingin dikurangi.
	 * @returns {Date} - Tanggal baru setelah dikurangi sejumlah menit.
	 */
	subtractMinutesFromDate(date: Date, minutes: number): Date {
		const newDate = new Date(date.getTime() - minutes * 60000);
		return newDate;
	}

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

	sendNewLoginAlert(payload: any): void {
		const mailOptions = {
			from: 'sso.fabdigital@gmail.com',
			to: [payload.email],
			subject: 'New Device Login',
			templatePath: path.join(
				process.cwd(),
				'assets',
				'newDeviceLoginAlert.html',
			),
			context: {
				browser: payload.browser,
				device: payload.device,
				geolocation: payload.geolocation,
				country: payload.country,
				date: new Date(),
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
			throw new ForbiddenException(
				'Registration using testing email domains is not allowed',
			);
		}
	}

	async checkRateLimit(user_id: string): Promise<void> {
		const attempt = await this.repository.findFailedLoginAttempts(
			'users',
			user_id,
		);

		if (attempt.failed_login_attempts > 0) {
			const lastAttemptTime = new Date(attempt.updated_at).getTime();

			const timeSinceLastAttempt = (Date.now() - lastAttemptTime) / 1000;

			if (
				attempt.failed_login_attempts >= 5 &&
				timeSinceLastAttempt < 15 * 60
			) {
				throw new TooManyRequestsException(
					'Too many request attempts. Try again later.',
				);
			} else if (timeSinceLastAttempt >= 15 * 60) {
				await this.resetFailedAttempts(user_id);
			}
		}
	}

	async incrementFailedAttempts(user_id: string): Promise<void> {
		const attempt = await this.repository.findFailedLoginAttempts(
			'users',
			user_id,
		);

		attempt.failed_login_attempts += 1;
		attempt.updated_at = new Date();

		await this.repository.addFailedLoginAttempts(
			'users',
			{
				failed_login_attempts: attempt.failed_login_attempts,
				updated_at: attempt.updated_at,
			},
			user_id,
		);
	}

	async resetFailedAttempts(user_id: string): Promise<void> {
		const attempt = await this.repository.findFailedLoginAttempts(
			'users',
			user_id,
		);

		attempt.failed_login_attempts = 0;
		attempt.updated_at = new Date();

		await this.repository.addFailedLoginAttempts(
			'users',
			{
				failed_login_attempts: attempt.failed_login_attempts,
				updated_at: attempt.updated_at,
			},
			user_id,
		);
	}

	generateOtpCode(): string {
		return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
	}

	async logAuthHistory(
		req: Request,
		geo: any,
		agent: any,
		action: string,
		user_id?: string,
	) {
		await this.repository.saveAuthHistory('auth_histories', {
			user_id: user_id || null,
			ip_origin: req.ip,
			geolocation: geo
				? `${geo.city}, ${geo.region}, ${geo.country}`
				: 'Unknown',
			country: geo?.country || 'Unknown',
			browser: agent.toAgent(),
			os_type: agent.os.toString(),
			device: agent.device.toString(),
			action,
		});
	}

	generateTokens() {
		const uuid = uuidv4();
		const encryptUuid = CryptoTs.encryptWithAes('AES_256_CBC', uuid);
		const payloadToken = { sub: encryptUuid.Value.toString() };
		const accessToken = this.jwtService.sign(payloadToken, {
			expiresIn: '15m',
		});
		const refreshToken = this.jwtService.sign(payloadToken, {
			expiresIn: '7d',
		});
		return { accessToken, refreshToken, uuid };
	}

	async setCode(
		req: Request,
		user_id: string,
		api_key_id: string,
		geo: any,
		agent: any,
	): Promise<{ code: string }> {
		const currentTime = new Date();
		const code = this.generateOtpCode();
		await this.repository.saveCode('auth_codes', {
			code,
			expires_at: this.addMinutesToDate(currentTime, 60),
			user_id: user_id,
			api_key_id,
			status: TOKEN_VALID,
			ip_origin: req.ip,
			geolocation: geo
				? `${geo.city}, ${geo.region}, ${geo.country}`
				: 'Unknown',
			country: geo?.country || 'Unknown',
			browser: agent.toAgent(),
			os_type: agent.os.toString(),
			device: agent.device.toString(),
		});

		return { code };
	}
}
