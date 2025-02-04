<script lang="ts">
	import CoverImage from '$lib/components/CoverImage.svelte';
	import type { PageData } from '../$types';

	let { data }: { data: PageData } = $props();
	$effect(() => {});
</script>

{#await data.bookSearch}
	<div class="bg-primary text-primary-content">
		<div class="w-64 p-8 pt-2 mx-auto">
			<CoverImage loading="true" />
		</div>
	</div>

	<section class="p-4">
		<h1 class="text-3xl font-semibold">Loading...</h1>
	</section>
{:then bookSearch}
	{@const book = bookSearch.docs[0]}
	<div class="bg-primary text-primary-content">
		<div class="w-64 p-8 pt-2 mx-auto">
			<CoverImage key={book.cover_edition_key} title={book.title} />
		</div>
	</div>

	<section class="p-4">
		<h1 class="text-3xl font-semibold">{book.title}</h1>
	</section>
{/await}
