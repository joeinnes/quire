<script lang="ts">
	import CoverImage from './CoverImage.svelte';

	const { contents = [], title = '' } = $props();
	const covers = contents.map(async (el) => {
		try {
			const coverSearch = await fetch(
				`https://openlibrary.org/search.json?q=key:/works/${el.book_id}&fields=cover_edition_key&limit=1`
			);
			const json = await coverSearch.json();
			const coverKey = json.docs[0].cover_edition_key;
			return { ...el, coverKey };
		} catch (e) {
			return { ...el, coverKey: null };
		}
	});
</script>

<section class="p-2">
	<h3 class="font-semibold text-lg">{title}</h3>
	<div class="h-auto pb-4 mb-4 flex gap-4">
		<div class="carousel space-x-4 h-auto overflow-x-scroll">
			{#each covers as book}
				{#await book then book}
					<div class="carousel-item">
						<a class="w-30" href="/book/{book.book_id || book.key.replace('/works/', '')}">
							<CoverImage
								{...book}
								key={book.coverKey || book.cover_edition_key}
								title={book.title}
								author={book?.author_name ? book.author_name[0] : ''}
							/>
							{#if book.title}
								<div class="font-semibold capitalize text-pretty">
									{book.title}
								</div>
							{/if}
							{#if book.author_name || book.first_publish_year}
								<div class="text-xs uppercase opacity-60">
									{#if book.author_name}
										{book.author_name && book.author_name[0] ? book.author_name.join(', ') : ''} -
									{/if}{#if book.first_publish_year}&nbsp;
										{book.first_publish_year}{/if}
								</div>
							{/if}
						</a>
					</div>
				{/await}
			{/each}
		</div>
	</div>
</section>
