<script>
	import { onMount } from 'svelte';

	export let data;

	onMount(() => {
		if (location.search.includes('userId')) {
			history.replaceState({}, document.title, location.pathname);
		}
	});

	console.log(data);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1 class="text-3xl font-bold text-center">Dashboard</h1>
</section>

<style>
</style>
