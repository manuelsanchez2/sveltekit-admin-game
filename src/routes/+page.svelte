<script lang="ts">
	import '../app.css';
	import { login } from '../stores/auth';
	import { goto } from '$app/navigation';
	import { USERS } from '../db/data';
	import { onMount } from 'svelte';

	const handleLogin = async () => {
		try {
			await login(USERS[0], '123456');
			goto(`/dashboard?userId=${USERS[0].id}`);
		} catch (error) {
			console.error(error);
		}
	};

	onMount(() => {
		if (location.search.includes('logged_out')) {
			history.replaceState({}, document.title, location.pathname);
		}
	});
</script>

<svelte:head>
	<title>Game Admin Panel</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<main class="main px-5">
	<h1 class="text-xl font-bold text-center mb-4">Game Admin Panel</h1>

	<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
		><path d="M0 0h512v512H0z" fill="#000" fill-opacity="1"></path><g
			class=""
			transform="translate(0,0)"
			style=""
			><path
				d="M192 64c-15.4 3.77-35.7 16.04-53 33.17-19.2 19.13-34.9 43.63-39.58 64.63l-.58 135.3.37 157.4 93.99-40.3L192 64zm128 0l-1.2 350.2 94 40.3.4-156.8-.6-135.9c-4.7-21-20.3-45.5-39.6-64.63-17.3-17.13-37.6-29.4-53-33.17zM57.24 94.67c-8.39 0-15 6.63-15 15.03 0 8.4 6.61 15 15 15s15-6.6 15-15-6.61-15.03-15-15.03zm397.56 0c-8.4 0-15 6.63-15 15.03 0 8.4 6.6 15 15 15s15-6.6 15-15-6.6-15.03-15-15.03zM35.5 142.7l-1.42 334h46l1.42-334h-46zm395 0l1.5 334h46l-1.5-334h-46zM159.2 231h18v48h-18v-48zm175.6 0h18v48h-18v-48z"
				fill="#fff"
				fill-opacity="1"
			></path></g
		></svg
	>

	<button class="button" on:click={handleLogin}>Login</button>
</main>

<style lang="postcss">
	.main {
		@apply flex flex-col items-center justify-center min-h-screen;
	}

	.icon {
		@apply w-20 h-20 mb-6;
	}

	.button {
		@apply text-sm font-semibold border cursor-pointer whitespace-nowrap leading-none transition-all active:scale-95 relative w-fit flex items-center bg-black border-transparent text-white hover:bg-gray-700 hover:border-gray-700 rounded-sm md:rounded-xl h-10 md:h-11 lg:h-[2.875rem] px-5 lg:leading-6 lg:text-base py-2;
	}
</style>
