<script lang="ts">
	import type { PageData } from './$types';
	import StockList from '$lib/components/StockList.svelte';
	import TickerSearch from '$lib/components/TickerSearch.svelte';
	import type { Ticker } from '$lib/types/ticker';
	import { gql } from 'graphql-tag';
	import { query } from 'svelte-apollo-wrappers';
	import numFormat from 'number-format.js';
	import OwnedList from '$lib/components/OwnedList.svelte';
	import { apolloStore, subscriber } from '$lib/stores/chartStore';
	import { writable } from 'svelte/store';
	import type { IGetSubscriber } from '$lib/types/interface';
	import { page } from '$app/stores';
	import { ensureApolloLoaded } from '$lib/utils/ensureApolloClient';

	let { data }: { data: PageData } = $props();
	let displayValue: 'Total' | 'Stocks' | 'Cash' = $state('Total');

	const displayTypes = ['Total', 'Stocks', 'Cash'];

	const updateDisplay = () => {
		const index = displayTypes.indexOf(displayValue);
		displayValue = index + 1 >= displayTypes.length ? 'Total' : (displayTypes.at(index + 1) as any);
	};

	let graphQuery = $state(writable({} as IGetSubscriber));
	let todaysValue: number = $derived(
		$graphQuery?.data?.getSubscriber?.stocksOwned.reduce(
			(acc: number, curr: any) => acc + curr.currentValue,
			0
		)
	);
	let lossOrGain = $derived(
		$graphQuery?.data?.getSubscriber?.stocksOwned.reduce(
			(acc: number, curr: any) => acc + curr.todaysGain,
			0
		)
	);

	let hasClient = $state(false);

	$effect.pre(() => {
		console.dir('got to page')
		hasClient = ensureApolloLoaded($apolloStore);
	});

	$effect(() => {
		if (hasClient) {
			graphQuery = query(gql(data.GET_SUBSCRIBER), {
				variables: {
					id: $page.data.session?.user?.email
				}
			}) as any;
		}
	});

	$effect(() => {
		console.dir($graphQuery)
	})

	$effect(() => {
		if ($graphQuery.data?.getSubscriber) {
			subscriber.set($graphQuery.data?.getSubscriber);
		}
	});
</script>

<section class="flex flex-col px-4 gap-4 py-2 items-center text-white">
	<div class="flex flex-col">
		<div>
			<p class="text-center">{displayValue}</p>
			<button onclick={updateDisplay} class="text-4xl tracking-widest">
				{#if displayValue === 'Total'}
					{numFormat('$#,###.##', todaysValue + $graphQuery?.data?.getSubscriber?.liquidCash)}
				{:else if displayValue === 'Stocks'}
					{#if todaysValue > 0}
						{numFormat('$#,###.##', todaysValue)}
					{:else}
						$0
					{/if}
				{:else}
					{numFormat(
						'$#,###.##',
						$graphQuery?.data?.getSubscriber?.liquidCash -
							$graphQuery?.data?.getSubscriber?.openOrderCashHold
					)}
				{/if}
			</button>
		</div>
		<p
			class:text-red-500={lossOrGain < 0}
			class:text-lime-500={lossOrGain > 0}
			class="text-center text-sm"
		>
			Today: {numFormat('$#,###.##', lossOrGain)}
		</p>
	</div>
	<TickerSearch useLabel={true} tickers={data.tickers}></TickerSearch>
	<OwnedList header="My Stocks" stocks={$graphQuery?.data?.getSubscriber?.stocksOwned}></OwnedList>
	<OwnedList header="My Crypto" stocks={[]}></OwnedList>
	{#if $graphQuery?.loading}
		<div>Loading</div>
	{:else}
		<StockList
			header="Stock Watchlist"
			stocks={$graphQuery?.data?.getSubscriber?.stocksWatched?.filter(
				(ticker: Ticker) => !ticker.symbol.endsWith('USD')
			)}
		></StockList>
		<StockList
			header="Crypto Watchlist"
			stocks={$graphQuery?.data?.getSubscriber?.stocksWatched?.filter((ticker: Ticker) =>
				ticker.symbol.endsWith('USD')
			)}
		></StockList>
	{/if}
	<StockList header="Most Active" stocks={[]}></StockList>
</section>
