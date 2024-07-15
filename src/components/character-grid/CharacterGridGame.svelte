<script lang="ts">
	import { Tooltip } from 'flowbite-svelte';
	import type { GameI } from '$types';

	export let selectedGame: GameI;

	export let isDebug = false;

	export const NUMBER_OF_ROWS = 8;
	export const NUMBER_OF_COLUMNS = 6;

	$: coordinates = selectedGame.lettersCoordinates;

	function getColor(word: string) {
		const colors = ['#F0f0f0', '#FFC3A0', '#FF677D', '#D4A5A5', '#392F5A', '#31A2AC', '#61C0BF'];
		const index = selectedGame.words.indexOf(word);
		return colors[index % colors.length];
	}
</script>

<div class="flex flex-col items-center gap-2">
	<div class="character-grid">
		{#each coordinates as coord}
			<div
				class="character-cell"
				style="grid-column: {coord.coordinateY}; grid-row: {coord.coordinateX}; background-color: {isDebug
					? getColor(coord.word)
					: '#f0f0f0'}"
			>
				{coord.letter}
			</div>
			{#if isDebug}
				<Tooltip>
					CoordinateX: {coord.coordinateX}, CoordinateY: {coord.coordinateY}, Word: ${coord.word}
				</Tooltip>
			{/if}
		{/each}
	</div>

	<!-- {crypto.randomUUID()} -->
</div>

<style>
	.character-grid {
		display: grid;
		grid-template-columns: repeat(6, minmax(25px, 1fr));
		grid-template-rows: repeat(8, minmax(25px, 1fr));
		max-width: 450px;
		gap: 5px;
	}

	.character-cell {
		background-color: #f0f0f0;
		border: 1px solid #ccc;
		text-align: center;
		padding: 10px;
		font-size: 16px;
	}
</style>
