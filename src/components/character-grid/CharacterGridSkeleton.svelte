<script>
	const NUMBER_OF_ROWS = 8;
	const NUMBER_OF_COLUMNS = 6;
</script>

<div class="flex flex-col items-center gap-2">
	<div class="character-grid">
		{#each Array.from({ length: NUMBER_OF_ROWS * NUMBER_OF_COLUMNS }) as _, i}
			<div
				style="background-color: #f0f0f0; grid-column: {(i % NUMBER_OF_COLUMNS) +
					1}; grid-row: {Math.floor(i / NUMBER_OF_COLUMNS) + 1}"
				class="character-cell animate-pulse bg-slate-700"
			>
				<span class="opacity-0">0</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.character-grid {
		display: grid;
		grid-template-columns: repeat(6, minmax(30px, 1fr));
		grid-template-rows: repeat(8, minmax(30px, 1fr));
		min-width: 235px;
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
