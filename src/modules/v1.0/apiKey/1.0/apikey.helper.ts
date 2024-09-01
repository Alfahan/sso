/**
 * Generates a random string of a specified length using uppercase, lowercase letters, numbers, and special characters.
 *
 * @param {number} length - The length of the random string to be generated.
 * @returns {Promise<string>} - A promise that resolves to the generated random string.
 *
 * @example
 * const randomString = await generateRandomString(16);
 * console.log(randomString); // Output: random string of 16 characters
 */
export async function generateRandomString(length: number): Promise<string> {
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_';
	let result = '';

	// Loop through and randomly select a character from the characters string
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters[randomIndex];
	}

	// Return the generated random string
	return result;
}
