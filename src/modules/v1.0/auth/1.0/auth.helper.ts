import * as bcrypt from 'bcrypt';
import CryptoTs from 'pii-agent-ts';
import { v4 as uuidv4 } from 'uuid';
import Notification from 'notif-agent-ts';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { TooManyRequestsException } from '@app/common/api-response/interfaces/fabd-to-many-request';
import { AuthRepository } from '../repositories/auth.repository';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TOKEN_VALID } from '@app/const';
import { generateRandomString } from '@app/libraries/helpers';

@Injectable()
export class AuthHelper {
	constructor(
		private readonly repository: AuthRepository,
		private readonly jwtService: JwtService,
	) {}

	/**
	 * isPasswordValid
	 * @author telkomdev-alfahan
	 * @date 2024-10-06
	 * @param { string } plainPassword
	 * @param { string } hashedPassword
	 * @returns { Promise<boolean> }
	 */
	async isPasswordValid(
		plainPassword: string,
		hashedPassword: string,
	): Promise<boolean> {
		return bcrypt.compare(plainPassword, hashedPassword);
	}

	/**
	 * addMinutesToDate
	 * @author telkomdev-alfahan
	 * @date 2024-10-06
	 * @param { Date } date
	 * @param { number } minutes
	 * @returns { Date }
	 */
	addMinutesToDate(date: Date, minutes: number): Date {
		const newDate = new Date(date.getTime() + minutes * 60000);
		return newDate;
	}

	/**
	 * subtractMinutesFromDate
	 * @author telkomdev-alfahan
	 * @date 2024-10-06
	 * @param { Date } date
	 * @param { number } minutes
	 * @returns { Date }
	 */
	subtractMinutesFromDate(date: Date, minutes: number): Date {
		const newDate = new Date(date.getTime() - minutes * 60000);
		return newDate;
	}

	/**
	 * sendOtpVerification
	 * @author telkomdev-alfahan
	 * @date 2024-10-06
	 * @param { string } email
	 * @param { string } otpCode
	 * @returns { void }
	 */
	sendOtpVerification(email: string, otpCode: string): void {
		const payloadMail = {
			to: [email],
			subject: 'OTP Verification',
			templateCode: 'sso_otp_verification',
			data: {
				otp_code: otpCode,
			},
		};

		Notification.sendMail(payloadMail);
	}

	/**
	 * sendNewLoginAlert
	 * @author telkomdev-alfahan
	 * @date 2024-10-06
	 * @param { any } payload
	 * @returns { void }
	 */
	sendNewLoginAlert(payload: any): void {
		const payloadMail = {
			to: [payload.email],
			subject: 'New Device Login',
			templateCode: 'sso_new_device_login',
			data: {
				browser: payload.browser,
				device: payload.device,
				geolocation: payload.geolocation,
				country: payload.country,
				date: new Date(),
			},
		};

		Notification.sendMail(payloadMail);
	}

	/**
	 * sendOtpToUser
	 * @author telkomdev-alfahan
	 * @date 2024-10-06
	 * @param { string } phone_number
	 * @param { string } otpCode
	 * @returns { Promise<void> }
	 */
	async sendOtpToUser(phone_number: string, otpCode: string): Promise<void> {
		const messageData = {
			phone_number: phone_number, // The recipient's phone number
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
	 * validateDomain
	 * @author telkomdev-alfahan
	 * @date 2024-10-06
	 * @param { string } email
	 * @returns { void }
	 */
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

	/**
	 * checkRateLimit
	 * @author telkomdev-alfahan
	 * @date 2024-10-06
	 * @param { string } user_id
	 * @returns { Promise<void> }
	 */
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

	/**
	 * incrementFailedAttempts
	 * @author telkomdev-alfahan
	 * @date 2024-10-06
	 * @param { string } user_id
	 * @returns { Promise<void> }
	 */
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

	/**
	 * resetFailedAttempts
	 * @author telkomdev-alfahan
	 * @date 2024-10-06
	 * @param { string } user_id
	 * @returns { Promise<void> }
	 */
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

	/**
	 * generateOtpCode
	 * @author telkomdev-alfahan
	 * @date 2024-10-06
	 * @returns { string }
	 */
	generateOtpCode(): string {
		return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
	}

	/**
	 * logAuthHistory
	 * @author telkomdev-alfahan
	 * @date 2024-10-06
	 * @param { Request } req
	 * @param { any } geo
	 * @param { any } agent
	 * @param { string } action
	 * @param { string } user_id
	 */
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

	/**
	 * generateTokens
	 * @author telkomdev-alfahan
	 * @date 2024-10-06
	 */
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

	/**
	 * setCode
	 * @author telkomdev-alfahan
	 * @date 2024-10-06
	 * @param { Request } req
	 * @param { string } user_id
	 * @param { string } api_key_id
	 * @param { any } geo
	 * @param { any } agent
	 * @returns { Promise<{ code: string }> }
	 */
	async setCode(
		req: Request,
		user_id: string,
		api_key_id: string,
		geo: any,
		agent: any,
	): Promise<{ code: string }> {
		const currentTime = new Date();
		const code = await generateRandomString(48);
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
