<script lang="ts">
	import '$lib/styles/app.css';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import SideNavigation from '$components/side-navigation/SideNavigation.svelte';
	import { getUserById } from '$db/queries';
	import Toasts from '$components/toast/Toasts.svelte';

	export let data;
	const user = getUserById(Number(data.userId));

	onMount(() => {
		if (!data.isLoggedIn) {
			goto('/');
		}
	});
</script>

<div class="app">
	<Toasts />
	<main class="px-5 flex flex-col md:flex-row h-screen">
		<SideNavigation {user} />

		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
	}
</style>
