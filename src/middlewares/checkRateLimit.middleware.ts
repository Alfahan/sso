import { TooManyRequestsException } from '@app/common/api-response/interfaces/fabd-to-many-request';
import { AuthRepository } from '@app/modules/v1.0/auth/repositories/auth.repository';

/**
 * Method to check the rate limit based on failed login attempts.
 * Throws an exception if the rate limit is exceeded.
 * @param user_id - The ID of the user to check.
 * @throws TooManyRequestsException if the rate limit is exceeded.
 */
export async function checkRateLimit(
	user_id: string,
	authRepository: AuthRepository,
): Promise<void> {
	const attempt = await authRepository.findFailedLoginAttempts(
		'users',
		user_id,
	);

	// If there are previous failed login attempts for this user
	if (attempt.failed_login_attempts > 0) {
		// Ensure the updated_at value is properly handled as a Date object
		const lastAttemptTime = new Date(attempt.updated_at).getTime();

		// Calculate the time since the last attempt in seconds
		const timeSinceLastAttempt = (Date.now() - lastAttemptTime) / 1000;

		// If there are 5 or more failed attempts within the last 15 minutes, block further attempts
		if (
			attempt.failed_login_attempts >= 5 &&
			timeSinceLastAttempt < 15 * 60
		) {
			throw new TooManyRequestsException(
				'Too many login attempts. Try again later.',
			); // Throw an exception for too many requests
		} else if (timeSinceLastAttempt >= 15 * 60) {
			// Reset the failed attempt counter if the 15-minute cooldown has passed
			await resetFailedAttempts(user_id, authRepository);
		}
	}
}

/**
 * Method to record a failed login attempt for a user.
 * Updates the count and timestamp of failed attempts.
 * @param user_id - The ID of the user to record the failed attempt.
 */
export async function incrementFailedAttempts(
	user_id: string,
	authRepository: AuthRepository,
): Promise<void> {
	const attempt = await authRepository.findFailedLoginAttempts(
		'users',
		user_id,
	);

	attempt.failed_login_attempts += 1;
	attempt.updated_at = new Date();

	await authRepository.addFailedLoginAttempts(
		'users',
		{
			failed_login_attempts: attempt.failed_login_attempts,
			updated_at: attempt.updated_at,
		},
		user_id,
	);
}

/**
 * Method to reset failed login attempts for a user.
 * Removes the user's record from the failed attempts dictionary.
 * @param user_id - The ID of the user to reset the failed attempts.
 */
export async function resetFailedAttempts(
	user_id: string,
	authRepository: AuthRepository,
): Promise<void> {
	const attempt = await authRepository.findFailedLoginAttempts(
		'users',
		user_id,
	);

	attempt.failed_login_attempts = 0;
	attempt.updated_at = new Date();

	await authRepository.addFailedLoginAttempts(
		'users',
		{
			failed_login_attempts: attempt.failed_login_attempts,
			updated_at: attempt.updated_at,
		},
		user_id,
	);
}
