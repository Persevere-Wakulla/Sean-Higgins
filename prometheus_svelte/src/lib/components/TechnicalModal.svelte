<script lang="ts">
	import CustomInput from './CustomInput.svelte';
	import type { TechnicalIndicatorMenuItem } from '$lib/types/technicalIndicatorMenuItem';
	import { chartMAs } from '$lib/stores/chartStore';

	let {
		isOpen,
		data,
		addIndicator,
		setIsOpen,
		handleUpdate
	}: {
		isOpen: boolean;
		data: any;
		addIndicator: Function;
		setIsOpen: Function;
		handleUpdate: Function;
	} = $props();
	let technicalIndicatorSelected = $state({
		id: 1,
		name: 'Moving Average',
		color: '#ffffff',
		timeframe: 7
	} as TechnicalIndicatorMenuItem | null);
</script>

<section
	class:flex={isOpen}
	class:hidden={!isOpen}
	class="w-1/2 bg-gradient-to-b rounded-md from-slate-900 text-white to-gray-900 max-md:w-11/12 fixed max-md:left-2 left-[20%] top-[20%] shadow-md shadow-slate-400"
>
	<div class="flex flex-col w-full">
		<section class="flex p-4 w-full justify-between border-b-2 border-slate-700">
			<h4 class="text-2xl text-orange-400">Technical Indicators</h4>
			<button class="hover:text-blue-500 duration-500 transition-all" onclick={() => setIsOpen()}
				>Close</button
			>
		</section>

		<section class="flex max-sm:flex-col">
			<div
				class="w-[40%] max-sm:w-full max-sm:h-[150px] max-sm:overflow-y-auto text-nowrap h-[300px] max-h-[300px] overflow-y-auto overflow-x-hidden flex p-4 flex-col items-start shadow-inner shadow-slate-600 gap-1 bg-slate-700"
			>
				{#each data as indicator, i}
					{#key i}
						<button
							onclick={() => (technicalIndicatorSelected = indicator)}
							aria-roledescription="Technical Indicator Selector"
							class:text-blue-500={technicalIndicatorSelected?.id === indicator.id}
							class="hover:cursor-pointer hover:text-blue-500 duration-500 transition-all text-lg tracking-wider"
						>
							{indicator.name}
						</button>
					{/key}
				{/each}
			</div>
			<div class="p-4 flex w-full justify-center">
				{#if !technicalIndicatorSelected}
					<p class="text-lg">Select an indicator to apply to chart.</p>
				{:else if technicalIndicatorSelected.id === 1}
					<div class="flex flex-col gap-4 text-black items-center">
						<div class="flex flex-col items-center">
							<label for="Days" class="text-white text-sm">Moving Avg Days</label>
							<CustomInput
								onchange={({ target }) => {
									handleUpdate('timeframe', target.valueAsNumber);
								}}
								inputOptions={{
									placeholder: 'Days',
									type: 'number',
									name: 'days',
									value: technicalIndicatorSelected.timeframe ?? 0
								}}
								hasError={false}
							></CustomInput>
						</div>
						<div class="flex flex-col items-center">
							<label for="Days" class="text-white text-sm">Color</label>
							<CustomInput
								inputClass={['min-w-44']}
								onchange={({ target }) => handleUpdate('color', target.value)}
								inputOptions={{
									placeholder: 'Color',
									type: 'color',
									name: 'color',
									value: technicalIndicatorSelected.color
								}}
								hasError={false}
							></CustomInput>
						</div>
					</div>
				{:else if technicalIndicatorSelected.id === 2}
					<div class="flex flex-col gap-4 text-black  text-center">
						<p class="text-white">Add RSI (this is a lower chart)</p>
            <div class="flex flex-col">
              <label for="Days" class="text-white text-sm">Days</label>
              <CustomInput
                onchange={({ target }) => {
                  handleUpdate('timeframe', target.valueAsNumber);
                }}
                inputOptions={{
                  placeholder: 'Days',
                  type: 'number',
                  name: 'days',
                  value: technicalIndicatorSelected.timeframe ?? 0
                }}
                hasError={false}
              ></CustomInput>
            </div>
					</div>
				{:else}
					<p>Invalid Selection</p>
				{/if}
			</div>
		</section>

		<section class="border-t-2 border-slate-700">
			<div class="flex w-full gap-4 justify-center py-2">
				<button
					disabled={technicalIndicatorSelected === null}
					onclick={() => {
						addIndicator(technicalIndicatorSelected);
						setIsOpen();
						$chartMAs = [...$chartMAs, technicalIndicatorSelected];
					}}
					class=" disabled:cursor-not-allowed w-28 bg-green-400 hover:bg-green-600 rounded-full text-white duration-500 transition-all pb-2 text-sm shadow-sm shadow-green-700"
					><h4 class="tracking-widest">Add</h4></button
				>
				<button
					onclick={() => setIsOpen()}
					class="w-28 bg-orange-500 hover:bg-orange-600 text-white duration-500 transition-all pb-2 text-sm shadow-sm rounded-full shadow-orange-700"
					><h4 class="tracking-widest">Close</h4></button
				>
			</div>
		</section>
	</div>
</section>
