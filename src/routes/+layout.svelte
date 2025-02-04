<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import NavBar from '$lib/components/NavBar.svelte';
	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<svelte:head>
	<title>Quire</title>
</svelte:head>
<div class="flex flex-col h-screen">
	<NavBar />
	<main class="flex-1 overflow-y-scroll overflow-x-hidden">
		{@render children?.()}
	</main>
</div>

<style>
	main {
		scrollbar-width: 0px;
		-webkit-overflow-scrolling: touch;
	}
</style>
