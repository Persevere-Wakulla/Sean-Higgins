<script lang="ts">
	import numFormat from 'number-format.js';
	import { goto } from '$app/navigation';
	import type { Ticker } from '$lib/types/ticker';
	import { ChevronDownIcon } from 'heroicons-svelte/24/outline';

	const { header, stocks }: { header: string; stocks: Ticker[] } = $props();

	let currentView: 'Daily' | 'Up' | 'Total' | 'Stock' = $state('Daily');
	const viewOptions = [
		{ descr: 'Daily Win/Loss', value: 'Daily' },
		{ descr: 'Amount Up/Down', value: 'Up' },
		{ descr: 'Total Value', value: 'Total' },
		{ descr: 'Stock Price', value: 'Stock' }
	];
	let viewSelectionIsOpen: boolean = $state(false);
</script>

<div class="flex flex-col gap-4 w-full text-white">
	<div class="shadow-md shadow-lime-700 w-full rounded-full">
		<div
			class="relative flex w-full justify-between items-center px-10 bg-lime-500 rounded-full shadow-inner shadow-lime-900"
		>
			<h4 class="text-xl self-center font-bold tracking-widest p-1">
				{header}
			</h4>
			<div class="relative">
				<button
					onclick={() => (viewSelectionIsOpen = !viewSelectionIsOpen)}
					class=" text-white flex hover:text-black hover:cursor-pointer duration-500 transition-all"
				>
					<div class="max-md:hidden">
						{#if currentView === 'Daily'}
							<p>Daily Win/Loss</p>
						{:else if currentView === 'Total'}
							<p>Total Value</p>
						{:else if currentView === 'Up'}
							<p>Amount Up/Down</p>
						{:else}
							<p>Stock Price</p>
						{/if}
					</div>
					<ChevronDownIcon class="w-4 "></ChevronDownIcon>
				</button>
				<div
					class:hidden={!viewSelectionIsOpen}
					class:flex={viewSelectionIsOpen}
					class="absolute top-6 z-10 w-max text-lg max-md:right-0 max-md:text-center bg-white p-4 shadow-md shadow-black"
				>
					<div class="flex flex-col w-full text-nowrap">
						{#each viewOptions as option}
							<button
								onclick={() => {
									viewSelectionIsOpen = false;
									currentView = option.value;
								}}
								class="text-black w-full hover:text-sky-700">{option.descr}</button
							>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="flex flex-col gap-2 items-center">
		{#if stocks && stocks.length > 0}
			{#each stocks.slice(0, 30) as stock}
				<button
					onclick={() => {
						goto(`/home/${stock.symbol}`);
					}}
					class="flex items-center hover:cursor-pointer duration-300 transition-all hover:bg-slate-600 hover:bg-opacity-25 hover:text-fuchsia-500 justify-between border-dashed border-b border-fuchsia-500 w-2/3"
				>
					<h4 class="text-xl tracking-widest text-slate-300">{stock.symbol}</h4>
					{#if currentView === 'Daily'}
						<h4
							class:text-lime-500={stock.todaysGain > 0}
							class:text-red-500={stock.todaysGain < 0}
							class="text-lg tracking-widest"
						>
							{stock.todaysGain > 0
								? `+${numFormat('$#,###.##', stock.todaysGain)}`
								: `${numFormat('$#,###.##', stock.todaysGain)}`}
						</h4>
					{:else if currentView === 'Up'}
						<h4
							class:text-lime-500={stock.winLossAmount > 0}
							class:text-red-500={stock.winLossAmount < 0}
							class="text-lg tracking-widest"
						>
							{stock.winLossAmount > 0
								? `+${numFormat('$#,###.##', stock.winLossAmount)}`
								: `${numFormat('$#,###.##', stock.winLossAmount)}`}
						</h4>
					{:else if currentView === 'Total'}
						<h4
							class:text-lime-500={stock.currentValue > stock.purchaseAmount}
							class:text-red-500={stock.currentValue < stock.purchaseAmount}
							class="text-lg tracking-widest"
						>
							{numFormat('$#,###.##', stock.currentValue)}
						</h4>
					{:else}
						<h4
							class:text-lime-500={stock.stockDailyPrice.close > stock.stockDailyPrice.previousClose}
							class:text-red-500={stock.stockDailyPrice.close < stock.stockDailyPrice.previousClose}
							class="text-lg tracking-widest"
						>
							{numFormat('$#,###.##', stock.stockDailyPrice.close)}
                            ({numFormat('#,###.##', stock.stockDailyPrice.close - stock.stockDailyPrice.previousClose)})
						</h4>
					{/if}
				</button>
			{:else}
				<p class="text-white text-sm text-center">No Stocks in list</p>
			{/each}
		{/if}
	</div>
</div>
