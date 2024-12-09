// import { comparePassword, saltAndHashPassword } from '$lib/utils/password';

import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { handle as authHandle } from '$lib/server/auth';
import { connectDB } from '$lib/server/database';

let isConnected = false;

async function dbConnection({ event, resolve }: { event: any; resolve: any }) {
	if (!isConnected) {
		await connectDB();
		isConnected = true;
	}
	return resolve(event);
}

export const handle: Handle = sequence(dbConnection, authHandle);
