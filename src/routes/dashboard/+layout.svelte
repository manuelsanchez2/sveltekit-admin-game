<script>
	import { goto } from '$app/navigation';
	import { isUserAuthenticated } from '$stores/auth';
	import { onMount } from 'svelte';

	import '../../app.css';
	import SideNavigation from '../../components/side-navigation/SideNavigation.svelte';
	import { getUserById } from '$db/queries';

	export let data;
	const user = getUserById(Number(data.userId));

	onMount(() => {
		if (!data.isLoggedIn) {
			goto('/');
		}
	});
</script>

<div class="app">
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
