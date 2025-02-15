<script lang="ts">
	import type { PageData } from './$types';
	import CoverImage from '$lib/components/CoverImage.svelte';

	let { data }: { data: PageData } = $props();
	let { sessions } = $derived(data);
	let book = $state({});
	const getBookDetails = async (key: string) => {
		return fetch(`https://openlibrary.org/search.json?q=key:/works/${key}&fields=*&limit=1`)
			.then((r) => r.json())
			.then((r) => r.docs[0]);
	};
</script>

<section class="p-2">
	<h1 class="text-3xl font-semibold mb-4">Reading History</h1>

	{#await sessions then sessions}
		{#if sessions}
			<ul class="list">
				{#each sessions as session}
					{#await getBookDetails(session.book_id) then book}
						<li>
							<a href="/book/{session.book_id}" class="list-row gap-6">
								<div class="w-16"><CoverImage key={book.cover_edition_key} /></div>
								<div>
									<div class="font-semibold capitalize text-pretty">
										{book.title}
									</div>
									<div class="text-xs uppercase font-semibold opacity-60">
										{book.author_name && book.author_name[0] ? book.author_name.join(', ') : ''} -
										{book.first_publish_year}
									</div>
									<p class="list-col-wrap">
										{#if session.most_recent_finished}
											You've read this book {session.total_reads} time{session.total_reads !== 1
												? 's'
												: ''}, last time you finished was {new Intl.DateTimeFormat().format(
												new Date(session.most_recent_finished)
											)}
										{:else}
											You started this on {new Intl.DateTimeFormat().format(
												new Date(session.started_at)
											)}, and you haven't finished yet. {#if session.total_reads === 1}This is your
												first time reading this book.{:else}
												You've read this book {session.total_reads - 1} time{session.total_reads -
													1 !==
												1
													? 's'
													: ''} before.{/if}
										{/if}
									</p>
								</div>
							</a>
						</li>
					{/await}
				{/each}
			</ul>
		{/if}
	{/await}
</section>
