import { ssoErrorMessageCode } from './sso.error.message';
import { todoErrorMessageCode } from './todo.error.message';

export const errorCode = {
	...todoErrorMessageCode,
	...ssoErrorMessageCode,
};
