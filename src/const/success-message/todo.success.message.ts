import { HttpStatus } from '@nestjs/common';

/**
 * Success message codes related to Todo operations.
 * These codes represent various successful outcomes for Todo-related processes.
 */
export const todoSuccessMessageCode = {
	/*** Success creating a new Todo */
	SCDTTD0001: {
		httpCode: HttpStatus.CREATED, // HTTP status code indicating that a new resource has been successfully created.
		fabdCode: 'SCCSCS0001', // Unique code representing the success scenario for Todo creation.
		message: 'Todo created.', // Description of the success scenario.
	},
	/*** Success updating an existing Todo */
	SCDTTD0002: {
		httpCode: HttpStatus.OK, // HTTP status code indicating that the request was successful and the resource has been updated.
		fabdCode: 'SCCSCS0002', // Unique code representing the success scenario for Todo update.
		message: 'Todo updated.', // Description of the success scenario.
	},
	/*** Success fetching a Todo */
	SCDTTD0003: {
		httpCode: HttpStatus.OK, // HTTP status code indicating that the request was successful and the resource has been retrieved.
		fabdCode: 'SCCSCS0003', // Unique code representing the success scenario for Todo retrieval.
		message: 'Todo fetched.', // Description of the success scenario.
	},
	/*** Success deleting a Todo */
	SCDTTD0004: {
		httpCode: HttpStatus.NO_CONTENT, // HTTP status code indicating that the request was successful and the resource has been deleted.
		fabdCode: 'SCCSCS0004', // Unique code representing the success scenario for Todo deletion.
		message: 'Todo deleted.', // Description of the success scenario.
	},
};
