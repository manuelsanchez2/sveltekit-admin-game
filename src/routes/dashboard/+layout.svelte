<script>
	import { goto } from '$app/navigation';
	import { isUserAdmin, isUserAuthenticated } from '$stores/auth';
	import { onMount } from 'svelte';

	console.log(isUserAdmin());
	console.log(isUserAuthenticated());

	import '../../app.css';
	import SideNavigation from '../../components/side-navigation/SideNavigation.svelte';

	onMount(() => {
		if (!isUserAuthenticated()) {
			goto('/');
		}
	});
</script>

<div class="app">
	<main class="px-5 flex flex-col md:flex-row h-screen">
		<SideNavigation />

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
