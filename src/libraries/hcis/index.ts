import { EAI_BASE_URL, EAI_CLIENT_ID, EAI_CLIENT_SECRET } from '@app/const';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export default class HCIS {
	private token: string;

	/**
	 * Get Token
	 * @returns
	 */
	async generateToken() {
		try {
			const body = {
				grant_type: 'client_credentials',
				client_id: EAI_CLIENT_ID,
				client_secret: EAI_CLIENT_SECRET,
			};

			const response: any = await lastValueFrom(
				new HttpService()
					.post(
						`${EAI_BASE_URL}/invoke/pub.apigateway.oauth2/getAccessToken`,
						body,
					)
					.pipe(map((res) => res.data)),
			);

			if (response?.access_token) {
				// set token
				this.token = response.access_token;
				return response.access_token;
			} else {
				return null;
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error('Error get token: ', e);
			return null;
		}
	}

	/**
	 * Get Profile Info
	 * @param nik
	 * @param token
	 * @returns
	 */
	async profileInfo(nik: string) {
		const token = this.token;

		if (!token) {
			return null;
		}

		try {
			const response: any = await lastValueFrom(
				new HttpService()
					.get(
						`${EAI_BASE_URL}/gateway/telkom-hcis-centra/1.0/apiCentra/profilsingkat/${nik}`,
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						},
					)
					.pipe(map((res) => res.data)),
			);

			const apiResponse = response?.apiCentraResponse;
			console.log('apiResponse profile info', apiResponse);

			if (apiResponse?.eaiBody?.success) {
				return apiResponse?.eaiBody?.data;
			} else {
				return null;
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error('Error get profile: ', e);
			return null;
		}
	}

	/**
	 * Get Contact Center
	 * @param nik
	 * @param token
	 * @returns
	 */
	async contactCenter(nik: string) {
		const token = this.token;

		if (!token) {
			return null;
		}

		try {
			const response: any = await lastValueFrom(
				new HttpService()
					.get(
						`${EAI_BASE_URL}/gateway/telkom-hcis-centra/1.0/apiCentra/profilcontactcenter/${nik}`,
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						},
					)
					.pipe(map((res) => res.data)),
			);

			const apiResponse = response?.apiCentraResponse;
			console.log('apiResponse contact center', apiResponse);

			if (apiResponse?.eaiBody?.success) {
				return apiResponse?.eaiBody?.data;
			} else {
				return null;
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error('Error get contact center	: ', e);
			return null;
		}
	}

	/**
	 * Validate User
	 * @param username
	 * @param password
	 * @returns
	 */
	async validateUser(username: string, password: string) {
		try {
			const token = await this.generateToken();

			const body = {
				username: username,
				password: password,
			};

			const response: any = await lastValueFrom(
				new HttpService()
					.post(
						`${EAI_BASE_URL}/gateway/telkom-auth/1.0/authValidate`,
						body,
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						},
					)
					.pipe(map((res) => res.data)),
			);

			if (response?.status === 'success') {
				return true;
			} else {
				return false;
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error('Error get profile: ', e);
			return null;
		}
	}
}
