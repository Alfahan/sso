import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { Request, Response } from 'express';
import { TOKEN_VALID } from '@app/const';
import { AuthHelper } from '../auth.helper';
import * as useragent from 'useragent';
import * as geoip from 'geoip-lite';
import { helperSplit } from '@app/libraries/helpers';

@Injectable()
export class OtpLoginPhoneUseCase {
	constructor(
		private readonly repository: AuthRepository,
		private readonly helper: AuthHelper,
	) {}

	async requestOtp(req: Request, res: Response): Promise<void> {
		const geo = geoip.lookup(req.ip);
		const api_key_id = res.locals.api_key_id;
		const agent = useragent.parse(req.headers['user-agent']);

		const { phone } = req.body;

		if (!phone) {
			throw new BadRequestException('Phone is required');
		}
		const fullHeap = await helperSplit(phone, 'phone_text_heap');

		const user = await this.repository.findByPhoneNumber('users', fullHeap);

		if (!user) {
			throw new Error('User not found');
		}

		await this.helper.checkRateLimit(user.id);

		// Check for active OTP
		const lastOtp = await this.repository.findOtpByUserId(
			'mfa_infos',
			TOKEN_VALID,
			user.id,
		);
		const currentTime = new Date();

		if (lastOtp && lastOtp.expires_at > currentTime) {
			const timeDifference =
				(lastOtp.expires_at.getTime() - currentTime.getTime()) / 60000;
			await this.helper.incrementFailedAttempts(user.id);
			await this.helper.logAuthHistory(
				req,
				geo,
				agent,
				'LOGIN_FAILED',
				user.id,
			);
			throw new Error(
				`OTP already sent. Please wait ${Math.ceil(timeDifference)} minute(s) to request again.`,
			);
		}

		// Generate new OTP
		const otpCode = this.helper.generateOtpCode();
		const otpExpired = this.helper.addMinutesToDate(new Date(), 3);
		await this.repository.saveOtp('mfa_infos', {
			otp_code: otpCode,
			expires_at: otpExpired,
			user_id: user.id,
			status: TOKEN_VALID,
			api_key_id: api_key_id,
		});

		this.helper.sendOtpToUser(phone, otpCode);

		await this.helper.resetFailedAttempts(user.id);

		return null;
	}
}
