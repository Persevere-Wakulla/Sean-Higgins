import mongoose, { Model, Schema } from 'mongoose';
import CryptoES from 'crypto-es';
import monitorModel from './schema/monitor';
import dayjs from 'dayjs';
import type { Register } from '$lib/types/register';
import getHistoryModel from './schema/history';
import getMonitorModel from './schema/monitor';
import getSubscriberModel from './schema/subscriber';
import getTickersModel from './schema/tickers';
import type { Ticker } from '$lib/types/ticker';
import getSubscriberTradeOrderModel from './schema/subscriberTradeOrder';
import getSubscriberExecutedTradeModel from './schema/subscriberExecutedTrade';

var url = 'mongodb://127.0.0.1/prometheus';
export const connectDB = async () => {
	try {
		const client = await mongoose.connect(url);
		return client;
	} catch (error) {
		console.error('MongoDB connection error:', error);
		process.exit(1);
	}
};

export function getModel(modelName: string, schema: Schema) {
	if (mongoose.models[modelName]) {
		return mongoose.models[modelName];
	}

	return mongoose.model(modelName, schema);
}

const handleExpiredTrades = async () => {
	const tradeOrderModel = await getSubscriberTradeOrderModel();
	const allExpiredTrades = await tradeOrderModel.find({
		executed: false,
		expired: false,
		$or: [{ goodTillDate: { $lte: dayjs(new Date()).startOf('day').toDate() } }]
	});
	allExpiredTrades.forEach(async (trade: any) => {
		trade.expired = true;
		await trade.save();
	});
};

const isInPriceRange = (high: number, low: number, price: number) => price >= low || price <= high;

export const executeLimitTrades = async () => {
	await handleExpiredTrades();
	const tradeOrderModel = await getSubscriberTradeOrderModel();
	const tradeExecutionModel = await getSubscriberExecutedTradeModel();
	const tickerHistoryModel = await getHistoryModel();
	const allTradesAvailable = await tradeOrderModel
		.find({
			executed: false,
			expired: false,
			$or: [
				{ goodTillDate: null },
				{ goodTillDate: { $gte: dayjs(new Date()).startOf('day').toDate() } }
			]
		})
		.populate('subscriber ticker');
	allTradesAvailable.forEach(async (trade: any) => {
		const subscriber = trade._doc.subscriber;
		let isLiquidation = false;
		const ticker = trade._doc.ticker;
		if (subscriber.stocksOwned.includes(ticker.symbol) && trade._doc.action === 'Sell') {
			const existing = await tradeExecutionModel
				.find({ symbol: ticker.symbol, subscriber: subscriber._id })
				.lean();
			const currentShares = existing.reduce(
				(acc, curr) => (acc += curr.action === 'Buy' ? curr.shares : -curr.shares),
				0
			);
			isLiquidation = currentShares - trade._doc.shares === 0;
		}
		const lastTickerDay = await tickerHistoryModel
			.findOne({ symbol: ticker.symbol })
			.sort({ _id: -1 })
			.lean(); //Get the last inserted day for symbol
		if (
			dayjs(lastTickerDay.date).toDate() > trade._doc.datePlaced &&
			isInPriceRange(lastTickerDay.high, lastTickerDay.low, trade._doc.price)
		) {
			const tradeModel = {
				...trade._doc,
				ticker: ticker._id,
				subscriber: subscriber._id,
				dateExecuted: new Date(),
				tradeBatchId: crypto.randomUUID(),
				isLiquidation
			};
			const succeed = await tradeExecutionModel.create({ ...tradeModel });
			
			const stocksOwned = isLiquidation
				? [...subscriber.stocksOwned.filter((x: string) => x !== ticker.symbol)]
				: [...subscriber.stocksOwned.filter((x: string) => x !== ticker.symbol), ticker.symbol];
			subscriber.stocksOwned = stocksOwned;
			subscriber.liquidCash =
				trade._doc.action === 'Buy'
					? subscriber.liquidCash - trade._doc.price * trade._doc.shares
					: subscriber.liquidCash + trade._doc.price * trade._doc.shares;
			await subscriber.save();
			trade.executed = true;
			await trade.save();
		}
	});
};

export const getPrevDayCloses = async () => {
	const tickersModel = await getTickersModel();
	const tickers = await tickersModel.find().select('symbol').lean();

	const symbols = tickers.map((x) => x.symbol).filter((x) => !x.includes('^') && !x.includes('/'));
	// const tickers = await monitorModel.find().lean();
	// const symbols = tickers.map(x => x.symbol);
	try {
		for (let index = 0; index < symbols.length; index++) {
			const pauseTime = new Promise((resolve) => {
				setTimeout(() => {
					resolve(true);
				}, 1000);
			});
			const symbol = symbols[index];
			console.dir(symbol);
			await retrieveStockerTickerData(symbol);
			await pauseTime;
		}
		console.dir(`completed on - ${new Date()}`);
	} catch (err) {
		console.dir(err);
	}
};

const retrieveStockerTickerData = async (symbol: string, cb?: Function) => {
	const historyModel = await getHistoryModel();
	const tickersModel = await getTickersModel();
	const res = await fetch(`http://192.168.1.45:3000/stocks/${symbol}`);
	const body = await res.text();
	if (!body.includes('Unknown symbol')) {
		const existingTicker = await tickersModel.findOne({ symbol });
		if (!existingTicker) {
			await tickersModel.create({
				name: symbol.toUpperCase(),
				symbol: symbol.toUpperCase()
			});
		}
		const json = JSON.parse(
			body.slice(0, body.lastIndexOf('"')).replace('"', '').replaceAll('\\', '')
		);
		const existing = await historyModel.findOne({
			symbol: symbol,
			date: json.latestTime
		});
		if (!existing) {
			const historyInsert = new historyModel({
				...json,
				date: json.latestTime
			});
			await historyInsert.save();
		}
		if (cb) {
			return await cb(symbol);
		}
	}
};

const historyRetrival = async (symbol: string) => {
	const tickersModel = await getTickersModel();
	const aggregatePipe = [
		{
			$lookup: {
				from: 'histories',
				localField: 'symbol',
				foreignField: 'symbol',
				as: 'tickerHistory'
			}
		},
		{
			$match: {
				symbol: { $regex: `^${symbol}$`, $options: 'i' }
			}
		},

		{ $unset: ['_id', '__v', 'tickerHistory.__v', 'tickerHistory._id'] }
	];
	return await tickersModel.aggregate(aggregatePipe);
};

export const getHistories = async (symbol: string) => {
	const results = (await historyRetrival(symbol)) as [];
	if (!(results.length > 0) || (results.length > 0 && results[0].tickerHistory.length === 0)) {
		return {
			monitoring: false,
			tickerData: await retrieveStockerTickerData(symbol, async (symbol: string) => {
				const data = await historyRetrival(symbol);
				return data[0];
			})
		};
	} else {
		const monitorModel = await getMonitorModel();
		const isMonitoring = await monitorModel.aggregate([{ $unset: ['_id', '_v'] }]);
		return {
			monitoring: isMonitoring ? true : false,
			tickerData: results[0]
		};
	}
};

export const getTickers = async (): Promise<Ticker[]> => {
	const tickersModel = await getTickersModel();
	return await tickersModel.aggregate([
		{
			$unset: ['_id', 'url', 'marketCap', 'ipoyear', 'netchange', 'pctchange', 'lastsale', 'volume']
		}
	]);
};

export const registerSubscriber = async (credentials: Register) => {
	const subscriberModel = await getSubscriberModel();
	const salt = CryptoES.lib.WordArray.random(16);
	const hashed = CryptoES.PBKDF2(credentials.password, salt);
	console.dir(hashed);
	const subscriber = new subscriberModel({
		...credentials,
		password: hashed,
		salt
	});
	await subscriber.save();

	const user = await subscriberModel.findOne({
		username: credentials.username
	});
	if (CryptoES.PBKDF2(credentials.password, user.salt).toString() === user.password) {
		console.log('congrats on logging in');
	}
};
