import type { TickerHistory } from '$lib/types/tickerHistory';
import format from 'number-format.js';

export const getMovingAvg = ({
	plotData,
	plotIndex,
	movingAvg,
	data
}: {
	plotData: TickerHistory;
	plotIndex: number;
	movingAvg: number;
	data: any;
}) => {
	if (data.tickerHistoryFull.length > data.tickerHistory.length) {
		let total = 0;
		const fullData = data.tickerHistoryFull;
		const indexOfCurrentDate = fullData.indexOf(
			fullData
				.sort((a: TickerHistory, b: TickerHistory) => (a.date > b.date ? 1 : -1))
				.find((x: TickerHistory) => x.date === plotData.date)
		);
		const endingIndex = indexOfCurrentDate - movingAvg;

		for (let index = indexOfCurrentDate; index > endingIndex; index--) {
			total += Number(
				data.tickerHistoryFull.sort((a: TickerHistory, b: TickerHistory) =>
					a.date > b.date ? 1 : -1
				)[index].close
			);
		}
		const avg = total / movingAvg;

		return avg;
	} else {
		if (plotIndex >= movingAvg - 1) {
			let total = 0;
			for (let index = plotIndex; index > plotIndex - movingAvg; index--) {
				total += Number(
					data.tickerHistory.sort((a: TickerHistory, b: TickerHistory) =>
						a.date > b.date ? 1 : -1
					)[index].close
				);
			}
			const avg = total / movingAvg;
			return avg;
		} else {
			return plotData.low;
		}
	}
};

export const formatMA = (day: TickerHistory, avg: any, data: any) =>
	format(
		'$#,###.##',
		+getMovingAvg({
			plotData: day ?? ({} as TickerHistory),
			plotIndex: data.tickerHistory
				.sort((a: TickerHistory, b: TickerHistory) => (a.date > b.date ? 1 : -1))
				.findIndex((x: TickerHistory) => x.date === day.date),
			movingAvg: avg.timeframe,
			data
		})
	);

export const calculateRSI = ({
	data,
	index,
	timeFrame = 14
}: {
	data: TickerHistory[];
	index: number;
	timeFrame?: number;
}) => {
	if (index > timeFrame) {
		const calc = { up: 0, down: 0 };
		for (let idx = index - timeFrame; idx <= index; idx++) {
			const current = data[idx];
			const prev = data[idx - 1];
			current.close > prev.close ? calc.up++ : calc.down++;
		}
		const rsi = 100 - 100 / (1 + calc.up / calc.down);
		return rsi;
	} else {
		return 0;
	}
};
