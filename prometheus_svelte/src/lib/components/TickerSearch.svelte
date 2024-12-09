<script lang="ts">
	import type { InputOptions } from '$lib/types/inputOptions';
	import { ArrowRightIcon, BuildingOfficeIcon, ChartPieIcon } from 'heroicons-svelte/24/solid';
	import CustomInput from './CustomInput.svelte';
	import { enhance } from '$app/forms';
	import type { Ticker } from '$lib/types/ticker';
	import { page } from '$app/stores';

	let usingTickerSearch: boolean = $state(true);
	let ticker: string = $state('');
	let tickerSearch: HTMLInputElement = $state({} as HTMLInputElement);
	let searchOptionsRef: HTMLDivElement = $state({} as HTMLDivElement);
	let autoCompleteTickers: any[] = $state([]);
	let lastTab: HTMLButtonElement | null = $state(null);

	let { tickers, useLabel }: { tickers: Ticker[]; useLabel?: boolean } = $props();

	$effect(() => {
		tickerSearch?.focus();
	});

	$effect(() => {
		let timerId = 0;
		if (ticker) {
			timerId = +setTimeout(() => {
				autoCompleteTickers = tickers.filter((x: Ticker) =>
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

	const isUsingSearch = (e: MouseEvent) => {
		const element = e.target as HTMLElement;
		const directParent = element.parentElement;
		if (directParent !== searchOptionsRef) {
			if (searchOptionsRef.classList.contains('flex-col')) {
				autoCompleteTickers = [];
			}
		}
	};
	const handleTab = (e: KeyboardEvent) => {
		if (
			(e.key === 'Tab' || e.key === 'ArrowDown' || e.key === 'ArrowUp') &&
			autoCompleteTickers.length > 0
		) {
			e.preventDefault();
			const children = searchOptionsRef.querySelectorAll('button');
			if (e.key === 'ArrowUp') {
				lastTab = lastTab === null || lastTab === children[0]
					? children[children.length - 1]
					: lastTab.previousElementSibling as HTMLButtonElement;
			} else {
				lastTab = lastTab === null || lastTab === children[children.length - 1]
					? children[0]
					: lastTab.nextElementSibling as HTMLButtonElement;
			}
			lastTab.focus();
		} else if(autoCompleteTickers.length > 0 && e.target !== tickerSearch && e.key !== 'Enter') {
			lastTab = null;
			tickerSearch.focus();
		}
	};
</script>

<svelte:window onclick={isUsingSearch} onkeydown={handleTab} />

<form
	method="post"
	action="?/ticker"
	use:enhance={async ({ formData, submitter, cancel }) => {
		let tickerForm = formData.get('ticker') as string;
		if (
			tickerForm.match(/[^A-Za-z]/) ||
			!tickers.find((x: Ticker) => x.symbol === tickerForm.toUpperCase())
		) {
			cancel();
			tickerSearch.focus();
			ticker = '';
		}
	}}
	class="relative flex flex-col text-center text-black"
>
	{#if useLabel}
		<label class="text-white" for="ticker">Search for Ticker Symbol</label>
	{/if}
	<CustomInput
		bind:value={ticker}
		bind:ref={tickerSearch}
		onfocusin={() => {
			if (ticker) {
				autoCompleteTickers = tickers.filter((x: Ticker) =>
					usingTickerSearch
						? x.symbol.includes(ticker.toUpperCase())
						: x.name.includes(ticker.toUpperCase())
				);
			}
		}}
		inputOptions={{
			placeholder: usingTickerSearch ? 'Ticker' : 'Name',
			autoComplete: 'off',
			id: 'autoCompleteInput',
			name: 'ticker'
		} as InputOptions}
	>
		{#snippet beforeEl()}
			{#if usingTickerSearch}
				<ChartPieIcon
					onclick={() => {
						usingTickerSearch = !usingTickerSearch;
						tickerSearch?.focus();
					}}
					class="w-6 hover:cursor-pointer text-gray-400"
				></ChartPieIcon>
			{:else}
				<BuildingOfficeIcon
					onclick={() => {
						usingTickerSearch = !usingTickerSearch;
						tickerSearch?.focus();
					}}
					class="w-6 hover:cursor-pointer text-gray-400"
				></BuildingOfficeIcon>
			{/if}
		{/snippet}
		{#snippet afterEl()}
			<button tabindex="-1" type="submit">
				<ArrowRightIcon class="text-black w-4 cursor-pointer"></ArrowRightIcon>
			</button>
		{/snippet}
	</CustomInput>
	<div
		id="autoComplete"
		bind:this={searchOptionsRef}
		class:flex-col={autoCompleteTickers.length > 0}
		class=" bg-gradient-to-bl z-50 top-16 from-black to-slate-600 absolute w-[275px] shadow-md text-white shadow-fuchsia-500 rounded-md overflow-hidden justify-start"
	>
		{#each autoCompleteTickers.slice(0, 10) as tickerInfo, i}
			<button
				tabindex={0}
				onfocus={() => (tickerSearch.value = tickerInfo.symbol)}
				type="submit"
				onclick={() => {
					ticker = tickerInfo.symbol;
					usingTickerSearch = true;
				}}
				formaction="/home?/ticker"
				class="hover:cursor-pointer focus:bg-slate-400 focus:text-lime-300 hover:text-lime-300 px-4 w-full flex text-lg items-center gap-2 text-start text-nowrap"
			>
				<span class=" select-none pointer-events-none">{tickerInfo.symbol} :</span>
				<span class=" select-none pointer-events-none">
					{#if tickerInfo.name.length > 20}
						{tickerInfo.name.slice(0, 17).padEnd(20, '.')}
					{:else}
						{tickerInfo.name}
					{/if}
				</span>
			</button>
		{/each}
	</div>
</form>
