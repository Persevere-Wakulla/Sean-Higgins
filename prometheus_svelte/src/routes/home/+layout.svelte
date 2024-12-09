<script lang="ts">
	import { page } from '$app/stores';
	import Navbar from '$lib/components/Navbar.svelte';
	import type { Snippet } from 'svelte';
	import { blur, fade, fly } from 'svelte/transition';

	let { children }: { children: Snippet } = $props();
</script>

<Navbar></Navbar>
	<div class="pt-[56px]">
		{@render children()}
	</div>
