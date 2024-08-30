import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository'; // Importing the AuthRepository
import * as bcrypt from 'bcrypt'; // Importing bcrypt for hashing the password
import { Request } from 'express'; // Importing Request from express for type safety

@Injectable()
export class RegisterUseCase {
	// Injecting AuthRepository for interacting with the database
	private readonly repository: AuthRepository;

	// Constructor to initialize the repository
	constructor(repository: AuthRepository) {
		this.repository = repository;
	}

	// Method to handle the registration process
	async register(req: Request) {
		// Extracting email, no_phone, and password from the request body
		const { email, no_phone, password } = req.body;

		let find: any = null; // Variable to hold the result of database lookups

		// Checking if the email is provided and if it already exists in the database
		if (email !== undefined) {
			// Call repository to find if the email is already in use
			find = await this.repository.findByEmail('users', email);
			if (find) {
				// Throw an error if the email is already registered
				throw new BadRequestException('Email already in use');
			}
		}

		// Checking if the phone number is provided and if it already exists in the database
		if (no_phone !== undefined) {
			// Call repository to find if the phone number is already in use
			find = await this.repository.findByNoPhone('users', no_phone);
			if (find) {
				// Throw an error if the phone number is already registered
				throw new BadRequestException('Number Phone already in use');
			}
		}

		// Hashing the password using bcrypt with a salt factor of 10
		const hashedPassword = await bcrypt.hash(password, 10);

		// Registering the new user in the database
		// Status is set to 'active' by default for the new user
		const result = await this.repository.register('users', {
			email: email, // Email provided by the user
			no_phone: no_phone, // Phone number provided by the user
			password: hashedPassword, // Hashed password for security
			status: 'active', // Status of the new user
		});

		// Returning the result of the registration process
		return result;
	}
}
