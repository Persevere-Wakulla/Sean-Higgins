<script lang="ts">
	import { page } from '$app/stores';
	import numFormat from 'number-format.js';
	import { DateInput } from 'date-picker-svelte';
	import format from 'number-format.js';
	import { XMarkIcon } from 'heroicons-svelte/24/outline';
	import { tweened } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import { mutation } from 'svelte-apollo-wrappers';
	import gql from 'graphql-tag';
	import { subscriber } from '$lib/stores/chartStore';
	import toast from 'svelte-french-toast';
	let {
		tradeView,
		modalData = $bindable(),
		onclick,
		stockAction,
		ownedData,
		rePoll
	}: {
		tradeView: boolean;
		modalData: any;
		onclick: any;
		stockAction: any;
		ownedData: null | object;
		rePoll: Function | null
	} = $props();
	let form = $state({} as HTMLFormElement);
	let closeBtn: HTMLButtonElement = $state({} as HTMLButtonElement);
	let goodTillSelection: number = $state(1);
	let goodTillDate: Date = $state(new Date());
	let shareAmount: number | null = $state(null);
	let limitPrice = $state(modalData.orderType === 'Limit' ? modalData.price : 0);
	let derivedPurchaseAmount = $derived(
		(shareAmount || 0) * (modalData.orderType === 'Limit' ? limitPrice : modalData.lastPrice)
	);

	$effect(() => {
		purchaseAmount.set(derivedPurchaseAmount);
	});

	const sale = mutation(gql(stockAction));

	let purchaseAmount = tweened(0, {
		duration: 300
	});
	const checkShares = (e?: Event) => {
		if (e) {
			const ele = e.target as HTMLInputElement;
			if (ele.valueAsNumber > ownedData?.shares && modalData.action === 'Sell') {
				shareAmount = ownedData?.shares;
			}
		} else {
			return 100;
		}
	};
	const handleAction = async () => {
		const fd = new FormData(form);
		const stockSale = {
			symbol: fd.get('symbol'),
			subscriber: fd.get('subscriber'),
			action: fd.get('action'),
			tradeType: fd.get('orderType'),
			shares: Number(fd.get('shares')),
			price: Number(fd.get('limitPrice')) || Number(modalData.lastPrice),
			goodTillDate:
				fd.get('orderType') === 'Limit' && goodTillSelection === 2 ? goodTillDate : null,
			goodTillType: fd.get('orderType') === 'Limit' ? goodTillSelection : null
		};
		await sale({ variables: { stockSale } });
		closeBtn.click();
		if(rePoll){
			rePoll();
		}
		toast.success(`${stockSale.action} ${stockSale.tradeType} order for ${stockSale.symbol} of ${stockSale.shares} submitted`)
	};
</script>

<section
	transition:fade
	class:hidden={!tradeView}
	class="flex absolute top-[0] md:shadow-md md:items-center z-20 md:justify-center md:shadow-slate-700 w-full h-screen backdrop-blur-sm max-md:bg-gradient-to-r max-md:from-gray-950
      max-md:to-gray-700 md:bg-opacity-45
    "
>
	<div
		class="max-md:w-full md:w-1/2 md:bg-gradient-to-br md:from-gray-950 md:to-gray-700 md:h-max md:from-60% md:shadow-md md:shadow-black md:rounded"
	>
		<div class="flex flex-col h-full justify-between">
			<div>
				<section
					class:bg-red-800={modalData.action === 'Sell'}
					class:bg-lime-500={modalData.action === 'Buy'}
					class="w-full flex justify-end md:rounded-tr-md md:rounded-tl-md"
				>
					<button {onclick} bind:this={closeBtn}>
						<XMarkIcon
							class="w-10 text-white justify-self-end hover:text-fuchsia-400 duration-300 transition-all"
						></XMarkIcon>
					</button>
				</section>
				<div class="w-full flex flex-col gap-6 mt-4 items-center">
					<div class="flex flex-col text-center">
						<h4 class="text-white text-xl">{modalData.ticker.symbol}</h4>
						<h4 class="text-white text-xl">Last Price: {modalData.lastPrice}</h4>
					</div>
					<form class="w-full flex flex-col gap-6 items-center" bind:this={form}>
						<input type="hidden" name="subscriber" value={$page.data.session?.user?.email} />
						<input type="hidden" name="symbol" bind:value={modalData.ticker.symbol} />
						<div class="w-1/2">
							<input
								required
								type="number"
								name="shares"
								max={checkShares()}
								onkeyup={checkShares}
								onchange={checkShares}
								step="1"
								bind:value={shareAmount}
								placeholder="Share Amount"
								class="py-1 w-full shadow-inner shadow-black text-center text-xl font-extrabold rounded"
							/>
							{#if modalData.action === 'Buy'}
								<h4 class="text-white text-lg">
									Available Funds: {numFormat('$#,###.##', $subscriber.liquidCash - $subscriber.openOrderCashHold)}
									{#if $purchaseAmount > 0}
										<span class="text-red-500">
											- {numFormat('$#,###.##', $purchaseAmount)}
										</span>
										<span class="text-red-500">
											= {numFormat('$#,###.##', $subscriber.liquidCash - $purchaseAmount)}
										</span>
									{/if}
								</h4>
							{:else}
								<h4 class="text-white text-lg">Shares: {ownedData?.shares}</h4>
							{/if}
						</div>
						<select
							name="action"
							id=""
							bind:value={modalData.action}
							class="rounded md:shadow-white tracking-widest font-extrabold hover:cursor-pointer text-center text-xl py-2 shadow-sm shadow-black w-1/2 outline-slate-500"
						>
							<option value="Buy">Buy</option>
							{#if ownedData}
								<option value="Sell">Sell</option>
							{/if}
						</select>
						<select
							name="orderType"
							id=""
							bind:value={modalData.orderType}
							class="rounded md:shadow-white tracking-widest font-extrabold hover:cursor-pointer text-center text-xl py-2 shadow-sm shadow-black w-1/2 outline-slate-500"
						>
							<option value="Limit">Limit</option>
							<option value="Market">Market</option>
						</select>
						{#if modalData.orderType === 'Limit'}
							<input
								type="number"
								name="limitPrice"
								step=".01"
								bind:value={limitPrice}
								class="py-1 w-1/2 shadow-inner shadow-black text-center text-xl font-extrabold rounded"
							/>
							<select
								name="goodTill"
								id=""
								bind:value={goodTillSelection}
								class="rounded md:shadow-white tracking-widest font-extrabold hover:cursor-pointer text-center text-xl py-2 shadow-sm shadow-black w-1/2 outline-slate-500"
							>
								<option value={1}>Good Till Cancelled</option>
								<option value={2}>Good Till Date</option>
							</select>
							{#if goodTillSelection === 2}
								<DateInput
									dynamicPositioning={true}
									class="text-xl shadow-inner w-1/2 font-extrabold shadow-black"
									required={goodTillSelection === 2}
									bind:value={goodTillDate}
									closeOnSelection={true}
									format="MM/dd/yyyy"
									placeholder="Expiration Date"
									min={new Date()}
								></DateInput>
							{/if}
						{/if}
						<input type="hidden" name="symbol" value={modalData.ticker.symbol} />
						<input type="hidden" name="subscriber" />
					</form>
					<div
						class:text-lime-400={modalData.action === 'Sell'}
						class:text-red-400={modalData.action === 'Buy'}
						class="text-3xl mb-4"
					>
						{format('$#,###.##', $purchaseAmount)}
					</div>
				</div>
			</div>
			<button
				onclick={handleAction}
				type="submit"
				disabled={modalData.action === 'Buy' && $purchaseAmount > $subscriber.liquidCash}
				class:text-red-800={modalData.action === 'Sell'}
				class:text-lime-500={modalData.action === 'Buy'}
				class="w-full h-20 disabled:cursor-not-allowed hover:text-white transition-all duration-500 text-2xl bg-opacity-50 font-extrabold tracking-widest md:rounded-br-md md:rounded-bl-md bg-slate-800"
				>Submit</button
			>
		</div>
	</div>
</section>

<style>
	:root {
		--date-input-width: 100%;
	}
</style>
