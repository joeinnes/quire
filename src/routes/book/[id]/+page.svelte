<script lang="ts">
	import CoverImage from '$lib/components/CoverImage.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	$inspect(data).with((type, data) => {
		// @ts-ignore
		data.bookSearch.then((r) => console.log(r));
	});

	let startDate = $state();
	let endDate = $state();
</script>

{#await data.bookSearch}
	<div class="bg-primary text-primary-content">
		<div class="w-64 p-8 pt-2 mx-auto">
			<CoverImage loading={true} disableInteractions={true} />
		</div>
	</div>

	<section class="p-4">
		<h1 class="text-3xl font-semibold">Loading...</h1>
	</section>
{:then bookSearch}
	{@const book = bookSearch.docs[0]}
	<div class="bg-primary text-primary-content">
		<div class="w-64 p-8 pt-2 mx-auto">
			<CoverImage key={book.cover_edition_key} title={book.title} disableInteractions={true} />
		</div>
	</div>

	<section class="p-4 relative">
		<div
			class="dropdown dropdown-top dropdown-end absolute top-0 right-4 transform -translate-y-[50%]"
		>
			<div tabindex="0" role="button" class="btn m-1">Click</div>
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
				<li><a>Add to shelf</a></li>
				<li><a>Remove from shelf</a></li>
			</ul>
		</div>
		<div class="text-3xl font-semibold capitalize text-pretty">
			{book.title}
		</div>
		<div class="flex items-center gap-2 my-2">
			{#each book.author_key as author_key}
				<div class="avatar">
					<div class="w-16 rounded-full">
						<img
							src="https://covers.openlibrary.org/a/olid/{author_key}-M.jpg"
							alt="Author profile"
						/>
					</div>
				</div>
			{/each}

			<div>
				<p class="text-sm uppercase opacity-60">
					{book.author_name && book.author_name[0] ? book.author_name.join(', ') : ''} - {book.first_publish_year}
				</p>
				<div class="rating rating-sm rating-half">
					{#each Array(10)
						.fill(0)
						.map((_, i) => (i + 1) / 2) as star}
						<div
							class="mask mask-star-2 bg-accent {star % 1 === 0 ? 'mask-half-2' : 'mask-half-1'}"
							aria-label="{star} star"
							aria-current={star === Math.round(book.ratings_average * 2) / 2 ? 'true' : 'false'}
						></div>
					{/each}
				</div>
				<p class="text-sm">{book.ratings_average?.toFixed(2)}</p>
			</div>
		</div>
		<div class="grid grid-cols-2 gap-2">
			<label
				>Started reading
				<input type="date" name="startDate" bind:value={startDate} class="input input-border" />
			</label>
			<label
				>Finished reading
				<input type="date" name="endDate" bind:value={endDate} class="input input-border" />
			</label>
			<label class="col-span-2">
				Your notes
				<textarea class="w-full col-span-2 textarea" placeholder="Your notes..."></textarea>
			</label>
		</div>
		<label class="flex items-center mt-2"
			><p>Your rating</p>
			<div class="rating rating-half">
				<input type="radio" name="rating-11" class="rating-hidden" />
				<input
					type="radio"
					name="rating-11"
					class="mask mask-star-2 mask-half-1 bg-accent-500"
					aria-label="0.5 star"
				/>
				<input
					type="radio"
					name="rating-11"
					class="mask mask-star-2 mask-half-2 bg-accent-500"
					aria-label="1 star"
				/>
				<input
					type="radio"
					name="rating-11"
					class="mask mask-star-2 mask-half-1 bg-accent-500"
					aria-label="1.5 star"
				/>
				<input
					type="radio"
					name="rating-11"
					class="mask mask-star-2 mask-half-2 bg-accent-500"
					aria-label="2 star"
				/>
				<input
					type="radio"
					name="rating-11"
					class="mask mask-star-2 mask-half-1 bg-accent-500"
					aria-label="2.5 star"
				/>
				<input
					type="radio"
					name="rating-11"
					class="mask mask-star-2 mask-half-2 bg-accent-500"
					aria-label="3 star"
				/>
				<input
					type="radio"
					name="rating-11"
					class="mask mask-star-2 mask-half-1 bg-accent-500"
					aria-label="3.5 star"
				/>
				<input
					type="radio"
					name="rating-11"
					class="mask mask-star-2 mask-half-2 bg-accent-500"
					aria-label="4 star"
				/>
				<input
					type="radio"
					name="rating-11"
					class="mask mask-star-2 mask-half-1 bg-accent-500"
					aria-label="4.5 star"
				/>
				<input
					type="radio"
					name="rating-11"
					class="mask mask-star-2 mask-half-2 bg-accent-500"
					aria-label="5 star"
				/>
			</div>
		</label>
	</section>

	<section class="p-4">
		<ul class="timeline timeline-vertical timeline-compact">
			<li class="w-full grid-cols-2">
				<div class="timeline-middle">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="w-5 h-5"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="timeline-end timeline-box">First Macintosh computer</div>
				<hr />
			</li>
			<li>
				<hr />
				<div class="timeline-middle">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="w-5 h-5"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="timeline-end timeline-box">iMac</div>
				<hr />
			</li>
			<li>
				<hr />
				<div class="timeline-middle">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="w-5 h-5"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="timeline-end timeline-box">iPod</div>
				<hr />
			</li>
			<li>
				<hr />
				<div class="timeline-middle">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="w-5 h-5"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="timeline-end timeline-box">iPhone</div>
				<hr />
			</li>
			<li>
				<hr />
				<div class="timeline-middle">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="w-5 h-5"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="timeline-end timeline-box">Apple Watch</div>
			</li>
		</ul>
	</section>
{/await}
