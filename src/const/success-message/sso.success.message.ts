import { HttpStatus } from '@nestjs/common';

export const ssoSuccessMessageCode = {
	/*** server is running */
	SCDTDT0000: {
		httpCode: HttpStatus.CREATED,
		fabdCode: 'SCCSCS0000',
		message: 'Service Running.',
	},
};
