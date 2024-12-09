import fs from 'fs';
import { addToMonitoring, getHistories, getTickers } from '$lib/server/database';
import type { TickerHistory } from '$lib/types/tickerHistory';
import type { Actions, PageServerLoad } from './$types';
import dayjs from 'dayjs';
import { redirect } from '@sveltejs/kit';
import type { Ticker } from '$lib/types/ticker';

export const load = (async ({ params, cookies, locals }) => {
	const loggedIn = await locals.auth();
	if (loggedIn) {
		const symbol = params.symbol;
		const res = await getHistories(symbol);
		const tickers: Ticker[] = await getTickers();

		const ADD_WATCHLIST = fs.readFileSync(
			'./src/routes/api/graphql/ADD_WATCHLIST.graphql',
			'utf-8'
		);
		const STOCK_ACTION = fs.readFileSync(
			'./src/routes/api/graphql/mutations/STOCK_ACTION.graphql',
			'utf-8'
		);
		const GET_SUBSCRIBER_TICKER_DATA = fs.readFileSync(
			'./src/routes/api/graphql/queries/GET_SUBSCRIBER_TICKER_DATA.graphql',
			'utf-8'
		);
		if (res.tickerData) {
			res.tickerData.tickerHistory = res.tickerData.tickerHistory.map((x: TickerHistory) => {
				const close =
					typeof x.close !== 'number' ? Number(x.close.toString().replaceAll(',', '')) : x.close;
				const open = typeof x.open !== 'number' ? x.open.toString().replaceAll(',', '') : x.open;
				const high = typeof x.high !== 'number' ? x.high.toString().replaceAll(',', '') : x.high;
				const low = typeof x.low !== 'number' ? x.low.toString().replaceAll(',', '') : x.low;
				return {
					...x,
					date: dayjs(x.date).startOf('day').toDate(),
					high: high === 0 ? Number(x.close) : Number(high),
					low: low === 0 ? x.previousClose : Number(low),
					open: open === 0 ? Number(x.previousClose) : Number(open),
					close
				};
			});
			return {
				tickerHistoryFull: res.tickerData.tickerHistory,
				tickerHistory: res.tickerData.tickerHistory.sort((a: TickerHistory, b: TickerHistory) =>
					a.date > b.date ? 1 : -1
				),
				ticker: res.tickerData,
				tickers,
				monitoring: res.monitoring,
				ADD_WATCHLIST,
				STOCK_ACTION,
				GET_SUBSCRIBER_TICKER_DATA
			};
		}
		return { msg: 'No valid ticker data' };
	} else {
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
