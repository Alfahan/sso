import { HttpStatus } from '@nestjs/common';

export const ssoErrorMessageCode = {
	/*** Unauthorized */
	ERDTTD0001: {
		httpCode: HttpStatus.UNAUTHORIZED,
		fabdCode: 'ERDTTD0001',
		message: 'Unauthorized',
	},
};
