<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import './styles.css';
	import { setClient } from 'svelte-apollo-wrappers';
	import { apolloStore } from '$lib/stores/chartStore';
	import { Toaster } from 'svelte-french-toast';
	import { page } from '$app/stores';

	let { children }: { children: Snippet } = $props();

	onMount(() => {
		apolloStore.subscribe((client) => {
			setClient(client);
		});
	});
</script>

<Toaster></Toaster>
{#key $page.url.pathname}
<main
	class="bg-gradient-to-br bg-fixed from-black to-gray-700 from-40% min-h-screen overflow-x-hidden"
>
	{@render children()}
</main>
{/key}