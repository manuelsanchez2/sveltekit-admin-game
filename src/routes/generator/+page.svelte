<script>
	import { onMount } from 'svelte';

	onMount(() => {
		if (location.search.includes('userId')) {
			history.replaceState({}, document.title, location.pathname);
		}
	});
</script>

<svelte:head>
	<title>Generator</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="w-full flex flex-col items-center py-20" aria-label="Generate a new game">
	<h1 class="text-3xl font-bold text-center">Generator</h1>
	<p>Coming soon...</p>
</section>

<style>
</style>
