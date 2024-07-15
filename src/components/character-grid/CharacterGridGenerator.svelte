<script lang="ts">
	import { Button, Tooltip } from 'flowbite-svelte';

	export let selectedWords: string[];
	export let isDebug = false;

	export const NUMBER_OF_ROWS = 8;
	export const NUMBER_OF_COLUMNS = 6;

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

	const directions = [
		{ x: 1, y: 0 }, // right
		{ x: 0, y: 1 }, // down
		{ x: -1, y: 0 }, // left
		{ x: 0, y: -1 }, // up,
		{ x: 1, y: 1 }, // diagonal down-right
		{ x: -1, y: 1 }, // diagonal down-left
		{ x: 1, y: -1 }, // diagonal up-right
		{ x: -1, y: -1 } // diagonal up-left
	];

	// function placeWords(words: string[]) {
	// 	const grid: string[][] = Array.from({ length: NUMBER_OF_ROWS }, () =>
	// 		Array(NUMBER_OF_COLUMNS).fill('')
	// 	);
	// 	const wordCoordinates: CoordinateI[] = [];

	// 	function canPlaceWord(
	// 		word: string,
	// 		startX: number,
	// 		startY: number,
	// 		direction: { x: number; y: number }
	// 	) {
	// 		for (let i = 0; i < word.length; i++) {
	// 			const x = startX + i * direction.x;
	// 			const y = startY + i * direction.y;
	// 			if (
	// 				x < 0 ||
	// 				x >= NUMBER_OF_COLUMNS ||
	// 				y < 0 ||
	// 				y >= NUMBER_OF_ROWS ||
	// 				(grid[y][x] && grid[y][x] !== word[i])
	// 			) {
	// 				return false;
	// 			}
	// 		}
	// 		return true;
	// 	}

	// 	function placeWord(
	// 		word: string,
	// 		startX: number,
	// 		startY: number,
	// 		direction: { x: number; y: number }
	// 	) {
	// 		for (let i = 0; i < word.length; i++) {
	// 			const x = startX + i * direction.x;
	// 			const y = startY + i * direction.y;
	// 			grid[y][x] = word[i];
	// 			wordCoordinates.push({
	// 				id: wordCoordinates.length + 1,
	// 				letter: word[i],
	// 				coordinateX: x + 1,
	// 				coordinateY: y + 1,
	// 				word
	// 			});
	// 		}
	// 	}

	// 	function tryPlaceWords(words: string[], currentWordIndex = 0): boolean {
	// 		if (currentWordIndex >= words.length) {
	// 			return true; // All words placed successfully
	// 		}
	// 		const word = words[currentWordIndex];
	// 		for (let y = 0; y < NUMBER_OF_ROWS; y++) {
	// 			for (let x = 0; x < NUMBER_OF_COLUMNS; x++) {
	// 				for (const direction of directions) {
	// 					if (canPlaceWord(word, x, y, direction)) {
	// 						const originalCoordinates = [...wordCoordinates];
	// 						placeWord(word, x, y, direction);
	// 						if (tryPlaceWords(words, currentWordIndex + 1)) {
	// 							return true; // Successfully placed all words
	// 						}
	// 						// If placement of remaining words failed, backtrack
	// 						for (let i = originalCoordinates.length; i < wordCoordinates.length; i++) {
	// 							const coord = wordCoordinates[i];
	// 							grid[coord.coordinateY - 1][coord.coordinateX - 1] = '';
	// 						}
	// 						wordCoordinates.splice(originalCoordinates.length);
	// 					}
	// 				}
	// 			}
	// 		}
	// 		return false; // Failed to place current word
	// 	}

	// 	tryPlaceWords(words);
	// 	return wordCoordinates;
	// }
	// Flatten the selected words into an array of objects with character and word properties
	$: characters = selectedWords.flatMap((word) => word.split('').map((char) => ({ char, word })));

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

	// $: coordinates = placeWords(selectedWords);

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
		{#each coordinates as coord}
			<div
				class="character-cell"
				style="background-color: {isDebug ? getColor(coord.word) : '#f0f0f0'}"
			>
				{coord.letter.toUpperCase()}
			</div>
			{#if isDebug}
				<Tooltip>
					CoordinateX: {coord.coordinateX}, CoordinateY: {coord.coordinateY}, Word: ${coord.word}
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

	.download-buttons {
		margin-top: 20px;
		display: flex;
		gap: 10px;
	}
</style>
