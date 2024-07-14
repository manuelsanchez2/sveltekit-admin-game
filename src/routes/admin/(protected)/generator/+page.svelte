<script lang="ts">
	import MultiselectOption from '$components/multiselect-option/MultiselectOption.svelte';
	import MultiSelect from 'svelte-multiselect';
	import { Button, Tooltip } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { MAX_CHARACTERS_PER_GAME, MAX_WORDS_PER_GAME } from '$constants';
	import CharacterGridGenerator from '$components/character-grid/CharacterGridGenerator.svelte';

	export const RANDOM_LIST_OF_WORDS: string[] = [
		'ABRUPTLY',
		'ABSURD',
		'BATH',
		'BEAUTIFUL',
		'DEVELOPMENT',
		'WATER',
		'ZEBRA'
	];

	let showGrid = false;
	let totalNumberOfCharacters = 0;
	let numberClass = 'text-red-600';
	let selectedWords: string[] = [
		RANDOM_LIST_OF_WORDS[0],
		RANDOM_LIST_OF_WORDS[1],
		RANDOM_LIST_OF_WORDS[2],
		RANDOM_LIST_OF_WORDS[3],
		RANDOM_LIST_OF_WORDS[4],
		RANDOM_LIST_OF_WORDS[5],
		RANDOM_LIST_OF_WORDS[6]
	];

	onMount(() => {
		if (location.search.includes('userId')) {
			history.replaceState({}, document.title, location.pathname);
		}

		updateTotalNumberOfCharacters(selectedWords);
	});

	function updateTotalNumberOfCharacters(selectedWords: string[]) {
		totalNumberOfCharacters = selectedWords.reduce((acc, word) => acc + word.length, 0);
		numberClass =
			totalNumberOfCharacters === MAX_CHARACTERS_PER_GAME ? 'text-green-600' : 'text-red-600';
	}

	function saveWords() {
		showGrid = true;
	}
</script>

<svelte:head>
	<title>Generator</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="w-full flex flex-col items-center py-20" aria-label="Generate a new game">
	<h1 class="text-3xl font-bold text-center">Generator</h1>

	<form on:submit|preventDefault={saveWords}>
		<div class="flex flex-col items-start gap-2 max-w-[600px] my-12">
			<label class="font-bold" for="words"> Choose the words for the game </label>
			<p>
				There is a fixed number of <strong>{MAX_WORDS_PER_GAME} words</strong> per game, and the sum
				of their characters should be <strong>{MAX_CHARACTERS_PER_GAME}</strong>.
			</p>

			<MultiSelect
				id="words"
				disabled={showGrid}
				options={RANDOM_LIST_OF_WORDS}
				placeholder="Choose or write some words..."
				allowUserOptions="append"
				maxSelect={MAX_WORDS_PER_GAME}
				bind:selected={selectedWords}
				on:change={(event) => {
					updateTotalNumberOfCharacters(selectedWords);

					// if you want to persist new user entered custom options to a database, perform
					// a fetch request with type POST here using the event.detail.option payload
					console.log(event.detail.type);
				}}
				on:add={(event) => {
					// if you want to persist new user entered custom options to a database, perform
					// a fetch request with type POST here using the event.detail.option payload
					console.log(event.detail.option);
				}}
				on:close={() => {
					// if you want to persist new user entered custom options to a database, perform
					// a fetch request with type POST here using the event.detail.option payload
					console.log('close');
				}}
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
			<Button
				type="submit"
				disabled={totalNumberOfCharacters !== MAX_CHARACTERS_PER_GAME ||
					selectedWords.length !== MAX_WORDS_PER_GAME ||
					showGrid}
				class="button w-fit">Save</Button
			>
			{#if totalNumberOfCharacters !== MAX_CHARACTERS_PER_GAME || selectedWords.length !== MAX_WORDS_PER_GAME}
				<Tooltip>
					<p>
						Please make sure you have exactly <strong>{MAX_WORDS_PER_GAME} words</strong> and their
						total number of characters is <strong>{MAX_CHARACTERS_PER_GAME}</strong>.
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
