import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import CryptoTs from 'pii-agent-ts';

@Injectable()
export class RefreshTokenUseCase {
	constructor(
		private readonly repository: AuthRepository,
		private readonly jwtService: JwtService,
	) {}

	/**
	 * Handles the process of refreshing an authentication token.
	 *
	 * This method performs several steps:
	 * 1. Verifies the provided refresh token.
	 * 2. Decrypts the user session ID from the token payload.
	 * 3. Checks if a session with the decrypted user session ID exists in the database.
	 * 4. Encrypts the session ID and generates a new access token and refresh token.
	 * 5. Updates the user session in the database with the new tokens.
	 * 6. Returns the new access and refresh tokens.
	 *
	 * @param req - The Express request object containing the refresh token in the request parameters.
	 * @returns Promise<{ access_token: string; refresh_token: string }> - Returns an object containing the new access and refresh tokens.
	 * @throws Error - Throws an error if the token verification fails, if the session is not found, or if updating the session fails.
	 *
	 * @example
	 * const { access_token, refresh_token } = await refreshTokenUseCase.refreshToken({
	 *   params: { refresh_token: 'some-refresh-token' }
	 * });
	 *
	 * @summary Steps:
	 * - Extract the refresh token from the request parameters.
	 * - Verify the refresh token and extract the session ID from it.
	 * - Decrypt the session ID to retrieve the actual session ID.
	 * - Check if the session exists in the database.
	 * - Encrypt the session ID and generate new access and refresh tokens.
	 * - Update the session in the database with the new tokens.
	 * - Return the new tokens to the client.
	 */
	async refreshToken(req: Request) {
		const { refresh_token } = req.params;

		// Verify the refresh token without checking expiration
		const jwt = this.jwtService.verify(refresh_token, {
			ignoreExpiration: true,
		});

		// Decrypt the user session ID from the JWT payload
		const user_session_id = CryptoTs.decryptWithAes(
			'AES_256_CBC',
			Buffer.from(jwt.sub),
		);

		// Check if a session with the decrypted ID exists
		const existingSession = await this.repository.checkSessions(
			'user_sessions',
			user_session_id,
		);

		// Encrypt the session ID for the new access token payload
		const encryptUuid = CryptoTs.encryptWithAes(
			'AES_256_CBC',
			existingSession.id,
		);

		// Generate a new access token
		const payloadToken = { sub: encryptUuid.Value.toString() };
		const newToken = this.jwtService.sign(payloadToken, {
			expiresIn: '2h', // Set token expiration time to 2 hours
		});

		// Encrypt the session ID for the new refresh token payload
		const encryptId = CryptoTs.encryptWithAes(
			'AES_256_CBC',
			existingSession.id,
		);
		const payloadRefToken = { sub: encryptId.Value.toString() };
		const newRefreshToken = this.jwtService.sign(payloadRefToken);

		// Update the session in the database with the new tokens
		await this.repository.updateToken(
			'user_sessions',
			{
				token: newToken,
				refresh_token: newRefreshToken,
			},
			existingSession.id,
		);

		// Return the new access and refresh tokens
		return {
			access_token: newToken,
			refresh_token: newRefreshToken,
		};
	}
}
