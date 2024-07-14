<script lang="ts">
	import type { UserI } from '../../types';
	import { afterNavigate, goto } from '$app/navigation';
	import { logout } from '$stores/auth';
	import { onMount } from 'svelte';
	export let user: UserI = {} as UserI;
	let path = '';

	const handleLogout = async () => {
		try {
			await logout();
			goto('/admin?logged_out=true');
		} catch (error) {
			console.error(error);
		}
	};

	onMount(() => {
		path = window.location.pathname;
	});

	afterNavigate(() => {
		path = window.location.pathname;
	});
</script>

<aside
	class="border border-transparent border-b-black md:border-r-black md:border-b-transparent py-12 md:py-20 pr-5 mr-5 md:w-[200px]"
>
	<nav class="flex justify-center md:justify-start md:flex-col flex-1 h-full gap-5">
		<a
			class={`flex items-center gap-2 hover:scale-105 focus:scale-105 ${path == '/admin/dashboard' ? 'font-bold pointer-events-none' : ''}`}
			href="dashboard"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="icon icon-tabler icons-tabler-outline icon-tabler-table"
				><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
					d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z"
				/><path d="M3 10h18" /><path d="M10 3v18" /></svg
			>
			<span>Dashboard</span>
		</a>
		{#if user.role === 'admin'}
			<a
				class={`flex items-center gap-2 hover:scale-105 focus:scale-105 ${path == '/admin/generator' ? 'font-bold pointer-events-none' : ''}`}
				href="generator"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="icon icon-tabler icons-tabler-outline icon-tabler-dice-2"
					><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
						d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"
					/><circle cx="9.5" cy="9.5" r=".5" fill="currentColor" /><circle
						cx="14.5"
						cy="14.5"
						r=".5"
						fill="currentColor"
					/></svg
				>
				<span>Game Generator</span>
			</a>
		{/if}

		<button
			on:click={handleLogout}
			class="flex items-center gap-2 mt-auto opacity-70 hover:scale-105 focus:scale-105 hover:opacity-100 focus:opacity-100"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="icon icon-tabler icons-tabler-outline icon-tabler-logout"
				><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
					d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"
				/><path d="M9 12h12l-3 -3" /><path d="M18 15l3 -3" /></svg
			>
			<span>Logout</span>
		</button>
	</nav>
</aside>
