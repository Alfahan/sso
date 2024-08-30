import { HttpStatus } from '@nestjs/common';

/**
 * Error message codes for Todo-related issues.
 */
export const todoErrorMessageCode = {
	/*** Error when saving a Todo item */
	ERPATD0001: {
		httpCode: HttpStatus.BAD_REQUEST, // HTTP status code for bad request (400 Bad Request).
		fabdCode: 'ERPATD0001', // Unique error code for identifying failed save operations.
		message: 'Failed to save Todo.', // Message indicating that saving the Todo item failed.
	},

	/*** Error when updating a Todo item */
	ERPATD0002: {
		httpCode: HttpStatus.BAD_REQUEST, // HTTP status code for bad request (400 Bad Request).
		fabdCode: 'ERPATD0002', // Unique error code for identifying failed update operations.
		message: 'Failed to update Todo.', // Message indicating that updating the Todo item failed.
	},

	/*** Error when a Todo item already exists */
	ERPATD0003: {
		httpCode: HttpStatus.CONFLICT, // HTTP status code for conflict (409 Conflict).
		fabdCode: 'ERPATD0003', // Unique error code for identifying existing Todo item conflicts.
		message: 'Todo is exists.', // Message indicating that the Todo item already exists.
	},

	/*** Error when a Todo item is not found */
	ERPATD0004: {
		httpCode: HttpStatus.NOT_FOUND, // HTTP status code for not found (404 Not Found).
		fabdCode: 'ERPATD0004', // Unique error code for identifying Todo item not found errors.
		message: 'Todo not found.', // Message indicating that the requested Todo item was not found.
	},

	/*** Error when a Todo parent item is not found */
	ERPATD0005: {
		httpCode: HttpStatus.NOT_FOUND, // HTTP status code for not found (404 Not Found).
		fabdCode: 'ERPATD0005', // Unique error code for identifying Todo parent not found errors.
		message: 'Todo Parent not found.', // Message indicating that the parent Todo item was not found.
	},
};
