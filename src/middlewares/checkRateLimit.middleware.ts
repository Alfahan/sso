import { TooManyRequestsException } from '@app/common/api-response/interfaces/fabd-to-many-request';

// Define an interface for the attempt record
interface AttemptRecord {
	count: number; // Number of failed login attempts
	timestamp: Date; // Timestamp of the last failed attempt
}

// Store failed login attempts in a dictionary
const failedLoginAttempts: { [user_id: string]: AttemptRecord } = {};

/**
 * Method to check the rate limit based on failed login attempts.
 * Throws an exception if the rate limit is exceeded.
 * @param user_id - The ID of the user to check.
 * @throws TooManyRequestsException if the rate limit is exceeded.
 */
export function checkRateLimit(user_id: string): void {
	const attempt = failedLoginAttempts[user_id];

	// If there are previous failed login attempts for this user
	if (attempt) {
		// Calculate the time since the last attempt in seconds
		const timeSinceLastAttempt =
			(Date.now() - attempt.timestamp.getTime()) / 1000;

		// If there are 5 or more failed attempts within the last 15 minutes, block further attempts
		if (attempt.count >= 5 && timeSinceLastAttempt < 15 * 60) {
			throw new TooManyRequestsException(
				'Too many login attempts. Try again later.',
			); // Throw an exception for too many requests
		} else if (timeSinceLastAttempt >= 15 * 60) {
			// Reset the failed attempt counter if the 15-minute cooldown has passed
			resetFailedAttempts(user_id);
		}
	}
}

/**
 * Method to record a failed login attempt for a user.
 * Updates the count and timestamp of failed attempts.
 * @param user_id - The ID of the user to record the failed attempt.
 */
export function incrementFailedAttempts(user_id: string): void {
	const attempt = failedLoginAttempts[user_id] || {
		count: 1, // Initialize the count to 1 if no previous record exists
		timestamp: new Date(), // Set the current timestamp
	};

	// Increment the failed attempt count and update the timestamp
	failedLoginAttempts[user_id] = {
		count: attempt.count + 1,
		timestamp: new Date(),
	};
}

/**
 * Method to reset failed login attempts for a user.
 * Removes the user's record from the failed attempts dictionary.
 * @param user_id - The ID of the user to reset the failed attempts.
 */
export function resetFailedAttempts(user_id: string): void {
	delete failedLoginAttempts[user_id]; // Remove the user's record from the dictionary
}
