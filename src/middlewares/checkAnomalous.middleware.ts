import { AuthRepository } from '@app/modules/v1.0/auth/repositories/auth.repository';
import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as geoip from 'geoip-lite'; // Library to perform IP geolocation lookups
import * as useragent from 'useragent'; // Library to parse user-agent strings

// Define an interface for the device information
interface DeviceInfo {
	os: string; // Operating System of the device
	browser: string; // Browser used in the login attempt
	device: string; // Type of device (e.g., mobile, desktop)
}

/**
 * Method to check for anomalous login behavior based on geolocation and device information.
 * @param req - The HTTP request object containing login attempt details.
 * @param user_id - The ID of the user to check for anomalous behavior.
 * @param authRepository - The instance of AuthRepository used for fetching login logs.
 * @throws UnauthorizedException if anomalous login behavior is detected.
 */
export async function checkAnomalous(
	req: Request,
	user_id: string,
	authRepository: AuthRepository,
): Promise<void> {
	// Look up the current location based on the user's IP address
	const currentLocation = geoip.lookup(req.ip)?.country || 'Unknown';
	const agent = useragent.parse(req.headers['user-agent']); // Parse the user-agent header to get device and browser information

	// Construct an object representing the current device, OS, and browser
	const currentDevice: DeviceInfo = {
		os: agent.os.toString(), // Get the operating system
		browser: agent.toAgent(), // Get the browser information
		device: agent.device.toString() || 'Unknown Device', // Get the device type
	};

	// Retrieve the last login location and device details from the database
	const lastLogin = await authRepository.getLastLoginLocation(
		'auth_histories', // The table from which to fetch the last login details
		user_id, // The user ID for whom to fetch the details,
	);

	// Check if the current login's country differs from the last login's country
	if (lastLogin && lastLogin.country !== currentLocation) {
		throw new UnauthorizedException(
			`Anomalous login detected: Location change`, // Throw exception if location is different
		);
	}

	// Check if the current login's IP address differs from the last login's IP address
	if (lastLogin && lastLogin.ip_origin !== req.ip) {
		throw new UnauthorizedException(
			`Anomalous login detected: IP address change`, // Throw exception if IP address is different
		);
	}

	// Check if the current login's device, OS, or browser differs from the last login's details
	if (
		lastLogin &&
		(lastLogin.os_type !== currentDevice.os ||
			lastLogin.browser !== currentDevice.browser ||
			lastLogin.device !== currentDevice.device)
	) {
		throw new UnauthorizedException(
			`Anomalous login detected: Device change`, // Throw exception if device details are different
		);
	}
}
