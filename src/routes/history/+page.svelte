<script lang="ts">
	import type { PageData } from './$types';
	import CoverImage from '$lib/components/CoverImage.svelte';
	import { ITEMS_PER_PAGE } from '$lib/config';
	import { page } from '$app/stores';

	let { data }: { data: PageData } = $props();
	let { sessions, totalCount } = $derived(data);
	let currentPage = $derived(
		Math.floor(Number($page.url.searchParams.get('offset') || 0) / ITEMS_PER_PAGE) + 1
	);
	let book = $state({});
	const getBookDetails = async (key: string) => {
		return fetch(`https://openlibrary.org/search.json?q=key:/works/${key}&fields=*&limit=1`)
			.then((r) => r.json())
			.then((r) => r.docs[0]);
	};
	sessions.then((r) => console.log(r));
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
									<div class="rating rating-sm rating-half">
										{#each Array(10)
											.fill(0)
											.map((_, i) => (i + 1) / 2) as star}
											<div
												class="mask mask-star-2 bg-accent {star % 1 === 0
													? 'mask-half-2'
													: 'mask-half-1'}"
												aria-label="{star} star"
												aria-current={star === Math.round(session.average_rating * 2) / 2
													? 'true'
													: 'false'}
											></div>
										{/each}
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

{#if totalCount && totalCount.count > ITEMS_PER_PAGE}
	<div class="join grid grid-cols-2 w-full max-w-xs mx-auto my-4">
		<a
			href="?offset={Math.max(0, (currentPage - 2) * ITEMS_PER_PAGE)}"
			class="join-item btn btn-outline {currentPage === 1 ? 'btn-disabled' : ''}">Previous</a
		>
		<a
			href="?offset={currentPage * ITEMS_PER_PAGE}"
			class="join-item btn btn-outline {currentPage * ITEMS_PER_PAGE >= totalCount.count
				? 'btn-disabled'
				: ''}">Next</a
		>
	</div>
{/if}
