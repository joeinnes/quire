<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import NavBar from '$lib/components/NavBar.svelte';
	let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<title>Quire</title>
</svelte:head>
<div class="flex flex-col h-screen">
	<NavBar />

	<main class="flex-1 overflow-x-hidden overflow-y-scroll">
		{@render children?.()}
	</main>
</div>

<style>
	main {
		scrollbar-width: 0px;
		-webkit-overflow-scrolling: touch;
	}
</style>
