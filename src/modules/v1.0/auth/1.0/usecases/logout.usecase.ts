import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository'; // Repository for database access related to authentication
import { Request } from 'express'; // Express request type for handling HTTP requests
import { JwtService } from '@nestjs/jwt'; // Service for handling JWT token verification and invalidation
import { TOKEN_INVALID } from '@app/const'; // Constant for marking tokens as invalid

/**
 * @service LogoutUseCase
 * @description
 * This service handles user logout, including invalidating the JWT token and logging the logout activity.
 */
@Injectable()
export class LogoutUseCase {
	constructor(
		private readonly repository: AuthRepository, // Injecting AuthRepository for interacting with the authentication data in the database
		private readonly jwtService: JwtService, // Injecting JwtService for handling JWT token verification and invalidation
	) {}

	/**
	 * @method logout
	 * @description
	 * Handles user logout by invalidating the user's JWT token and logging the logout activity.
	 *
	 * @param {Request} req - The Express request object containing logout details.
	 * @returns {Promise<void>} - Returns a void promise indicating successful logout.
	 * @throws {UnauthorizedException} - Throws an exception if the token is invalid or other errors occur.
	 *
	 * @example
	 * await logoutUseCase.logout({
	 *   headers: { authorization: 'Bearer <token>' },
	 *   ip: '192.168.1.1',
	 *   headers: { 'user-agent': 'Mozilla/5.0' },
	 * });
	 */
	async logout(req: Request): Promise<void> {
		// Retrieve the Authorization header from the request
		const authHeader = req.headers.authorization;

		// If the authorization header is missing or does not contain a Bearer token, throw an exception
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new UnauthorizedException('No token provided');
		}

		// Extract the JWT token from the Authorization header
		const token = authHeader.split(' ')[1];

		try {
			// Verify the JWT token to extract the payload (which contains the user ID)
			const payload = this.jwtService.verify(token);
			const userId = payload.sub; // Extract the user ID (subject) from the token payload

			// Invalidate the token by updating its status to TOKEN_INVALID in the database
			await this.repository.updateTokenStatus(
				'user_tokens',
				token,
				TOKEN_INVALID, // Mark the token as disabled (logged out)
			);

			// Log the logout activity with the user's IP and user-agent details
			await this.repository.saveActivityLogs(
				userId,
				req.ip,
				'LOGOUT',
				req.headers['user-agent'],
			);
		} catch (error) {
			// Rethrow any errors encountered during the token verification or database operations
			throw error;
		}
	}
}
