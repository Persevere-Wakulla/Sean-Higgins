import { getTickers } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import fs from 'fs';

export const load = (async ({ locals }) => {
	const loggedIn = await locals.auth();
	if (loggedIn) {
		const tickers = await getTickers();

		const WATCHLIST_UPDATED = fs.readFileSync(
			'./src/routes/api/graphql/subscriptions/WATCHLIST_UPDATED.graphql',
			'utf-8'
		);
		return { tickers, WATCHLIST_UPDATED };
	}else{
		redirect(308, '/');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	ticker: async ({ params, request }) => {
		const form = await request.formData();
		const ticker = form.get('ticker') as string;
		redirect(308, `/home/${ticker}`);
	}
};
