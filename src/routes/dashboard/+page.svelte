<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';
	import GAMES from '../../db/games.json';

	let newGameModal = false;

	let selectGameModal = false;

	let selectedGameToEdit: GameI;
	let copyOfSelectedGame: GameI;

	import {
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch
	} from 'flowbite-svelte';
	import { debounce, highlightMatch, transformedPublishedData } from '$utils';
	import type { GameI } from '../../types.js';

	let searchTerm = '';
	let debouncedSearchTerm = '';
	let items = GAMES;

	$: filteredItems = items
		.filter((item) => {
			const term = debouncedSearchTerm.toLowerCase();
			return (
				item.name.toLowerCase().includes(term) ||
				item.id.toString().includes(term) ||
				transformedPublishedData(item.publishedAt).toLowerCase().includes(term)
			);
		})
		.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

	export let data;

	onMount(() => {
		if (location.search.includes('userId')) {
			history.replaceState({}, document.title, location.pathname);
		}
	});

	function selectGame(id: number) {
		selectGameModal = true;
		selectedGameToEdit = items.find((item) => item.id === id) as GameI;
		copyOfSelectedGame = { ...selectedGameToEdit };
	}

	const handleSearch = debounce((value: string) => {
		debouncedSearchTerm = value;
	}, 300);

	$: handleSearch(searchTerm);
</script>

<svelte:head>
	<title>Dashboard</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="w-full flex flex-col items-center py-20" aria-label="Dashboard with Existing Games">
	<div class="flex justify-between items-center mb-12 w-full max-w-[600px]">
		<h1 class="text-3xl font-bold text-center">Dashboard</h1>
		{#if data.isLoggedIn === 'true'}
			<Button class="mb-0" on:click={() => (newGameModal = true)}>Create a new game</Button>
		{/if}
	</div>

	<div class="max-w-full overflow-auto border border-black rounded-md md:min-w-[600px]">
		<TableSearch
			divClass="w-full"
			placeholder="Search by game name, date..."
			hoverable={true}
			bind:inputValue={searchTerm}
		>
			<TableHead>
				<TableHeadCell>ID</TableHeadCell>
				<TableHeadCell>Name</TableHeadCell>
				<TableHeadCell>Date</TableHeadCell>
				<TableHeadCell>Active?</TableHeadCell>
				<TableHeadCell></TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#if filteredItems.length > 0}
					{#each filteredItems as item}
						<TableBodyRow class="border-black">
							<TableBodyCell>{@html highlightMatch(item.id, debouncedSearchTerm)}</TableBodyCell>
							<TableBodyCell>{@html highlightMatch(item.name, debouncedSearchTerm)}</TableBodyCell>
							<TableBodyCell
								>{@html highlightMatch(
									transformedPublishedData(item.publishedAt),
									debouncedSearchTerm
								)}</TableBodyCell
							>
							<TableBodyCell>{item.isActive}</TableBodyCell>
							<TableBodyCell>
								<button on:click={() => selectGame(item.id)} class="w-full text-black"
									><svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="icon icon-tabler icons-tabler-outline icon-tabler-edit"
										><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
											d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"
										/><path
											d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"
										/><path d="M16 5l3 3" /></svg
									></button
								>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				{:else}
					<TableBodyRow>
						<TableBodyCell colspan="5" class="text-center"
							>No games match your search criteria.</TableBodyCell
						>
					</TableBodyRow>
				{/if}
			</TableBody>
		</TableSearch>
	</div>

	{#if data.isLoggedIn === 'true'}
		<Modal bind:open={newGameModal} size="xs" class="w-full" autoclose outsideclose>
			<form class="flex flex-col space-y-6" action="#">
				<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create game</h3>
				<Label class="space-y-2">
					<span>Name</span>
					<Input type="text" name="name" placeholder="Game name" required />
				</Label>
				<Label class="space-y-2">
					<span>Date</span>
					<Input type="date" name="date" placeholder="Game date" required />
				</Label>
				<Label class="space-y-2">
					<span>Active?</span>
					<Checkbox>Remember me</Checkbox>
				</Label>
				<Button type="submit" class="w-full1">Save changes</Button>
			</form>
		</Modal>
	{/if}

	{#if selectedGameToEdit}
		<Modal bind:open={selectGameModal} size="xs" class="w-full" autoclose outsideclose>
			<form class="flex flex-col space-y-6" action="#">
				<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit game</h3>
				<Label class="space-y-2">
					<span>Name</span>
					<Input
						type="text"
						name="name"
						placeholder="Game name"
						value={copyOfSelectedGame.name}
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Date</span>
					<Input
						type="date"
						name="date"
						value={copyOfSelectedGame.publishedAt}
						placeholder="Game date"
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Active?</span>
					<Checkbox checked={copyOfSelectedGame.isActive}>Remember me</Checkbox>
				</Label>
				<Button type="submit" class="w-full1">Save changes</Button>
			</form>
		</Modal>
	{/if}
</section>

<style>
</style>
