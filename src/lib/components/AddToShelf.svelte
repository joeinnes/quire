<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import type { Database, Shelf } from '$lib/db/types';
	import type { Kysely } from 'kysely';
	let { modal = $bindable(), key = '', shelfId = '' } = $props();
	const user_id = $derived(page.data.user.id);
	const db: Kysely<Database> = $derived(page.data.db);
	let shelves: Shelf[] | [] = $state([]);
	$effect(() => {
		updateShelves();
	});
	const updateShelves = async () => {
		shelves = await db.selectFrom('shelves').where('user_id', '=', user_id).selectAll().execute();
	};
	const createShelf = async (e: Event) => {
		if (!e.target) return;
		const formData = new FormData(e.target as HTMLFormElement);
		const name = formData.get('name');
		if (!name || !user_id || typeof name !== 'string') return;
		const dataToSubmit = {
			id: crypto.randomUUID(),
			name,
			user_id,
			is_default: 0,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		};
		await db.insertInto('shelves').values(dataToSubmit).executeTakeFirstOrThrow();
		updateShelves();
	};
	const addToShelf = async (shelf: string, book: string) => {
		const res = await db
			.insertInto('shelf_books')
			.values({
				shelf_id: shelf,
				book_id: book,
				added_at: new Date().toISOString()
			})
			.executeTakeFirstOrThrow();
		invalidateAll();
	};
	let selectedShelf = $state('');
</script>

<dialog class="modal" bind:this={modal}>
	<form method="dialog">
		<div class="modal-box w-full">
			<h3 class="text-lg font-bold">Add to shelf</h3>
			<p class="py-4">Choose a shelf from the dropdown.</p>

			<select class="select" bind:value={selectedShelf}>
				{#each shelves as shelf}
					<option value={shelf.id} selected={shelf.id === shelfId}>{shelf.name}</option>
				{/each}
			</select>

			<div class="modal-action">
				<button class="btn btn-ghost">Close</button>

				<button class="btn" onclick={() => addToShelf(selectedShelf, key.replace('/works/', ''))}
					>Add To Shelf</button
				>
			</div>
		</div>
	</form>
	<details>
		<summary>Add a new shelf</summary>
		<form onsubmit={createShelf}>
			<label
				>Shelf Name
				<input class="input" type="text" name="name" />
			</label>
			<button class="btn">Add Shelf</button>
		</form>
	</details>
</dialog>
