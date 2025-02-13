<script lang="ts">
	import { goto } from '$app/navigation';
	import '$lib/styles/app.css';
	import { onMount } from 'svelte';
	import { getGameById } from '$db/queries';
	import CharacterGridGame from '$components/character-grid/CharacterGridGame.svelte';
	import type { GameI } from '$types';
	import CharacterGridSkeleton from '$components/character-grid/CharacterGridSkeleton.svelte';
	export let data;
	if (!data) {
		throw new Error('No data provided');
	}
	const { games } = data;

	let isMounted = false;

	let selectedGameId: string;
	let selectedGame: GameI | null | undefined = null;

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const gameIdParam = urlParams.get('gameId');
		if (gameIdParam) {
			selectedGameId = gameIdParam;
		} else {
			selectedGameId = games[0].id;
		}
		isMounted = true;
	});

	function updateUrl(gameId: string) {
		goto(`/?gameId=${gameId}`, { replaceState: true });
	}

	$: if (isMounted && selectedGameId !== null) {
		selectedGame = getGameById(games, selectedGameId);
	}

	$: if (selectedGameId !== null) {
		if (isMounted) updateUrl(selectedGameId);
	}
</script>

<svelte:head>
	<title>Games</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<main class="relative main px-5">
	<a href="/admin" class="flex items-center gap-2 !absolute top-4 right-4 opacity-80">
		<svg
			class="size-5"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
				d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"
			/><path
				d="M3 12m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"
			/><path d="M7 8l0 .01" /><path d="M7 16l0 .01" /></svg
		>
		<span> To Admin View </span>
	</a>

	<h1 class="text-xl font-bold text-center mb-4">Games</h1>
	<p>Enjoy this amazing list of games!</p>

	<select class="my-12" bind:value={selectedGameId} on:change={() => updateUrl(selectedGameId)}>
		<option value="" disabled selected>Select a game</option>
		{#each games as game}
			<option value={game.id}>{game.name}</option>
		{/each}
	</select>

	<small class="mb-8">Not playable yet, we are working on it!</small>

	{#if selectedGame !== null && selectedGame !== undefined}
		<!-- // It should read not the debug, but the final one with the coordinates set and gneerated  -->
		<CharacterGridGame {selectedGame} />
	{:else}
		<CharacterGridSkeleton />
	{/if}
</main>

<style lang="postcss">
	.main {
		@apply flex flex-col items-center justify-center min-h-screen;
	}
</style>
