import { Response } from 'express';
import FABDApiResponse from './interfaces/fabd-response.interface';
import FABDStructureCode from './interfaces/fabd-structure.interface';
import FABDMetaResponse from './interfaces/fabd-meta.interface';

/**
 * Class representing a standard API response format.
 * @template T - Type of the data being sent in the response.
 */
export class ApiResponse<T> {
	status: boolean; // Indicates if the response is successful (true for 2xx status codes).
	code: string; // Business or API-specific code related to the response.
	data: T; // The actual data being sent in the response.
	errors?: any; // Optional field for including error details.
	meta?: any; // Optional metadata for additional context.
	message: string; // Message providing details about the response.

	/**
	 * Creates an instance of ApiResponse.
	 * @param params - The parameters for constructing the API response.
	 */
	constructor(params: FABDApiResponse) {
		const statusCode = params.fabdStructureCode.httpCode;
		this.status = /^2\d{2}$/.test(statusCode.toString()); // Set status to true for 2xx responses.
		this.code = params.fabdStructureCode.fabdCode;
		this.data = params.data;
		this.meta = params.meta;
		this.message = params.fabdStructureCode.message || ''; // Use provided message or default to empty string.
		this.errors = params.errors;
	}

	/**
	 * Static method to send a successful response.
	 * @param response - The Express response object.
	 * @param data - The data to send in the response.
	 * @param fabdStructureCode - The structure code including HTTP status and other info.
	 * @returns The Express response object with the success response.
	 */
	static success<T>(
		response: Response,
		data: T,
		fabdStructureCode: FABDStructureCode,
	): Response {
		return response.status(fabdStructureCode.httpCode).send(
			new ApiResponse<null>({
				data,
				fabdStructureCode,
			} as FABDApiResponse),
		);
	}

	/**
	 * Static method to send a failure response.
	 * @param response - The Express response object.
	 * @param data - The data to send in the response.
	 * @param fabdStructureCode - The structure code including HTTP status and other info.
	 * @param errors - Optional errors to include in the response.
	 * @returns The Express response object with the failure response.
	 */
	static fail<T>(
		response: Response,
		data: T,
		fabdStructureCode: FABDStructureCode,
		errors?: any,
	): Response {
		return response.status(fabdStructureCode.httpCode).send(
			new ApiResponse<null>({
				data,
				fabdStructureCode,
				errors,
			} as FABDApiResponse),
		);
	}

	/**
	 * Static method to send a response with paginated data.
	 * @param response - The Express response object.
	 * @param data - The data to send in the response.
	 * @param meta - Metadata for pagination details.
	 * @param fabdStructureCode - The structure code including HTTP status and other info.
	 * @returns The Express response object with the paginated data response.
	 */
	static dataPagination<T>(
		response: Response,
		data: T,
		meta: FABDMetaResponse,
		fabdStructureCode: FABDStructureCode,
	): Response {
		return response.status(fabdStructureCode.httpCode).send(
			new ApiResponse<null>({
				data,
				meta,
				fabdStructureCode,
			} as FABDApiResponse),
		);
	}
}

/**
 * Class representing a paginated response.
 * @template T - Type of the items in the paginated data.
 */
export class Pagination<T> {
	constructor(
		public readonly items: T[], // Array of items in the current page.
		public readonly meta: FABDMetaResponse, // Metadata including pagination details.
	) {}
}
