<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import CoverImage from '$lib/components/CoverImage.svelte';
	import type { EventHandler } from 'svelte/elements';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let { db, reading_sessions } = $derived(data);
	$inspect(data).with((type, data) => {
		// @ts-ignore
		data.bookSearch.then((r) => console.log(r));
		if (data.reading_sessions) data.reading_sessions.then((r) => console.log(r));
	});

	const addReadingSession: EventHandler<SubmitEvent, HTMLFormElement> = async (e) => {
		if (!data.user) throw new Error('User not found');
		if (!e.target) throw new Error('How did you call this without a target?!');
		e.preventDefault();

		const formData = new FormData(e.target);
		const fields: Record<string, string> = {};

		for (const [key, value] of formData.entries()) {
			if (value instanceof File) {
				// If file input has content, throw an error.
				if (value.size > 0) {
					throw new Error(`Invalid form field "${key}": file uploads are not allowed.`);
				}
				// Otherwise, treat an empty file as an empty string.
				fields[key] = '';
			} else if (typeof value === 'string') {
				fields[key] = value;
			} else {
				throw new Error(`Invalid form field "${key}": expected a string.`);
			}
		}

		// Assuming data.bookSearch exists and returns a search result with a docs array.
		const book = (await data.bookSearch).docs[0];

		// Convert the rating field to a number if necessary.
		const rating = fields['rating'] ? parseFloat(fields['rating']) : null;

		if (!fields['startDate'] && !fields['endDate'] && !fields['rating'] && !fields['notes'])
			throw new Error('What are you doing? No fields provided.');
		const values = {
			id: crypto.randomUUID(),
			book_id: book.key.replace('/works/', ''),
			started_at: fields['startDate'],
			finished_at: fields['endDate'],
			notes: fields['notes'],
			rating,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			user_id: data.user.id
		};
		await db?.insertInto('reading_sessions').values(values).execute();
		invalidateAll();
	};

	const deleteSession = async (id: string) => {
		await db?.deleteFrom('reading_sessions').where('id', '=', id).executeTakeFirstOrThrow();
		invalidateAll();
	};
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
				<li><button>Add to shelf</button></li>
				<li><button>Remove from shelf</button></li>
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
							src="/api/proxy?url=https://covers.openlibrary.org/a/olid/{author_key}-M.jpg"
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
		<form onsubmit={addReadingSession}>
			<div class="grid grid-cols-2 gap-2">
				<label
					>Started reading
					<input type="date" name="startDate" class="input input-border" />
				</label>
				<label
					>Finished reading
					<input type="date" name="endDate" class="input input-border" />
				</label>
				<label class="col-span-2">
					Your notes
					<textarea class="w-full col-span-2 textarea" placeholder="Your notes..." name="notes"
					></textarea>
				</label>
			</div>
			<label class="flex items-center mt-2"
				><p>Your rating</p>
				<div class="rating rating-half">
					<input type="radio" name="rating" class="rating-hidden" />
					<input
						type="radio"
						name="rating"
						value={0.5}
						class="mask mask-star-2 mask-half-1 bg-accent-500"
						aria-label="0.5 star"
					/>
					<input
						type="radio"
						name="rating"
						value={1}
						class="mask mask-star-2 mask-half-2 bg-accent-500"
						aria-label="1 star"
					/>
					<input
						type="radio"
						name="rating"
						value={1.5}
						class="mask mask-star-2 mask-half-1 bg-accent-500"
						aria-label="1.5 star"
					/>
					<input
						type="radio"
						name="rating"
						value={2}
						class="mask mask-star-2 mask-half-2 bg-accent-500"
						aria-label="2 star"
					/>
					<input
						type="radio"
						name="rating"
						value={2.5}
						class="mask mask-star-2 mask-half-1 bg-accent-500"
						aria-label="2.5 star"
					/>
					<input
						type="radio"
						name="rating"
						value={3}
						class="mask mask-star-2 mask-half-2 bg-accent-500"
						aria-label="3 star"
					/>
					<input
						type="radio"
						name="rating"
						value={3.5}
						class="mask mask-star-2 mask-half-1 bg-accent-500"
						aria-label="3.5 star"
					/>
					<input
						type="radio"
						name="rating"
						value={4}
						class="mask mask-star-2 mask-half-2 bg-accent-500"
						aria-label="4 star"
					/>
					<input
						type="radio"
						name="rating"
						value={4.5}
						class="mask mask-star-2 mask-half-1 bg-accent-500"
						aria-label="4.5 star"
					/>
					<input
						type="radio"
						name="rating"
						value={5}
						class="mask mask-star-2 mask-half-2 bg-accent-500"
						aria-label="5 star"
					/>
				</div>
			</label>
			<button class="btn btn-primary" type="submit">Submit</button>
		</form>
	</section>

	{#await reading_sessions then sessions}
		<section class="p-4">
			<ul class="timeline timeline-vertical timeline-compact">
				{#if sessions}
					{#each sessions as session}
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
							<div class="timeline-end w-full">
								<time class="font-bold">
									{new Intl.DateTimeFormat().format(
										new Date(session.started_at || session.created_at)
									)}</time
								>{#if session.finished_at}–<time class="font-bold"
										>{new Intl.DateTimeFormat().format(new Date(session.finished_at))}</time
									>{/if}
								<div class="flex justify-between items-center">
									{#if session.rating}
										<div class="rating rating-sm rating-half">
											{#each Array(10)
												.fill(0)
												.map((_, i) => (i + 1) / 2) as star}
												<div
													class="mask mask-star-2 bg-accent {star % 1 === 0
														? 'mask-half-2'
														: 'mask-half-1'}"
													aria-label="{star} star"
													aria-current={star === Math.round(session.rating * 2) / 2
														? 'true'
														: 'false'}
												></div>
											{/each}
										</div>{/if}<button
										class="btn btn-error"
										onclick={() => deleteSession(session.id)}>Delete</button
									>
								</div>
								<p class="text-sm">
									{#if session.notes}
										{session.notes}
									{:else if session.started_at && session.finished_at}
										Read {book.title}
									{:else if session.started_at}
										Started {book.title}
									{:else if session.finished_at}
										Started {book.title}
									{/if}
								</p>
							</div>

							{#if sessions.length > 1}<hr />{/if}
						</li>
					{/each}
				{/if}
			</ul>
		</section>
	{/await}
{/await}
