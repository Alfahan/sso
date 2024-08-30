/**
 * Data Transfer Object (DTO) for user login in version 1.0.
 */
export class LoginV10 {
	/**
	 * Email address of the user trying to log in.
	 * This field is used to identify the user account.
	 */
	email: string;

	/**
	 * Phone number of the user trying to log in.
	 * This field can be used as an additional identifier or for verification.
	 */
	no_phone: string;

	/**
	 * Password of the user trying to log in.
	 * This field is used for authentication purposes.
	 */
	password: string;
}
