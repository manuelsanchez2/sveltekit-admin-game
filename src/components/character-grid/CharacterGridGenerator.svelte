<script lang="ts">
	import { Button, Tooltip } from 'flowbite-svelte';

	export let selectedWords: string[];
	export let isDebug = false;

	interface CharacterI {
		char: string;
		word: string;
	}

	interface CoordinateI {
		id: number;
		letter: string;
		coordinateX: number;
		coordinateY: number;
		word: string;
	}

	let characters: CharacterI[] = [];
	let coordinates: CoordinateI[] = [];

	// Flatten the selected words into an array of objects with character and word properties
	$: characters = selectedWords.flatMap((word) => word.split('').map((char) => ({ char, word })));

	// Compute coordinates for each character
	$: coordinates = characters.map((item, index) => {
		const coordinateX = (index % 8) + 1;
		const coordinateY = Math.floor(index / 8) + 1;
		return {
			id: index + 1,
			letter: item.char,
			coordinateX,
			coordinateY,
			word: item.word
		};
	});

	function downloadJSON() {
		const json = JSON.stringify(coordinates, null, 2);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'coordinates.json';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	function downloadCSV() {
		const csv = coordinates
			.map(
				(coord) =>
					`${coord.id},${coord.letter},${coord.coordinateX},${coord.coordinateY},${coord.word}`
			)
			.join('\n');
		const header = 'id,letter,coordinateX,coordinateY,word\n';
		const blob = new Blob([header + csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'coordinates.csv';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	function getColor(word: string) {
		const colors = ['#F0f0f0', '#FFC3A0', '#FF677D', '#D4A5A5', '#392F5A', '#31A2AC', '#61C0BF'];
		const index = selectedWords.indexOf(word);
		return colors[index % colors.length];
	}
</script>

<div class="flex flex-col items-center gap-2">
	<div class="character-grid">
		{#each characters as item, index}
			<div
				class="character-cell"
				style="background-color: {isDebug ? getColor(item.word) : '#f0f0f0'}"
			>
				{item.char}
			</div>
			{#if isDebug}
				<Tooltip>
					CoordinateX: {(index % 8) + 1}, CoordinateY: {Math.floor(index / 8) + 1}, Word: {item.word}
				</Tooltip>
			{/if}
		{/each}
	</div>

	{#if isDebug}
		<div class="download-buttons">
			<Button on:click={downloadJSON}>Download JSON</Button>
			<Button on:click={downloadCSV}>Download CSV</Button>
		</div>
	{/if}
</div>

<style>
	.character-grid {
		display: grid;
		grid-template-columns: repeat(8, minmax(20px, 1fr));
		max-width: 400px;
		gap: 5px;
	}

	.character-cell {
		background-color: #f0f0f0;
		border: 1px solid #ccc;
		text-align: center;
		padding: 10px;
		font-size: 16px;
	}

	.download-buttons {
		margin-top: 20px;
		display: flex;
		gap: 10px;
	}
</style>
