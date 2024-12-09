<script lang="ts">
	import type { InputOptions } from '$lib/types/inputOptions';
	import type { ChangeEventHandler } from 'react';
	import type { Snippet } from 'svelte';
	import type { FocusEventHandler } from 'svelte/elements';
	let {
		hasError,
		inputOptions,
		id,
		ref = $bindable(),
		value = $bindable(),
		containerClass,
		inputClass,
		onchange,
		onfocusout,
		onfocusin,
		beforeEl,
		afterEl
	}: {
		hasError?: boolean;
		inputOptions: InputOptions;
		id?:string;
		ref?: HTMLInputElement | null;
		value?: string | number | null;
		containerClass?: string[];
		inputClass?: string[]
		onchange?: ChangeEventHandler<HTMLInputElement>;
		onfocusout?: FocusEventHandler<HTMLInputElement>;
		onfocusin?: FocusEventHandler<HTMLInputElement>;
		beforeEl?: Snippet;
		afterEl?: Snippet;
	} = $props();
</script>

<div class="shadow-md shadow-slate-800 rounded-full {containerClass}">
	<div
		class:border-4={hasError}
		class:border-red-500={hasError}
		class="bg-white gap-2 rounded-full px-4 py-1 shadow-inner shadow-neutral-700 flex items-center flex-shrink-0"
	>
		{@render beforeEl?.()}
		{#if !inputOptions.value}
			<input
				bind:this={ref}
				{id}
				name={inputOptions.name}
				autoComplete={inputOptions.autoComplete}
				{onchange}
				{onfocusout}
				{onfocusin}
				bind:value
				class="rounded-full bg-transparent text-xl w-full outline-gray-200 {inputClass}"
				type={inputOptions.type}
				placeholder={inputOptions.placeholder}
			/>
		{:else}
			<input
				bind:this={ref}
				{id}
				name={inputOptions.name}
				autoComplete={inputOptions.autoComplete}
				{onchange}
				{onfocusout}
				{onfocusin}
				value={inputOptions.value}
				class="rounded-full bg-transparent text-xl w-full outline-gray-200 {inputClass}"
				type={inputOptions.type}
				placeholder={inputOptions.placeholder}
			/>
		{/if}
		{@render afterEl?.()}
	</div>
</div>
