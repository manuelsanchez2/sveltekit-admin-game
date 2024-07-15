<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';
	import GAMES from '$db/games.json';
	import type { GameI } from '$types';

	let newGameModal = false;

	let selectGameModal = false;
	let deleteGameModal = false;

	let selectedGameToEdit: GameI | null = null;
	let mutableCopyOfSelectedGame: GameI | null = null;

	import {
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch
	} from 'flowbite-svelte';
	import { debounce, highlightMatch, transformedPublishedData } from '$utils';
	import { addToast } from '$stores/toasts';

	let searchTerm = '';
	let debouncedSearchTerm = '';
	let items = GAMES;

	$: filteredItems = items
		.filter((item) => {
			const term = debouncedSearchTerm.toLowerCase();
			return (
				item.name.toLowerCase().includes(term) ||
				item.id.includes(term) ||
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

	function selectGame(id: string) {
		selectGameModal = true;
		selectedGameToEdit = items.find((item) => item.id === id) as GameI;
		mutableCopyOfSelectedGame = { ...selectedGameToEdit };
	}

	const handleSearch = debounce((value: string) => {
		debouncedSearchTerm = value;
	}, 300);

	$: handleSearch(searchTerm);

	async function deleteGame(event: Event) {
		const form = event.target as HTMLFormElement;
		const data = new FormData(form);
		const gameId = data.get('gameId');

		await fetch(`/api/games/${gameId}`, {
			method: 'DELETE'
		});

		deleteGameModal = false;

		selectedGameToEdit = null;
		mutableCopyOfSelectedGame = null;
	}

	async function editGame(event: Event) {
		const form = event.target as HTMLFormElement;
		const data = new FormData(form);
		const gameId = data.get('gameId');
		const name = data.get('name');
		const date = data.get('date');
		const isActive = mutableCopyOfSelectedGame ? mutableCopyOfSelectedGame.isActive : false;

		console.log({ gameId, name, date, isActive });

		try {
			const response = await fetch(`/api/games/${gameId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name,
					publishedAt: date,
					isActive: isActive
				})
			});

			if (!response.ok) {
				addToast({
					message: 'Something occured, please try again later',
					type: 'error',
					dismissible: true,
					timeout: 3000
				});
				throw new Error('Something went wrong');
			} else {
				addToast({ message: 'Game was updated', type: 'info', dismissible: true, timeout: 3000 });
			}
		} catch (error) {
			console.error(error);
		}

		// selectGameModal = false;

		// selectedGameToEdit = null;
		// mutableCopyOfSelectedGame = null;
	}

	let isDisabled = true;
	$: if (selectedGameToEdit && mutableCopyOfSelectedGame) {
		isDisabled =
			mutableCopyOfSelectedGame.name === selectedGameToEdit.name &&
			mutableCopyOfSelectedGame.publishedAt === selectedGameToEdit.publishedAt &&
			mutableCopyOfSelectedGame.isActive === selectedGameToEdit.isActive;
	}

	function putGameInCopyboard(gameId: string) {
		const url = `${window.location.origin}/?gameId=${gameId}`;
		navigator.clipboard.writeText(url);
		addToast({
			message: 'URL copied to clipboard',
			type: 'info',
			dismissible: true,
			timeout: 3000
		});
	}
</script>

<svelte:head>
	<title>Dashboard</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section
	class="w-full flex flex-col items-center py-20 mx-auto max-w-full md:max-w-[500px] lg:max-w-[800px] xl:max-w-[1000px]"
	aria-label="Dashboard with Existing Games"
>
	<div class="flex flex-col gap-3 md:flex-row justify-between items-center mb-12 w-full max-w-full">
		<h1 class="text-3xl font-bold text-center">Dashboard</h1>
		{#if data.isLoggedIn === 'true'}
			<Button class="mb-0" on:click={() => (newGameModal = true)}>Create a new game</Button>
		{/if}
	</div>

	<div
		class="overflow-auto border border-black rounded-md w-full lg:min-w-[600px] xl:max-w-[1000px]"
	>
		<TableSearch
			divClass="w-full"
			placeholder="Search by game name, date..."
			hoverable={true}
			bind:inputValue={searchTerm}
		>
			<TableHead>
				<!-- <TableHeadCell>ID</TableHeadCell> -->
				<TableHeadCell>Name</TableHeadCell>
				<TableHeadCell>Date</TableHeadCell>
				<TableHeadCell>Active?</TableHeadCell>
				<TableHeadCell>View</TableHeadCell>
				<TableHeadCell>Edit</TableHeadCell>
				<TableHeadCell>Copy</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#if filteredItems.length > 0}
					{#each filteredItems as item}
						<TableBodyRow class="border-black">
							<!-- <TableBodyCell>
								{@html highlightMatch(item.id, debouncedSearchTerm)}</TableBodyCell
							> -->
							<TableBodyCell>{@html highlightMatch(item.name, debouncedSearchTerm)}</TableBodyCell>
							<TableBodyCell
								>{@html highlightMatch(
									transformedPublishedData(item.publishedAt),
									debouncedSearchTerm
								)}</TableBodyCell
							>
							<TableBodyCell>{item.isActive}</TableBodyCell>
							<TableBodyCell>
								<a target="_blank" href={`/?gameId=${item.id}`}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="icon icon-tabler icons-tabler-outline icon-tabler-eye"
										><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
											d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"
										/><path
											d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"
										/></svg
									>
								</a>
							</TableBodyCell>
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
							<TableBodyCell>
								<button on:click={() => putGameInCopyboard(item.id)} class="w-full text-black"
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
										class="icon icon-tabler icons-tabler-outline icon-tabler-link"
										><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
											d="M9 15l6 -6"
										/><path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" /><path
											d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"
										/></svg
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

	{#if selectedGameToEdit && mutableCopyOfSelectedGame}
		<Modal bind:open={selectGameModal} size="xs" class="w-full" outsideclose>
			<form on:submit|preventDefault={editGame} class="flex flex-col space-y-6">
				<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit game</h3>
				<Label class="space-y-2">
					<span>Name</span>
					<Input
						type="text"
						name="name"
						placeholder="Game name"
						bind:value={mutableCopyOfSelectedGame.name}
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Date</span>
					<Input
						type="date"
						name="date"
						bind:value={mutableCopyOfSelectedGame.publishedAt}
						placeholder="Game date"
						required
					/>
				</Label>
				<Label class="flex items-center gap-2">
					<span>Active?</span>
					<Checkbox name="isActive" bind:checked={mutableCopyOfSelectedGame.isActive}></Checkbox>
				</Label>

				<input name="gameId" hidden type="text" value={mutableCopyOfSelectedGame.id} />

				<div class="flex items-center gap-3">
					<Button
						on:click={() => {
							deleteGameModal = true;
							selectGameModal = false;
						}}
						class="w-full bg-white border border-black text-black hover:bg-gray-200 focus:bg-gray-200 hover:text-black focus:text-black"
						>Delete game</Button
					>
					<Button type="submit" disabled={isDisabled} class="w-full">Save changes</Button>
				</div>
			</form>
		</Modal>
	{/if}

	{#if deleteGameModal && mutableCopyOfSelectedGame}
		<Modal bind:open={deleteGameModal} size="xs" class="w-full" outsideclose>
			<p>
				Are you sure that you want to delete,
				<span class="font-bold">{mutableCopyOfSelectedGame.name}</span>
			</p>

			<form on:submit|preventDefault={deleteGame}>
				<input name="gameId" hidden type="text" value={mutableCopyOfSelectedGame.id} />
				<Button class="button" type="submit">Delete game</Button>
			</form>
		</Modal>
	{/if}
</section>

<style>
</style>
