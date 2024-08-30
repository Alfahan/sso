/**
 * Interface representing the structure of a FABD (Feature Application Business Domain) code.
 */
interface FABDStructureCode {
	/**
	 * HTTP status code associated with the response.
	 * Represents the standard HTTP response status code.
	 */
	httpCode: number;

	/**
	 * A specific FABD code that provides additional context or categorization for the response.
	 * This code can be used to identify different types of responses or statuses within the application.
	 */
	fabdCode: string;

	/**
	 * A descriptive message providing context or explanation related to the FABD code.
	 * This message helps in understanding the meaning or reason behind the FABD code.
	 */
	message: string;
}

export default FABDStructureCode;
