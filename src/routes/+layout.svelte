<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<title>Quire</title>
</svelte:head>
<div
	class="flex bg-linear-to-br from-base-300 to-base-200 flex-col h-screen md:block md:mx-auto md:text-center md:p-4"
>
	<div class="md:mockup-phone h-full md:h-auto">
		<div class="md:mockup-phone-display bg-base-100 flex flex-col text-left h-full">
			<NavBar />

			<main class="flex-1 overflow-x-hidden overflow-y-scroll h-full">
				{@render children?.()}
			</main>
		</div>
	</div>
</div>

<style>
	main {
		scrollbar-width: 0px;
		-webkit-overflow-scrolling: touch;
	}
</style>
