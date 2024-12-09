import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { registerSubscriber } from '$lib/server/database';
import type { Register } from '$lib/types/register';
import fs from 'fs';
import { mutation } from 'svelte-apollo-wrappers';
import gql from 'graphql-tag';

export const load: PageServerLoad = async () => {
	const REGISTER = fs.readFileSync('./src/routes/api/graphql/mutations/REGISTER.graphql', 'utf-8');
	return {
		REGISTER
	};
};

export const actions: Actions = {
	register: async ({ request, cookies, fetch }) => {
		const errors = {
			username: false,
			password: false,
			email: false,
			confirmPassword: false
		};
		const REGISTER = fs.readFileSync(
			'./src/routes/api/graphql/mutations/REGISTER.graphql',
			'utf-8'
		);
		const fd = await request.formData();
		const registration = {
			password: fd.get('password'),
			confirmPassword: fd.get('confirmPassword'),
			email: fd.get('email'),
			username: fd.get('userName')
		};
		if (registration.password && registration.confirmPassword) {
			if (registration.password !== registration.confirmPassword)
				return fail(400, {
					hasErrors: true,
					registration,
					errors: { ...errors, confirmPassword: true },
					msg: 'Passwords do not match'
				});
		} else {
			if (!registration.password) errors.password = true;
			if (!registration.confirmPassword) errors.confirmPassword = true;

			return fail(400, {
				hasErrors: true,
				registration,
				errors,
				msg: 'Missing password'
			});
		}
		return {
			hasErrors: false,
      errors,
			REGISTER,
      registration
		};
	}
};
