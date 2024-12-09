<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();
</script>

<div class="bg-cover bg-center bg-no-repeat bg-[url('/arizona.jpg')] h-screen">
	{@render children()}
</div>
