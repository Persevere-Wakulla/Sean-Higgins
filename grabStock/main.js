import path from 'path'
import fs from 'fs/promises'
import dayjs from 'dayjs';
import { CronJob } from 'cron';

const filePath = path.resolve('./assets/stockHistories.json')
const logPath = path.resolve('./assets/log.json');
const historyPath = './assets/history/'

const getPrevDayCloses = async (symbols) => {
	const { logFilePath, logData } = await checkLog();
	const dayLog = logData.find(x => dayjs(x.date).startOf('day').toDate().getTime() === dayjs(new Date()).startOf('day').toDate().getTime() && x.status === 'Completed');
	if (!dayLog) {
		const dailyHistoryPath = path.resolve(`${historyPath}${dayjs(new Date()).format('MM_DD_YYYY')}.json`);
		await createFileIfNeeded(dailyHistoryPath)
		try {
			for (let index = 0; index < symbols.length; index++) {
				const pauseTime = new Promise((resolve) => {
					setTimeout(() => {
						resolve(true);
					}, 2000);
				});
				const symbol = symbols[index];
				console.dir(symbol);
				await retrieveStockerTickerData(symbol, dailyHistoryPath);
				await pauseTime;
			}
			await writeToLog({
				status: 'Completed',
				date: new Date(),
				path: logFilePath,
				data: logData
			})
		} catch (err) {
			await writeToLog({
				status: 'Failed',
				date: new Date(),
				msg: err,
				path: logFilePath,
				data: logData
			})
			console.dir(err);
		}
	} else {
		console.log('Already ran for today')
	}
};

const retrieveStockerTickerData = async (symbol, dailyHistoryPath, cb) => {
	try {
		const res = await fetch(`http://192.168.1.45:3000/stocks/${symbol}`);
		const body = await res.text();
		if (!body.includes('Unknown symbol')) {
			const json = JSON.parse(
				body.slice(0, body.lastIndexOf('"')).replace('"', '').replaceAll('\\', '')
			);
			await appendDataAsync(dailyHistoryPath, json)
			if (cb) {
				return await cb(symbol);
			}
		}
	}
	catch (err) {
		const { logFilePath, logData } = await checkLog();

		await writeToLog({
			status: 'Failed',
			date: new Date(),
			msg: err,
			path: logFilePath,
			data: logData
		})
		console.dir(err);
	}
};

const openExistingFile = async (filePath) => {
	try {
		const fileContent = await fs.readFile(filePath, 'utf8')
		const asJson = JSON.parse(fileContent);
		return asJson;
	}
	catch (err) {
		console.dir('Error opening existing stock file');
	}
}

async function appendDataAsync(filePath, data) {
	const fullPath = path.resolve(filePath);

	const tickerData = {
		...data,
		date: data.latestTime
	}

	let existingData = await openExistingFile(fullPath);

	if (!existingData.find(x => x.symbol === tickerData.symbol && x.date == tickerData.date)) {
		existingData.push(tickerData);
		try {
			await fs.writeFile(fullPath, JSON.stringify(existingData));
		}
		catch (err) {
			console.error('Error appending data:', err.message);
		}
	}

}

const createFileIfNeeded = async (fullPath) => {
	try {
		const result = await fs.access(fullPath, fs.constants.F_OK);
		console.log("File already created")
	}
	catch (err) {
		try {
			const emptyArr = [];
			const data = await fs.writeFile(fullPath, JSON.stringify(emptyArr, null, 2));
		}
		catch (writeErr) {
			console.error(`Error creating file: ${err.message}`)
		}
	}
}

const openTickers = async () => {
	const tickerPath = path.resolve('./assets/all_tickers.txt');
	try {
		const data = await fs.readFile(tickerPath, 'utf8')
		try {
			const tickerJson = data.split('\n');
			return tickerJson;
		}
		catch (parseErr) {
			console.error('Error parsing JSON data', parseErr.message);
		}

	}
	catch (err) {
		console.error('Error reading file:', err.message);
	}
}

const writeToLog = async ({ date, status, data, path, msg = '' }) => {
	data.push({
		status,
		date,
		msg
	})
	try {
		await fs.writeFile(path, JSON.stringify(data))
	}
	catch (err) {
		console.error(`Failed to write to log: ${err}`)
	}
}

const checkLog = async () => {
	await createFileIfNeeded(logPath);
	try {
		return {
			logFilePath: logPath,
			logData: await openExistingFile(logPath)
		};
	}
	catch (err) {
		console.error(`Error opening log file`)
	}

}

const main = async () => {
	const fullPath = path.resolve(filePath);

	await createFileIfNeeded(fullPath);

	const symbols = await openTickers();

	await getPrevDayCloses(symbols)
}


const job = new CronJob(
	'30 18 * * *', // cronTime
	main, // onTick
	null, // onComplete
	true, // start so that it starts right away
);