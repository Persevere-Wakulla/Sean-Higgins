<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
	let height: number = $state(0);
</script>

<svelte:window bind:innerHeight={height} />
{@render children()}
