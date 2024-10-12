import { ForbiddenException } from '@nestjs/common';
import CryptoTs from 'pii-agent-ts';

/**
 * generateRandomString
 * @author telkomdev-alfahan
 * @date 2024-10-06
 * @param { number } length
 * @returns { Promise<string> }
 */
export async function generateRandomString(length: number): Promise<string> {
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_';
	let result = '';

	// Loop through and randomly select a character from the characters string
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters[randomIndex];
	}

	// Return the generated random string
	return result;
}

export async function helperSplit(
	value: string,
	table: string,
): Promise<string> {
	const splitValue = CryptoTs.split(value);
	const userHeap = await CryptoTs.searchContentFullText(table, {
		contents: splitValue,
	});
	const result = userHeap.map((e) => e.hash).join('');

	return result;
}

/**
 * validateDomain
 * @author telkomdev-alfahan
 * @date 2024-10-06
 * @param { string } email
 * @returns { void }
 */
export async function validateDomain(email: string): Promise<void> {
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
