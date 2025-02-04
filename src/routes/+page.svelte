<script>
	import NavBar from '../lib/components/NavBar.svelte';

	import CoverImage from '../lib/components/CoverImage.svelte';

	import debounce from 'debounce';
	import Illustration from '$lib/illustrations/Illustration.svelte';
	import { _ITEMS_PER_PAGE } from './+page';
	import { goto } from '$app/navigation';
	const searchForBook = debounce((e) => {
		e.preventDefault();
		if (e.key === 'Enter') {
			searchForBook.clear();
		}
		e.target.form.requestSubmit();
	}, 2000);
	let { data } = $props();
	let { bookList, q } = $derived(data);
</script>

<div class="bg-primary text-primary-content">
	<h2 class="text-center text-8xl">Q</h2>
	<div class="w-1/3 mx-auto py-8"><Illustration /></div>
</div>

{#key q}
	<!-- Reawait the promise if the search query changes -->
	{#await bookList}
		<div class="w-full text-center mt-8">
			<span class="loading loading-dots loading-md"></span>
		</div>
	{:then bookList}
		<!-- Results list -->
		<div class="px-4 my-4">
			<h2 class="text-2xl font-semibold">
				Results {#if bookList && bookList.docs}<span class="badge badge-soft badge-primary">
						Page {1 + bookList?.offset / _ITEMS_PER_PAGE} / {Math.ceil(
							bookList?.numFound / _ITEMS_PER_PAGE
						)}
					</span>
				{/if}
			</h2>

			<ul class="list text-accent-content w-full mx-auto grid grid-cols-2 gap-2">
				{#if !(bookList && bookList.docs) || bookList.docs.length === 0}
					<li class="list-row items-center rounded-b-none">
						<div class="text-center w-full">No results found</div>
					</li>
				{:else}
					{#each bookList?.docs as book (book.key)}
						<a href="/book/{book?.key.replace('/works/', '')}">
							<li class="list-row items-center rounded-b-none flex flex-col h-full">
								<CoverImage
									title={book.title}
									key={book?.cover_edition_key}
									author={book.author_name && book.author_name[0]}
								/>

								<div class="text-left">
									<div class="text-pretty font-semibold capitalize">
										{book.title}
									</div>
									<div class="text-xs uppercase opacity-60">
										{book.author_name && book.author_name[0]} - {book.first_publish_year}
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
												aria-current={star === Math.round(book.ratings_average * 2) / 2
													? 'true'
													: 'false'}
											></div>
										{/each}
									</div>
									<p class="text-sm">{book.ratings_average?.toFixed(2)}</p>
								</div>
							</li>
						</a>
					{/each}
					<div class="join my-8 mx-auto col-span-2">
						<button
							class="join-item btn disabled:bg-base-300 shadow-none"
							style={bookList?.offset - _ITEMS_PER_PAGE < 0
								? 'background-color: color-mix(in oklab, var(--color-base-100) 75%, transparent)'
								: ''}
							disabled={bookList?.offset - _ITEMS_PER_PAGE < 0}
							onclick={() =>
								goto(`?q=${bookList?.q}&offset=${bookList?.offset - _ITEMS_PER_PAGE}'`)}>«</button
						>
						<button class="join-item btn shadow-none"
							>Page {1 + bookList?.offset / _ITEMS_PER_PAGE} / {Math.ceil(
								bookList?.numFound / _ITEMS_PER_PAGE
							)}</button
						>
						<button
							class="join-item btn shadow-none"
							disabled={bookList?.offset + _ITEMS_PER_PAGE >= bookList?.numFound}
							style={bookList?.offset + _ITEMS_PER_PAGE >= bookList?.numFound
								? 'background-color: color-mix(in oklab, var(--color-base-100) 75%, transparent)'
								: ''}
							onclick={() => goto(`?q=${bookList?.q}&offset=${bookList?.offset + _ITEMS_PER_PAGE}`)}
							>»</button
						>
					</div>
				{/if}
			</ul>
		</div>
	{/await}
{/key}
