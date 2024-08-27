// src/common/api-response/index.ts
import { Response } from 'express';
import FABDApiResponse from './interfaces/fabd-response.interface';
import FABDStructureCode from './interfaces/fabd-structure.interface';
import FABDMetaResponse from './interfaces/fabd-meta.interface';

export class ApiResponse<T> {
	status: boolean;
	code: string;
	data: T;
	errors?: any;
	meta?: any;
	message: string;

	constructor(params: FABDApiResponse) {
		const statusCode = params.fabdStructureCode.httpCode;
		this.status = /^2\d{2}$/.test(statusCode.toString());
		this.code = params.fabdStructureCode.fabdCode;
		this.data = params.data;
		this.meta = params.meta;
		if (params.fabdStructureCode.message) {
			this.message = params.fabdStructureCode.message;
		} else {
			this.message = this.message;
		}
		this.errors = params.errors;
	}

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

export class Pagination<T> {
	constructor(
		public readonly items: T[],
		public readonly meta: FABDMetaResponse,
	) {}
}
