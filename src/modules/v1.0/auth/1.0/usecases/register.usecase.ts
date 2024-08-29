import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';

@Injectable()
export class RegisterUseCase {
	private readonly repository: AuthRepository;

	constructor(repository: AuthRepository) {
		this.repository = repository;
	}

	async register(req: Request) {
		const { email, no_phone, password } = req.body;

		let find: any = null;

		if (email !== undefined) {
			find = await this.repository.findByEmail('users', email);
			if (find) {
				throw new BadRequestException('Email already in use');
			}
		}

		if (no_phone !== undefined) {
			find = await this.repository.findByNoPhone('users', no_phone);
			if (find) {
				throw new BadRequestException('Number Phone already in use');
			}
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const result = await this.repository.register('users', {
			email: email,
			no_phone: no_phone,
			password: hashedPassword,
			status: 'active',
		});

		return result;
	}
}
