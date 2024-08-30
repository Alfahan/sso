import FABDStructureCode from './fabd-structure.interface';

/**
 * Interface representing the structure of an API response.
 */
interface FABDApiResponse {
	/**
	 * A code representing the status or type of the response.
	 */
	code: string;

	/**
	 * The main data payload of the response. Can be of any type depending on the API endpoint.
	 */
	data: any;

	/**
	 * Optional metadata or additional information related to the response.
	 * This can include pagination info, filtering stats, or other relevant data.
	 */
	meta?: any;

	/**
	 * A message providing a description or additional context about the response.
	 */
	message: string;

	/**
	 * Optional errors encountered during the request processing.
	 * This field is typically used when the response indicates an error.
	 */
	errors?: any;

	/**
	 * An object representing the FABD structure code associated with the response.
	 * This provides additional context or categorization for the response data.
	 */
	fabdStructureCode: FABDStructureCode;
}

export default FABDApiResponse;
