import { ssoErrorMessageCode } from './sso.error.message';
import { todoErrorMessageCode } from './todo.error.message';

/**
 * Aggregates all error message codes from different domains.
 * This object combines error codes related to Todo operations
 * and Single Sign-On (SSO) operations into a single object.
 */
export const errorCode = {
	...todoErrorMessageCode, // Spread operator to include all error codes from todoErrorMessageCode.
	...ssoErrorMessageCode, // Spread operator to include all error codes from ssoErrorMessageCode.
};
