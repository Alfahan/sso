/**
 * generateRandomString
 * @author telkomdev-alfahan
 * @date 2024-10-06
 * @param { number } length
 * @returns { Promise<string> }
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
