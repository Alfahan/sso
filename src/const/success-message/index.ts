import { ssoSuccessMessageCode } from './sso.success.message';
import { todoSuccessMessageCode } from './todo.success.message';

/**
 * Aggregates all success message codes from different domains.
 * This object combines success codes related to Todo operations
 * and Single Sign-On (SSO) operations into a single object.
 */
export const successCode = {
	...ssoSuccessMessageCode, // Spread operator to include all success codes from ssoSuccessMessageCode.
	...todoSuccessMessageCode, // Spread operator to include all success codes from todoSuccessMessageCode.
};
