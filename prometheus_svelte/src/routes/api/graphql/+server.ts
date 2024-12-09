import { ApolloServer } from '@apollo/server';
import { startServerAndCreateSvelteKitHandler } from 'apollo-server-integration-svelte';
import type { RequestHandler } from 'apollo-server-integration-svelte';
import { gql } from 'graphql-tag';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import getHistoryModel from '$lib/server/schema/history';
import type { TickerHistory } from '$lib/types/tickerHistory';
import { pubsub } from './pubsub';
import type { PubSub } from 'graphql-subscriptions';
import * as schedule from 'node-schedule';
import getTickersModel from '$lib/server/schema/tickers';
import getSubscriberModel from '$lib/server/schema/subscriber';
import getSubscriberExecutedTradeModel from '$lib/server/schema/subscriberExecutedTrade';
import getSubscriberTradeOrderModel from '$lib/server/schema/subscriberTradeOrder';
import { executeLimitTrades, getPrevDayCloses } from '$lib/server/database';

schedule.scheduleJob('20 4 * * *', async () => {
	await getPrevDayCloses();
});

schedule.scheduleJob('30 9 * * *', async () => {
	await executeLimitTrades()
})

const resolvers = {
	Subscription: {
		watchlistUpdated: {
			subscribe: () => pubsub.asyncIterableIterator('ADD_WATCHLIST')
		}
	},
	Mutation: {
		register: async (_: any, variables: any) => {
			const subscriberModel = await getSubscriberModel();

			const existingSubEmail = await subscriberModel.findOne({
				email: variables.registration.email
			});
			if (existingSubEmail) {
				return {
					error: 'Existing email - try logging in',
					msg: 'Failed',
					field: 'Email'
				};
			}
			const existingSubUsername = await subscriberModel.findOne({
				username: variables.registration.username
			});
			if (existingSubUsername) {
				return {
					error: 'Existing username - try another username or logging in',
					msg: 'Failed',
					field: 'Username'
				};
			}
			if (!variables.registration.password === variables.registration.confirmPassword) {
				return {
					error: 'Passwords do not match',
					msg: 'Failed',
					field: 'Password'
				};
			}
			const password = await bcrypt.hash(variables.registration.password, 10);
			const subscriber = await subscriberModel.create({
				...variables.registration,
				password,
				liquidCash: 25000,
				subscriberInfo: {},
				watching: [],
				stocksOwned: []
			});
			return {
				subscriber,
				password: variables.registration.password,
				msg: 'Success'
			};
		},
		stockAction: async (_: any, variables: any) => {
			try {
				const subscriberModel = await getSubscriberModel();
				const tickerModel = await getTickersModel();
				const ticker = await tickerModel.findOne({ symbol: variables.stockSale.symbol }).lean();
				const subscriber = await subscriberModel
					.findOne({ email: variables.stockSale.subscriber })
					.lean();
				const subscriberTradeOrderModel = await getSubscriberTradeOrderModel();
				const tradeOrderId = crypto.randomUUID();
				const { tradeType } = variables.stockSale;
				const newTradeOrder = await subscriberTradeOrderModel.create({
					...variables.stockSale,
					tradeOrderId,
					expired: false,
					executed: tradeType === 'Market' ? true : false,
					subscriber: subscriber._id,
					ticker: ticker._id,
					datePlaced: new Date()
				});
				if (tradeType === 'Market') {
					let isLiquidation = false;
					const tradeExecutedModel = await getSubscriberExecutedTradeModel();
					if (subscriber.stocksOwned.includes(ticker.symbol) && variables.stockSale.action === 'Sell') {
						const existing = await tradeExecutedModel
							.find({ symbol: ticker.symbol, subscriber: subscriber._id })
							.lean();
						const currentShares = existing.reduce(
							(acc:number, curr:any) => (acc += curr.action === 'Buy' ? curr.shares : -curr.shares),
							0
						);
						isLiquidation = currentShares - variables.stockSale.shares === 0;
					}

					const stocksOwned = subscriber.stocksOwned.includes(variables.stockSale.symbol)
						? [...subscriber.stocksOwned]
						: [...subscriber.stocksOwned, variables.stockSale.symbol];
					const updatedSubscriber = await subscriberModel.findOneAndUpdate(
						{ email: variables.stockSale.subscriber },
						{
							liquidCash: variables.stockSale.action === 'Buy' ?
								subscriber.liquidCash - (variables.stockSale.price * variables.stockSale.shares) :
								subscriber.liquidCash + (variables.stockSale.price * variables.stockSale.shares),
							stocksOwned
						}
					);
					const newTradeExecuted = await tradeExecutedModel.create({
						...variables.stockSale,
						subscriber: subscriber._id,
						ticker: ticker._id,
						dateExecuted: new Date(),
						isLiquidation
					});
					return {
						...variables.stockSale,
						...newTradeOrder,
						...newTradeExecuted
					};
				}
				return {
					...variables.stockSale,
					...newTradeOrder
				};
			} catch (err) {
				console.dir(err);
				return {
					...variables.stockSale
				};
			}
		},
		addWatchlist: async (x: any, variables: any, { pubsub }: { pubsub: PubSub }) => {
			const historyModel = await getHistoryModel();
			const tickersModel = await getTickersModel();
			const subscriberModel = await getSubscriberModel();
			const subscriber = await subscriberModel.findById(variables.watchTicker.subscriber);
			subscriber.watching.push(variables.watchTicker.symbol);
			await subscriber.save();
			subscriber.watching = await subscriber.watching.map(async (symbol: string) => {
				const ticker = await tickersModel.findOne({ symbol }).lean();
				const history = await historyModel.find({ symbol }).lean();
				const lastDay = history
					.sort((a: TickerHistory, b: TickerHistory) =>
						new Date(a.date) > new Date(b.date) ? 1 : -1
					)
					.at(-1);

				return { ...ticker, history: [{ ...lastDay }] };
			});
			pubsub.publish('ADD_WATCHLIST', subscriber);
			return {
				...subscriber,
				stocksWatched: subscriber.watching
			};
		}
	},
	Query: {
		getSubscriber: async (x: any, variables: any) => {
			let portfolioValue = 0;
			const subscriberModel = await getSubscriberModel();
			let subscriber = await subscriberModel.findOne({ email: variables.id }).lean();
			const historyModel = await getHistoryModel();
			const tickersModel = await getTickersModel();
			const subscriberTradeOrderModel = await getSubscriberTradeOrderModel();

			const openOrders = await subscriberTradeOrderModel
				.find({ subscriber: subscriber._id })
				.lean();

			const openOrderCashHold = openOrders
				.filter((x: any) => x.action === 'Buy' && x.executed === false && x.expired === false)
				.map((x: any) => ({ shares: x.shares, price: x.price }))
				.reduce(
					(acc: number, curr: { shares: number; price: number }) => acc + curr.shares * curr.price,
					0
				);

			subscriber.watching = await subscriber.watching.map(async (symbol: string) => {
				const ticker = await tickersModel.findOne({ symbol }).lean();
				const history = await historyModel.find({ symbol }).lean();
				const lastDay = history
					.sort((a: TickerHistory, b: TickerHistory) =>
						new Date(a.date) > new Date(b.date) ? 1 : -1
					)
					.at(-1);

				return { ...ticker, history: [{ ...lastDay }] };
			});
			if (subscriber.stocksOwned.length > 0) {
				const tradeExecutedModel = await getSubscriberExecutedTradeModel();
				subscriber.stocksOwned = await subscriber.stocksOwned.map(async (symbol: String) => {
					const subscriberTrades = await tradeExecutedModel
						.find({ symbol, subscriber: subscriber._id.toString() })
						.lean();

					const { shares, purchasePrice } = subscriberTrades.reduce(
						(acc: any, curr: any) => {
							curr.action === 'Buy' ? (acc.shares += curr.shares) : (acc.shares -= curr.shares);
							curr.action === 'Buy'
								? (acc.purchasePrice += curr.shares * curr.price)
								: (acc.purchasePrice -= curr.shares * curr.price);
							return acc;
						},
						{ shares: 0, purchasePrice: 0 }
					);
					const history = await historyModel.find({ symbol }).lean();
					const lastDay: TickerHistory = history
						.sort((a: TickerHistory, b: TickerHistory) =>
							new Date(a.date) > new Date(b.date) ? 1 : -1
						)
						.at(-1);
					portfolioValue += Number(lastDay.close) * shares;
					return {
						symbol,
						shares,
						purchasePrice: purchasePrice / shares,
						winLossAmount: Number(lastDay.close) * shares - purchasePrice,
						todaysGain: Number(lastDay.close) * shares - Number(lastDay.previousClose) * shares,
						currentValue: Number(lastDay.close) * shares,
						purchaseAmount: purchasePrice,
						stockDailyPrice: lastDay
					};
				});
			}
			return {
				...subscriber,
				portfolioValue,
				stocksWatched: subscriber.watching,
				openOrderCashHold
			};
		},
		getSubscriberTickerData: async (_: any, variables: any) => {
			const subscriberModel = await getSubscriberModel();
			const subscriber = await subscriberModel.findById(variables.ticker.subscriber).lean();
			if (subscriber.stocksOwned.includes(variables.ticker.symbol)) {
				const tradeExecutedModel = await getSubscriberExecutedTradeModel();
				const subscriberTickerHistory = await tradeExecutedModel
					.find({
						subscriber: subscriber._id.toString(),
						symbol: variables.ticker.symbol
					})
					.lean();
				const { shares, purchasePrice } = subscriberTickerHistory.reduce(
					(acc: any, curr: any) => {
						curr.action === 'Buy' ? (acc.shares += curr.shares) : (acc.shares -= curr.shares);
						curr.action === 'Buy'
							? (acc.purchasePrice += curr.shares * curr.price)
							: (acc.purchasePrice -= curr.shares * curr.price);
						return acc;
					},
					{ shares: 0, purchasePrice: 0 }
				);
				return {
					subscriber,
					symbol: variables.ticker.symbol,
					shares,
					purchasePrice: purchasePrice / shares
				};
			}
			return {
				subscriber,
				symbol: variables.ticker.symbol,
				shares: 0
			};
		}
	}
};

const typeDefs = gql(fs.readFileSync('./src/routes/api/graphql/schema.graphql', 'utf-8'));

const server = new ApolloServer({
	resolvers,
	typeDefs
});

export const POST: RequestHandler = startServerAndCreateSvelteKitHandler(server, {
	context: async ({ request }) => {
		return { pubsub };
	}
});
