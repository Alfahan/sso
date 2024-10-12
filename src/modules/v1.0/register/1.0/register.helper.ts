import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class RegisterHelper {
	constructor() {}

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
}
