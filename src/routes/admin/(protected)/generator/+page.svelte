<script lang="ts">
	import MultiselectOption from '$components/multiselect-option/MultiselectOption.svelte';
	import MultiSelect from 'svelte-multiselect';
	import { Button, Tooltip } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { MAX_CHARACTERS_PER_GAME, MAX_WORDS_PER_GAME, MIN_WORDS_PER_GAME } from '$constants';
	import CharacterGridGenerator from '$components/character-grid/CharacterGridGenerator.svelte';

	export const DEFAULT_WORDS: string[] = [
		'ABRUPTLY',
		'ABSURD',
		'BATH',
		'BEAUTIFUL',
		'DEVELOPMENT',
		'WATER',
		'zebra'
	];

	let showGrid = false;
	let totalNumberOfCharacters = 0;
	let numberClass = 'text-red-600';
	let selectedWords: string[] = [
		DEFAULT_WORDS[0],
		DEFAULT_WORDS[1],
		DEFAULT_WORDS[2],
		DEFAULT_WORDS[3],
		DEFAULT_WORDS[4],
		DEFAULT_WORDS[5],
		DEFAULT_WORDS[6]
	].map((word) => word.toUpperCase());

	onMount(() => {
		if (location.search.includes('userId')) {
			history.replaceState({}, document.title, location.pathname);
		}

		updateTotalNumberOfCharacters(selectedWords);
	});

	function updateTotalNumberOfCharacters(selectedWords: string[]) {
		selectedWords.map((word) => word.toUpperCase());
		totalNumberOfCharacters = selectedWords.reduce((acc, word) => acc + word.length, 0);
		numberClass =
			totalNumberOfCharacters === MAX_CHARACTERS_PER_GAME ? 'text-green-600' : 'text-red-600';
	}

	function saveWords() {
		showGrid = true;
	}

	function handleWordsChange() {
		// Convert the selected words to uppercase
		selectedWords.map((word) => word.toUpperCase());
		updateTotalNumberOfCharacters(selectedWords);
	}
</script>

<svelte:head>
	<title>Generator</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="w-full flex flex-col items-center py-20" aria-label="Generate a new game">
	<h1 class="text-3xl font-bold text-center">Generator</h1>
	<p>Not working properly!</p>

	<form on:submit|preventDefault={saveWords}>
		<div class="flex flex-col items-start gap-2 max-w-[600px] my-12">
			<label class="font-bold" for="words"> Choose the words for the game </label>
			<p>
				There is always between <strong>{MIN_WORDS_PER_GAME} and {MAX_WORDS_PER_GAME} words</strong>
				per game, and the sum of their characters should be
				<strong>{MAX_CHARACTERS_PER_GAME}</strong>.
			</p>

			<MultiSelect
				id="words"
				disabled={showGrid}
				options={DEFAULT_WORDS}
				placeholder="Choose or write some words..."
				allowUserOptions="append"
				maxSelect={MAX_WORDS_PER_GAME}
				bind:selected={selectedWords}
				on:change={handleWordsChange}
				required
			>
				<MultiselectOption let:idx {idx} let:option {option} slot="selected" />
				<MultiselectOption let:idx {idx} let:option {option} slot="option" />
			</MultiSelect>

			<span aria-live="polite"
				>Total number of characters: <span class={numberClass}>{totalNumberOfCharacters} / 48</span
				></span
			>
		</div>

		<div class="flex justify-center mb-8">
			{#if showGrid}
				<Button
					type="button"
					class="button w-fit"
					on:click={() => {
						showGrid = false;
						selectedWords = [
							DEFAULT_WORDS[0],
							DEFAULT_WORDS[1],
							DEFAULT_WORDS[2],
							DEFAULT_WORDS[3],
							DEFAULT_WORDS[4],
							DEFAULT_WORDS[5],
							DEFAULT_WORDS[6]
						].map((word) => word.toUpperCase());
						updateTotalNumberOfCharacters(selectedWords);
					}}
				>
					Reset
				</Button>
			{:else}
				<Button
					type="submit"
					disabled={totalNumberOfCharacters !== MAX_CHARACTERS_PER_GAME ||
						selectedWords.length > MAX_WORDS_PER_GAME ||
						selectedWords.length < MIN_WORDS_PER_GAME ||
						showGrid}
					class="button w-fit">Save</Button
				>
			{/if}

			{#if totalNumberOfCharacters !== MAX_CHARACTERS_PER_GAME || selectedWords.length > MAX_WORDS_PER_GAME || selectedWords.length < MIN_WORDS_PER_GAME}
				<Tooltip>
					<p>
						Please make sure you have exactly between <strong
							>{MIN_WORDS_PER_GAME} and {MAX_WORDS_PER_GAME} words</strong
						>
						and their total number of characters is <strong>{MAX_CHARACTERS_PER_GAME}</strong>.
					</p>
				</Tooltip>
			{/if}
		</div>

		{#if showGrid}
			<div class="justify-center mx-auto flex">
				<CharacterGridGenerator isDebug={true} {selectedWords} />
			</div>
		{/if}
	</form>
</section>

<style>
</style>
