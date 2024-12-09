<script>
	import Login from '$lib/components/Login.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Prometheus" />
</svelte:head>

<section class="min-h-screen bg-gradient-to-r from-gray-500 to-gray-900 from-5%">
	<div class="flex flex-col min-h-screen bg-gradient-to-br from-gray-400 to-transparent to-20%">
		<Login></Login>
	</div>
</section>
