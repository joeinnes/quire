<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import type { Database, Shelf } from '$lib/db/types';
	import type { Kysely } from 'kysely';
	let { modal = $bindable(), key = '', shelfId = '' } = $props();
	const user_id = $derived(page.data.user.id);
	const db: Kysely<Database> = $derived(page.data.db);
	let shelves: Shelf[] | [] = $state([]);
	let bookShelves: Shelf[] | [] = $state([]);
	$effect(() => {
		updateShelves();
		updateBookShelves();
	});
	const updateShelves = async () => {
		shelves = await db.selectFrom('shelves').where('user_id', '=', user_id).selectAll().execute();
	};
	const updateBookShelves = async () => {
		bookShelves = await db
			.selectFrom('shelf_books')
			.innerJoin('shelves', 'shelves.id', 'shelf_books.shelf_id')
			.where('shelf_books.book_id', '=', key.replace('/works/', ''))
			.where('shelves.user_id', '=', user_id)
			.selectAll('shelves')
			.execute();
	};
	const removeFromShelf = async (shelf: string, book: string) => {
		if (confirm('Are you sure you want to remove this book from the selected shelf?')) {
			await db
				.deleteFrom('shelf_books')
				.where('shelf_id', '=', shelf)
				.where('book_id', '=', book)
				.executeTakeFirst();
			invalidateAll();
			updateBookShelves();
		}
	};
	let selectedShelf = $state('');
</script>

<dialog class="modal" bind:this={modal}>
	<form method="dialog">
		<div class="modal-box w-full">
			<h3 class="text-lg font-bold">Remove from shelf</h3>
			<p class="py-4">Choose a shelf from which the book is already added.</p>

			<select class="select" bind:value={selectedShelf}>
				{#each bookShelves as shelf}
					<option value={shelf.id} selected={shelf.id === shelfId}>{shelf.name}</option>
				{/each}
			</select>

			<div class="modal-action">
				<button class="btn btn-ghost">Close</button>
				<button
					class="btn"
					onclick={() => removeFromShelf(selectedShelf, key.replace('/works/', ''))}
				>
					Remove From Shelf
				</button>
			</div>
		</div>
	</form>
</dialog>
