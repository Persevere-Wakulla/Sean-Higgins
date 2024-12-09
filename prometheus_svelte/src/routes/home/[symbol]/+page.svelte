<script lang="ts">
	import dayjs from 'dayjs';
	import { gql } from 'graphql-tag';
	import toast from 'svelte-french-toast';
	import format from 'number-format.js';
	import type { PageData } from './$types';
	import { Cog8ToothIcon, PencilIcon, PlusCircleIcon } from 'heroicons-svelte/24/outline';
	import TechnicalModal from '$lib/components/TechnicalModal.svelte';
	import TickerInfo from '$lib/components/TickerInfo.svelte';
	import RsiChart from '$lib/components/RSIChart.svelte';
	import VolumeChart from '$lib/components/VolumeChart.svelte';
	import TickerChart from '$lib/components/TickerChart.svelte';
	import type { Ticker } from '$lib/types/ticker';
	import Trade from '$lib/components/Trade.svelte';
	import { calculateRSI } from '$lib/utils/chartTools';
	import TickerSearch from '$lib/components/TickerSearch.svelte';
	import { apolloStore, subscriber } from '$lib/stores/chartStore';
	import { mutation, query } from 'svelte-apollo-wrappers';
	import { ensureApolloLoaded, queryData } from '$lib/utils/ensureApolloClient';
	import { page } from '$app/stores';

	let { data }: { data: PageData } = $props();

	const height = 500;
	const lowerChartHeight = 150;
	let width: number = $state(200);
	let tradeView: boolean = $state(false);
	let hasClient: boolean = $state(false);
	let chartIndex: number = $state(-1);
	let technicalMenuOpen: boolean = $state(false);
	let currentHoveredVolume: number | null = $state(null);
	let currentHoveredRSI: number | null = $state(null);
	let tickerElement: HTMLInputElement | undefined = $state();
	let searchOptionsRef: HTMLDivElement = $state({} as HTMLDivElement);
	let ticker: string = $state('');
	// let subTickerData: any = $state();

	let usingTickerSearch: boolean = $state(true);
	let movingAvgs: any[] = $state([]);
	let lowerCharts: any[] = $state([]);
	let autoCompleteTickers: any[] = $state([]);
	let isDrawing: boolean = $state(false);
	let modalData: any = $state({
		action: 'Buy',
		ticker: data.ticker,
		orderType: 'Limit',
		price: data.tickerHistory.at(-1).close,
		lastPrice: data.tickerHistory.at(-1).close
	});
	
	$effect.pre(() => {
		hasClient = ensureApolloLoaded($apolloStore);
		// if (!$subscriber._id) {
			// 	subscriberGQL = queryData(data.GET_SUBSCRIBER, { id: $page.data.session?.user?.email });
			// }
		});
		
		let subscriberGQL: any = $derived.by(() => {
			if (!$subscriber._id && hasClient) {
				return queryData(data.GET_SUBSCRIBER, { id: $page.data.session?.user?.email });
			}
		});
	const addWatchlist: any = mutation(gql(data.ADD_WATCHLIST as any));
	
	$effect(() => {
		if ($subscriberGQL !== undefined && $subscriberGQL.data?.getSubscriber) {
			subscriber.set($subscriberGQL?.data?.getSubscriber);
		}
	});
	let subTickerData: any = $derived.by(()=> {
		if (hasClient && $subscriber._id !== undefined){
			return query(gql(data.GET_SUBSCRIBER_TICKER_DATA as any), {
					variables: {
						ticker: {
							subscriber: $subscriber._id,
							symbol: data.ticker.symbol
						}
					}
				});
		}
	});

	const technicalIndicatorsAllowed = [
		{
			id: 1,
			name: 'Moving Average',
			type: 'line',
			timeframe: 7
		},
		{
			id: 2,
			name: 'RSI',
			timeframe: 14
		},
		{
			id: 3,
			name: 'Volume'
		}
	];

	let chartIndicatorValues: any = $state({
		timeframe: 7,
		color: '#ffffff'
	});

	const handleUpdate = (prop: string, value: string) => {
		chartIndicatorValues = { ...chartIndicatorValues, [prop]: value };
	};

	const addIndicator = (selected: object) => {
		const submitValues = {
			...selected,
			...chartIndicatorValues
		};
		if (submitValues.name === 'Moving Average') {
			movingAvgs = [
				...movingAvgs.filter((x) => x.timeframe !== submitValues.timeframe),
				submitValues
			];
		} else {
			lowerCharts = [...lowerCharts.filter((x) => x.name !== submitValues.name), submitValues];
		}
	};

	$effect(() => tickerElement?.focus());

	$effect(() => {
		let timerId = 0;
		if (ticker) {
			timerId = +setTimeout(() => {
				autoCompleteTickers = data.tickers.filter((x: Ticker) =>
					usingTickerSearch
						? x.symbol.startsWith(ticker.toUpperCase())
						: x.name.toUpperCase().includes(ticker.toUpperCase())
				);
			}, 500);
		} else {
			autoCompleteTickers = [];
		}
		return () => clearTimeout(timerId);
	});

	const margin = { top: 20, right: 20, left: 0, bottom: 20 };

	const handleWatchlistAdd = async (e: SubmitEvent) => {
		e.preventDefault();
		const watchTicker = {
			subscriber: $subscriber._id,
			symbol: data.ticker.symbol
		};
		await addWatchlist({ variables: { watchTicker } });
	};

	const isUsingSearch = (e: MouseEvent) => {
		if (!searchOptionsRef) return;
		const element = e.target as HTMLElement;
		if (element.id === 'watchlist') return;
		const directParent = element.parentElement;
		if (directParent !== searchOptionsRef) {
			if (searchOptionsRef?.classList?.contains('flex-col')) {
				autoCompleteTickers = [];
			}
		}
	};
</script>

<svelte:window onclick={isUsingSearch} bind:innerWidth={width} />

<TechnicalModal
	isOpen={technicalMenuOpen}
	setIsOpen={() => (technicalMenuOpen = false)}
	data={technicalIndicatorsAllowed}
	{addIndicator}
	{handleUpdate}
></TechnicalModal>

{#key tradeView}
	<Trade
		rePoll={() => {
			subTickerData.query.refetch();
			// if (!subscriberGQL) {
			// 	// subscriberGQL = queryData(data.GET_SUBSCRIBER, { id: $page.data.session?.user?.email });
			// 	// subscriberGQL.query.refetch();
			// }else{
				subscriberGQL.query.refetch();
			// }
		}}
		{modalData}
		{tradeView}
		ownedData={$subTickerData?.data?.getSubscriberTickerData}
		stockAction={data.STOCK_ACTION}
		onclick={() => (tradeView = false)}
	></Trade>
{/key}
{#if $subTickerData && $subTickerData.data.getSubscriberTickerData.shares > 0}
	<div
		class:bg-red-400={data.tickerHistory.length > 2 &&
			data.tickerHistory.at(-1).close < data.tickerHistory.at(-2).close}
		class:bg-green-500={data.tickerHistory.length > 2 &&
			data.tickerHistory.at(-1).close > data.tickerHistory.at(-2).close}
		class="text-white flex justify-between gap-2 text-xl p-4"
	>
		<p>Shares: {$subTickerData.data.getSubscriberTickerData.shares}</p>
		<p>
			Daily Gain/Loss: {format(
				'$#,###.##',
				$subTickerData.data.getSubscriberTickerData.shares * data.tickerHistory.at(-1).close -
					$subTickerData.data.getSubscriberTickerData.shares * data.tickerHistory.at(-2).close
			)}
		</p>
		<p>
			Total: {format(
				'$#,###.##',
				$subTickerData.data.getSubscriberTickerData.shares * data.tickerHistory.at(-1).close
			)}
		</p>
	</div>
{/if}
{#key $page.url.pathname}
<section class:max-md:hidden={tradeView}>
	<div class="flex max-md:flex-col items-center justify-between">
		<div class="relative flex gap-4">
			<button class="pt-2 pl-4" onclick={() => (technicalMenuOpen = !technicalMenuOpen)}>
				<Cog8ToothIcon class="text-white w-6 hover:cursor-pointer hover:animate-spin"
				></Cog8ToothIcon>
			</button>
			<button
				class:bg-slate-400={isDrawing}
				class="peer p-2 rounded shadow-inner shadow-black transition-all duration-500"
				onclick={() => (isDrawing = !isDrawing)}
			>
				<PencilIcon class="text-white w-6 hover:cursor-pointer"></PencilIcon>
			</button>
			<div
				class="peer-hover:flex hidden -right-20 top-10 rounded shadow-sm shadow-fuchsia-200 p-2 absolute bg-slate-800 text-white"
			>
				Draw Chart Lines
			</div>
		</div>
		<div class="flex gap-4 items-center">
			<h4 class="text-white font-extrabold text-xl tracking-widest">
				{data.ticker.symbol}
			</h4>
			<h4 class="text-white">
				{dayjs(data.tickerHistory.at(-1).date).format('MM/DD/YYYY')} Close:
				<span
					class:text-red-500={data.tickerHistory.length > 2 &&
						data.tickerHistory.at(-1).close < data.tickerHistory.at(-2).close}
					class:text-green-500={data.tickerHistory.length > 2 &&
						data.tickerHistory.at(-1).close > data.tickerHistory.at(-2).close}
					>{format('$#,###.##', data.tickerHistory.at(-1).close)} ({format(
						'#,###.##',
						data.tickerHistory.length > 2
							? data.tickerHistory.at(-1).close - data.tickerHistory.at(-2).close
							: 0
					)})</span
				>
			</h4>
		</div>
		<div class="p-4">
			<TickerSearch tickers={data.tickers as Ticker[]}></TickerSearch>
		</div>
	</div>

	<div class="flex gap-6 justify-center mt-4">
		<button
			onclick={() => {
				tradeView = true;
				modalData.action = 'Buy';
			}}
			class="text-white bg-green-500 pb-2 w-32 transition-all duration-500 hover:text-slate-700 rounded-full shadow-inner shadow-slate-700 text-lg"
		>
			Buy
		</button>
		<button
			onclick={() => {
				if ($subTickerData && $subTickerData.data.getSubscriberTickerData.shares > 0) {
					tradeView = true;
					modalData.action = 'Sell';
				} else {
					toast.error('Must own shares in order to sell - Short Selling Feature coming soon');
				}
			}}
			class="text-white bg-red-500 pb-2 w-32 transition-all duration-500 hover:text-slate-700 rounded-full shadow-inner shadow-slate-700 text-lg"
		>
			Sell
		</button>
	</div>

	<div class="p-4">
		<TickerChart
			onRemovedIndicator={(indicator: object) =>
				movingAvgs.splice(movingAvgs.indexOf(indicator), 1)}
			onMove={(i: number) => (chartIndex = i)}
			{data}
			{width}
			{height}
			{margin}
			{movingAvgs}
			{lowerCharts}
			{isDrawing}
			hoverVolume={currentHoveredVolume}
			hoverRSI={currentHoveredRSI}
		></TickerChart>

		{#each lowerCharts as chart}
			{#if chart.name === 'RSI'}
				<RsiChart
					{width}
					timeFrame={chart.timeframe}
					data={data.tickerHistory}
					height={lowerChartHeight}
					{chartIndex}
					onpointerenter={(index: number) => {
						currentHoveredRSI = calculateRSI({ data: data.tickerHistory, index });
					}}
				></RsiChart>
			{:else}
				<VolumeChart
					data={data.tickerHistory}
					{width}
					{chartIndex}
					height={lowerChartHeight}
					padding={25}
					onpointerenter={(volume: number) => {
						currentHoveredVolume = volume;
					}}
				></VolumeChart>
			{/if}
		{/each}
	</div>
	{#if !$subscriber.stocksWatched?.some((e: any) => e.symbol === data.ticker.symbol) && !$subscriber.stocksOwned?.some((e: any) => e.symbol === data.ticker.symbol) && !$addWatchlist.data?.addWatchlist?.stocksWatched?.some((e: any) => e.symbol === data.ticker.symbol)}
		<form class="flex justify-center" onsubmit={handleWatchlistAdd}>
			<button
				id="watchlist"
				class="px-4 relative gap-2 flex items-center text-white bg-blue-400 pb-1 hover:text-blue-900 duration-500 transition-all rounded-full text-xl m-2 shadow-inner shadow-slate-700"
				type="submit"
			>
				<PlusCircleIcon class="w-4 mt-2 pointer-events-none select-none "></PlusCircleIcon>
				Watchlist</button
			>
		</form>
	{/if}
	<TickerInfo ticker={data.ticker}></TickerInfo>
</section>
{/key}