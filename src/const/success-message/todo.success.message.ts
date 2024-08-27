import { HttpStatus } from '@nestjs/common';

export const todoSuccessMessageCode = {
	/*** success created*/
	SCDTTD0001: {
		httpCode: HttpStatus.CREATED,
		fabdCode: 'SCCSCS0001',
		message: 'Todo created.',
	},
	/*** success updated*/
	SCDTTD0002: {
		httpCode: HttpStatus.OK,
		fabdCode: 'SCCSCS0002',
		message: 'Todo updated.',
	},
	/*** success fetch data*/
	SCDTTD0003: {
		httpCode: HttpStatus.OK,
		fabdCode: 'SCCSCS0003',
		message: 'Todo fetched.',
	},
	/*** success deleted*/
	SCDTTD0004: {
		httpCode: HttpStatus.NO_CONTENT,
		fabdCode: 'SCCSCS0004',
		message: 'Todo deleted.',
	},
};
