import { HttpStatus } from '@nestjs/common';

export const todoErrorMessageCode = {
	/*** fail save todo*/
	ERPATD0001: {
		httpCode: HttpStatus.BAD_REQUEST,
		fabdCode: 'ERPATD0001',
		message: 'Failed to save Todo.',
	},
	/*** fail update todo item*/
	ERPATD0002: {
		httpCode: HttpStatus.BAD_REQUEST,
		fabdCode: 'ERPATD0002',
		message: 'Failed to update Todo.',
	},
	/*** todo exist item*/
	ERPATD0003: {
		httpCode: HttpStatus.CONFLICT,
		fabdCode: 'ERPATD0003',
		message: 'Todo is exists.',
	},
	/*** todo not found item*/
	ERPATD0004: {
		httpCode: HttpStatus.NOT_FOUND,
		fabdCode: 'ERPATD0004',
		message: 'Todo not found.',
	},
	/*** todo parent not found item*/
	ERPATD0005: {
		httpCode: HttpStatus.NOT_FOUND,
		fabdCode: 'ERPATD0005',
		message: 'Todo Parent not found.',
	},
};
