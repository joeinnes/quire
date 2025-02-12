<script>
	import CoverImage from '../lib/components/CoverImage.svelte';
	import debounce from 'debounce';
	import Illustration from '$lib/illustrations/Illustration.svelte';
	import { _ITEMS_PER_PAGE } from './+page';
	import { goto } from '$app/navigation';
	import Shelf from '$lib/components/Shelf.svelte';
	const searchForBook = debounce((e) => {
		e.preventDefault();
		if (e.key === 'Enter') {
			searchForBook.clear();
		}
		e.target.form.requestSubmit();
	}, 2000);
	let { data } = $props();
	let { bookList, currentlyReadingBooks, q } = $derived(data);
	const popularBooks = fetch('https://openlibrary.org/trending/daily.json?limit=20').then((r) =>
		r.json()
	);
	popularBooks.then((r) => console.log(r));
</script>

<div class="bg-primary text-primary-content">
	<h2 class="text-center text-8xl">Q</h2>
	<div class="w-1/3 py-8 mx-auto"><Illustration /></div>
</div>
{#if !q}
	<Shelf title="Currently Reading" contents={currentlyReadingBooks} />
{:else}
	{#key q}
		<!-- Reawait the promise if the search query changes -->
		{#await bookList}
			<div class="w-full mt-8 text-center">
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

				<ul class="grid w-full grid-cols-2 gap-2 mx-auto list text-accent-content">
					{#if !(bookList && bookList.docs) || bookList.docs.length === 0}
						<li class="items-center rounded-b-none list-row">
							<div class="w-full text-center">No results found</div>
						</li>
					{:else}
						{#each bookList?.docs as book (book.key)}
							<a href="/book/{book?.key.replace('/works/', '')}">
								<li class="flex flex-col items-center h-full rounded-b-none list-row">
									<CoverImage
										title={book.title}
										key={book?.cover_edition_key}
										author={book.author_name && book.author_name[0]
											? book.author_name.join(', ')
											: ''}
									/>

									<div class="text-left">
										<div class="font-semibold capitalize text-pretty">
											{book.title}
										</div>
										<div class="text-xs uppercase opacity-60">
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
						<div class="col-span-2 mx-auto my-8 join">
							<button
								class="shadow-none join-item btn disabled:bg-base-300"
								style={bookList?.offset - _ITEMS_PER_PAGE < 0
									? 'background-color: color-mix(in oklab, var(--color-base-100) 75%, transparent)'
									: ''}
								disabled={bookList?.offset - _ITEMS_PER_PAGE < 0}
								onclick={() =>
									goto(`?q=${bookList?.q}&offset=${bookList?.offset - _ITEMS_PER_PAGE}'`)}>«</button
							>
							<button class="shadow-none join-item btn"
								>Page {1 + bookList?.offset / _ITEMS_PER_PAGE} / {Math.ceil(
									bookList?.numFound / _ITEMS_PER_PAGE
								)}</button
							>
							<button
								class="shadow-none join-item btn"
								disabled={bookList?.offset + _ITEMS_PER_PAGE >= bookList?.numFound}
								style={bookList?.offset + _ITEMS_PER_PAGE >= bookList?.numFound
									? 'background-color: color-mix(in oklab, var(--color-base-100) 75%, transparent)'
									: ''}
								onclick={() =>
									goto(`?q=${bookList?.q}&offset=${bookList?.offset + _ITEMS_PER_PAGE}`)}>»</button
							>
						</div>
					{/if}
				</ul>
			</div>
		{/await}
	{/key}
{/if}

{#await popularBooks then popularBooksRes}
	{#if popularBooksRes}
		<Shelf contents={popularBooksRes.works} title="Popular Today" />
	{/if}
{/await}
