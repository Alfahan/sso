/**
 * Base Data Transfer Object (DTO) class for common metadata fields.
 * This class can be extended by other DTO classes to include common fields
 * related to creation and update information.
 */
export class BaseDTO {
	/**
	 * The identifier of the user who created the record.
	 * This field stores the user ID or username of the creator.
	 */
	created_by: string;

	/**
	 * The name of the user who created the record.
	 * This field stores the full name or username of the creator.
	 */
	created_name: string;

	/**
	 * The identifier of the user who last updated the record.
	 * This field stores the user ID or username of the updater.
	 */
	updated_by: string;

	/**
	 * The name of the user who last updated the record.
	 * This field stores the full name or username of the updater.
	 */
	updated_name: string;
}
