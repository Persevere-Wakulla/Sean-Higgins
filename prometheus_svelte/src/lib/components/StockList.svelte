<script lang="ts">
	import numFormat from 'number-format.js';
	import { goto } from '$app/navigation';
	import type { Ticker } from '$lib/types/ticker';

	const { header, stocks }: { header: string; stocks: Ticker[] } = $props();
</script>

<div class="flex flex-col gap-4 w-full text-white">
	<div class="shadow-md shadow-lime-700 w-full rounded-full">
		<h4
			class=" bg-lime-500 rounded-full w-full text-center text-xl font-bold tracking-widest shadow-inner shadow-lime-900 p-1"
		>
			{header}
		</h4>
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
					<h4
						class:text-lime-500={Number(stock.history[0].close) > stock.history[0].previousClose}
						class:text-red-500={Number(stock.history[0].close) < stock.history[0].previousClose}
						class="text-lg tracking-widest"
					>
						{numFormat('$#,###.##', Number(stock.history[0].close))}
						({numFormat(
							'#,###.##',
							Number(stock.history[0].close) - stock.history[0].previousClose
						)})
					</h4>
				</button>
			{/each}
		{:else}
			<p class="text-white text-sm text-center">No Stocks in list</p>
		{/if}
	</div>
</div>
