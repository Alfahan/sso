/**
 * Interface representing metadata information for paginated API responses.
 */
interface FABDMetaResponse {
	/**
	 * The number of items displayed per page (limit).
	 */
	per_page: number;

	/**
	 * The current page number in the pagination.
	 */
	current_page: number;

	/**
	 * The total number of pages available.
	 */
	total_page: number;

	/**
	 * The total number of items after applying filters.
	 */
	total_filtered: number;

	/**
	 * The total number of items before applying any filters.
	 */
	total: number;
}

export default FABDMetaResponse;
