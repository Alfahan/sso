import { BadRequestException } from '@nestjs/common';

/**
 * validateGenarate
 * @author telkomdev-alfahan
 * @date 2024-10-06
 * @param { any } body
 * @returns { void }
 */
export function validateGenerate(body: any): void {
	const { name, ip_origin, domain } = body;

	if (!name || typeof name !== 'string') {
		throw new BadRequestException(
			'Invalid input: "name" is required and must be a string.',
		);
	}

	if (!ip_origin || !isValidIP(ip_origin)) {
		throw new BadRequestException(
			'Invalid input: "ip_origin" must be a valid IP address.',
		);
	}

	if (!domain || !isValidDomain(domain)) {
		throw new BadRequestException(
			'Invalid input: "domain" must be a valid domain name.',
		);
	}
}

/**
 * validateRevoke
 * @author telkomdev-alfahan
 * @date 2024-10-06
 * @param { any } body
 * @returns { void }
 */
export function validateRotateAndRevoke(body: any): void {
	const { name } = body;

	if (!name || typeof name !== 'string') {
		throw new BadRequestException(
			'Invalid input: "name" is required and must be a string.',
		);
	}
}

// Helper function to validate IP address
function isValidIP(ip: string): boolean {
	const ipv4Pattern =
		/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	const ipv6Pattern = /^[0-9a-fA-F:]+$/;
	return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
}

// Helper function to validate domain
function isValidDomain(domain: string): boolean {
	const domainPattern = /^[a-zA-Z0-9-]{1,63}\.[a-zA-Z]{2,}$/;
	return domainPattern.test(domain);
}
