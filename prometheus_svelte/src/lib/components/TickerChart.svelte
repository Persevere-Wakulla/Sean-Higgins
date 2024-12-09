<script lang="ts">
	import { scaleLinear } from 'd3-scale';
	import { timeFormat } from 'd3-time-format';
	import { max, min, bisector, extent } from 'd3-array';
	import { line } from 'd3-shape';
	import { zoom as d3Zoom } from 'd3-zoom';
	import { select, pointer } from 'd3-selection';
	import { axisLeft, axisBottom } from 'd3-axis';
	import { format } from 'd3-format';
	import {} from 'heroicons-svelte/24/outline';
	import dayjs from 'dayjs';
	import numFormat from 'number-format.js';
	import type { TickerHistory, TickerHistoryTT } from '$lib/types/tickerHistory';
	import { calculateRSI, formatMA, getMovingAvg } from '$lib/utils/chartTools';

	let {
		width,
		height,
		margin,
		data,
		movingAvgs,
		lowerCharts,
		isDrawing,
		onRemovedIndicator,
		hoverVolume = 0,
		hoverRSI = 0,
		onMove
	}: {
		width: number;
		height: number;
		margin: any;
		data: any;
		movingAvgs: any[];
		lowerCharts: any[];
		isDrawing: boolean;
		onRemovedIndicator: any;
		hoverVolume: number | null;
		hoverRSI: number | null;
		onMove: Function;
	} = $props();

	const defaultChartTT = {} as TickerHistoryTT;
	let chartTimeFrame: number = $state(999);
	const chartLegend = $derived([...movingAvgs, ...lowerCharts]);

	const sorted = $derived(
		data.tickerHistory.sort((a: TickerHistory, b: TickerHistory) => (a.date > b.date ? 1 : -1))
	);

	const chartData = $derived(width < 400 ? sorted.slice(-30) : sorted.slice(-chartTimeFrame));

	let chartSvg: SVGElement = $state({} as SVGElement);
	let xAxis: SVGGElement = $state({} as SVGGElement);
	let yAxis: SVGGElement = $state({} as SVGGElement);
	let tooltipG: SVGGElement = $state({} as SVGGElement);
	let candleStickG: SVGGElement = $state({} as SVGGElement);
	let crossHairX: SVGLineElement = $state({} as SVGLineElement);
	let crossHairY: SVGLineElement = $state({} as SVGLineElement);
	let hoveredData: TickerHistory | null = $state(null);
	let currentData = $state(defaultChartTT);
	let useCandle: boolean = $state(true);
	let isFirstClick: boolean = $state(true);
	let firstClickData: any[] = $state([]);
	let drawingLines: any[] = $state([] as any);

	let xDomain: any = $derived(extent(chartData.map((x:TickerHistory)=> x.date)))
	let xScale = $derived(
		scaleLinear()
			.domain(xDomain)
			.range([60, width - 100])
	);
	let yScale = $derived(
		scaleLinear()
			.domain([min(chartData, (d: any) => d.low), max(chartData, (d: any) => d.high)] as any)
			.range([height - 75, 25])
	);

	const lineGen = ({ timeframe }: { timeframe: number }) => {
		return line()
			.x((d: any) => xScale(d.date))
			.y((d, i) =>
				yScale(
					Number(
						getMovingAvg({
							plotData: d as any,
							plotIndex: i,
							movingAvg: timeframe,
							data
						})
					)
				)
			);
	};

	const noCandleLine = line()
		.x((d: any) => xScale(d.date))
		.y((d: any) => yScale(d.close));

	$effect(() => {
		const zoom = d3Zoom()
			.scaleExtent([1, 5])
			.translateExtent([
				[50, 75],
				[width - 50, height - 75]
			])
			// .on('zoom', (event) => {
			// 	const transform = event.transform;
			// 	const newX = transform.rescaleX(xScale);
			// 	const newY = transform.rescaleY(yScale);

			// 	select(chartSvg)
			// 		.select('.x-axis')
			// 		.call(axisBottom(newX).tickFormat(timeFormat('%m/%d') as any) as any);
			// 	select(chartSvg)
			// 		.select('.y-axis')
			// 		.call(axisLeft(newY) as any)
			// 		.call((g) =>
			// 			g
			// 				.selectAll('.tick line')
			// 				.attr('stroke-opacity', 0.4)
			// 				.attr('x2', width - 110)
			// 				.attr('stroke', 'fuchsia')
			// 		);
				
			// 	select(candleStickG)
			// 		.selectAll('.candlestick')
			// 		.each((datum, index, arr) => {
			// 			const candleStick = select(arr[index]);
			// 			const tickerData = chartData.at(index);
			// 			console.dir(newX(tickerData.date));
			// 			candleStick
			// 			.attr('transform', `translate(${newX(tickerData.date)},0)`)
			// 		})

			// });

		select(chartSvg).call(zoom as any);
		select(xAxis)
			.attr('transform', `translate(0,${height - margin.bottom})`)
			.attr('stroke', 'fuchsia')
			.call(axisBottom(xScale).tickFormat(timeFormat('%m / %d') as any))
			.call((g) => g.select('.domain').remove());

		select(yAxis)
			.attr('transform', `translate(${50},22)`)
			.attr('stroke', 'fuchsia')
			.attr('stroke-width', '1')
			.call(
				axisLeft(yScale)
					.tickFormat(format('$~f'))
					.tickValues(scaleLinear().domain(yScale.domain()).ticks(10))
			)
			.call((g) =>
				g
					.selectAll('.tick line')
					.attr('stroke-opacity', 0.4)
					.attr('x2', width - 110)
					.attr('stroke', 'fuchsia')
			)
			.call((g) => g.select('.domain').remove());
	});
	const handleChartClick = (e: Event) => {
		const [x, y] = pointer(e);

		if (isDrawing) {
			if (isFirstClick) {
				firstClickData.push({ id: crypto.randomUUID(), date: x, close: y - 15 });
				isFirstClick = false;
				drawingLines = [
					...drawingLines,
					{
						id: firstClickData[0].id,
						line: firstClickData
					}
				];
			} else {
				firstClickData.push({ id: firstClickData[0].id, date: x, close: y - 15 });
				drawingLines = [
					...drawingLines.filter((x) => x.id !== firstClickData[0].id),
					{
						id: firstClickData[0].id,
						line: firstClickData
					}
				];
				firstClickData = [];
				isFirstClick = true;
			}
		}
	};
	const handleMove = (e: Event) => {
		if (firstClickData.length > 0) {
			const existing = drawingLines.find((x) => x.id === firstClickData[0].id);
			if (existing && existing.line.length > 1) {
				existing.line.pop();
			}
			const [x, y] = pointer(e);
			existing.line.push({ id: firstClickData[0].id, date: x, close: y - 15 });
			drawingLines = [...drawingLines.filter((x) => x.id !== existing.id), { ...existing }];
		}
	};
	const handleTooltip = (e: Event) => {
		const bisect = bisector((d: any) => d.date).center;
		const i = bisect(sorted, xScale.invert(pointer(e)[0]));
		if (!isDrawing) {
			const day = sorted.at(i);
			tooltipG.style.display = 'block';
			hoveredData = { ...day };
			hoverVolume = day.volume;
			hoverRSI = calculateRSI({ data: data.tickerHistory, index: i });
			currentData = {
				Date: day.date,
				Low: day.low,
				High: day.high,
				Close: day.close,
				Open: day.open
			};
			let y = yScale(+day.close);
			let x = xScale(+day.date) - 80;
			if (x < 0) {
				x = 50;
			}
			if (y > height - 150) {
				y = 200;
			}

			tooltipG.setAttribute('transform', `translate(${x},${y + 50})`);
		}
		onMove(i);
		setupCrossHair(i);
	};
	const setupCrossHair = (index: number) => {
		const day = sorted.at(index);
		if (day) {
			select(crossHairX)
				.attr('y1', height)
				.attr('y2', 0)
				.attr('x1', xScale(+day.date))
				.attr('x2', xScale(+day.date));
			select(crossHairY)
				.attr('y1', yScale(day.close))
				.attr('y2', yScale(day.close))
				.attr('x1', 0)
				.attr('x2', width);
		}
	};
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<svg
	viewBox="0,0,{width - 50}, {height}"
	onclick={handleChartClick}
	onmousemove={handleMove}
	onpointerenter={handleTooltip}
	onpointermove={handleTooltip}
	onpointerleave={() => {
		currentData = defaultChartTT;
		tooltipG.style.display = 'none';
	}}
	style="overflow:visible;z-index:5"
	bind:this={chartSvg}
	class="hover:cursor-pointer"
>
	<g class="x-axis" bind:this={xAxis}></g>
	<g class="y-axis" bind:this={yAxis}></g>
	<g bind:this={candleStickG} transform="translate({margin.left} {margin.top})">
		{#each chartData as ticker}
			{#if useCandle}
				<g class="candlestick">
					<line
						stroke-width="1"
						stroke="fuchsia"
						x1={xScale(+ticker.date)}
						x2={xScale(+ticker.date)}
						y1={yScale(+ticker.low)}
						y2={yScale(+ticker.high)}
					></line>
					<line
						stroke-width={3}
						stroke={ticker.close > ticker.open ? 'green' : 'red'}
						x1={xScale(+ticker.date)}
						x2={xScale(+ticker.date)}
						y1={yScale(+ticker.close)}
						y2={yScale(+ticker.open)}
					></line>
				</g>
			{/if}
		{/each}
		{#if !useCandle}
			<g>
				<path fill="none" stroke="white" d={noCandleLine(sorted)}></path>
			</g>
		{/if}
	</g>
	<g transform="translate({margin.left} {margin.top})">
		{#each movingAvgs as avg}
			<path fill="none" stroke={avg.color} d={lineGen(avg)(sorted)}></path>
		{/each}
	</g>
	<g transform="translate({margin.left} {margin.top})">
		{#each drawingLines as lineCreator}

			<line
				stroke="white"
				stroke-width="2"
				x1={+lineCreator.line[0].date}
				x2={+lineCreator.line[1].date}
				y1={+lineCreator.line[0].close}
				y2={+lineCreator.line[1].close}
			></line>
		{/each}
	</g>
	<g transform="translate({margin.left} {margin.top})" stroke="red">
		<line bind:this={crossHairX}></line>
		<line bind:this={crossHairY}></line>
	</g>
	<g style="display:none;pointer-events:none" bind:this={tooltipG}>
		<rect width="160" height="90" class=" fill-slate-800"> </rect>
		<text transform="translate(14,16)">
			{#each Object.entries(currentData) as [prop, value], i}
				<tspan class="text-sm stroke-fuchsia-400 font-thin" x="0" y={`${i * 1.2}em`}>
					<tspan class="font-extrabold tracking-widest">{prop}</tspan>:
					<tspan class="font-thin tracking-widest">
						{typeof value === 'object'
							? dayjs(value).format('YYYY/MM/DD')
							: numFormat('$#,###.####', +value)}
					</tspan>
				</tspan>
			{/each}
		</text>
	</g>
	{#key chartLegend}
		{#if chartLegend.length > 0}
			<g transform="translate({50} 0)">
				<rect width="200" height={chartLegend.length * 20} class="fill-slate-800"> </rect>
				<text transform="translate(14,16)">
					{#each chartLegend as indicator, i}
						<tspan
							style="stroke:{indicator.color}"
							class="text-sm font-thin"
							x="0"
							y={`${i * 1.2}em`}
						>
							{#if indicator.name === 'Moving Average'}
								<tspan class="tracking-widest text-sm"
									>MA({indicator.timeframe}):
									{#if hoveredData}
										{formatMA(hoveredData, indicator, data)}
									{:else}
										{numFormat(
											'$#,###.##',
											+getMovingAvg({
												plotData: data.tickerHistory.at(-1),
												plotIndex: data.tickerHistory.findIndex(
													(x: TickerHistory) => x.date === data.tickerHistory.at(-1).date
												),
												movingAvg: indicator.timeframe,
												data
											})
										)}
									{/if}
								</tspan>
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<tspan
									x="160"
									onclick={() => onRemovedIndicator(indicator)}
									class="font-thin tracking-widest hover:stroke-fuchsia-400 duration-500 transition-all hover:cursor-pointer"
									>X</tspan
								>
							{:else}
								<tspan class="tracking-widest text-sm">
									{indicator.name}
									{#if indicator.name === 'RSI'}
										({indicator.timeframe})
									{/if}:
									{#if indicator.name === 'Volume'}
										{numFormat('#,###.##', hoverVolume as number)}
									{:else}
										{numFormat('#,###.##', hoverRSI as number)}
									{/if}
								</tspan>
							{/if}
						</tspan>
					{/each}
				</text>
			</g>
		{/if}
	{/key}
</svg>
<div class="flex gap-4">
	{#if sorted.length > 30}
		<button
			onclick={() => {
				chartTimeFrame = 30;
			}}
			class="text-white hover:text-fuchsia-400 duration-500 transition-all text-sm">30</button
		>
		<button
			onclick={() => {
				chartTimeFrame = 60;
			}}
			class="text-white hover:text-fuchsia-400 duration-500 transition-all text-sm">60</button
		>
		<button
			onclick={() => {
				chartTimeFrame = 90;
			}}
			class="text-white hover:text-fuchsia-400 duration-500 transition-all text-sm">90 Day</button
		>
		<button
			onclick={() => {
				chartTimeFrame = 999;
			}}
			class="text-white hover:text-fuchsia-400 duration-500 transition-all text-sm">All</button
		>
	{/if}
</div>
