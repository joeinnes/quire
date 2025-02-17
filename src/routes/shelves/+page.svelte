<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import Shelf from '$lib/components/Shelf.svelte';
	import type { Shelf as ShelfType } from '$lib/db/types';
	import { ITEMS_PER_PAGE } from '$lib/config';
	import { page } from '$app/state';

	let { data }: { data: PageData } = $props();
	let { db, user, shelfContents, totalBooks } = $derived(data);
	let currentPage = $derived(
		Math.floor(Number(page.url.searchParams.get('offset') || 0) / ITEMS_PER_PAGE) + 1
	);
	let selectedShelfId = $derived(page.url.searchParams.get('shelf') || '');
	let shelves: ShelfType[] = $state([]);
	let newShelfName = $state('');

	$effect(() => {
		updateShelves();
	});

	const updateShelves = async () => {
		if (!db || !user) return;
		shelves = await db.selectFrom('shelves').where('user_id', '=', user.id).selectAll().execute();
	};

	const createShelf = async () => {
		if (!newShelfName || !user || !db) return;

		const dataToSubmit = {
			id: crypto.randomUUID(),
			name: newShelfName,
			user_id: user.id,
			is_default: 0,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		};

		await db.insertInto('shelves').values(dataToSubmit).executeTakeFirstOrThrow();
		newShelfName = '';
		updateShelves();
	};

	const deleteShelf = async (shelfId: string) => {
		if (!db || !confirm('Are you sure you want to delete this shelf?')) return;

		await db.deleteFrom('shelves').where('id', '=', shelfId).execute();
		await db.deleteFrom('shelf_books').where('shelf_id', '=', shelfId).execute();
		updateShelves();
		invalidateAll();
	};

	const getShelfContents = async (shelfId: string) => {
		if (!db) return [];
		return db.selectFrom('shelf_books').where('shelf_id', '=', shelfId).selectAll().execute();
	};
</script>

<div class="p-4">
	<h1 class="text-3xl font-semibold mb-6">My Shelves</h1>

	<div class="flex items-center gap-4 mb-8">
		<input
			type="text"
			class="input input-bordered flex-grow"
			placeholder="New shelf name"
			bind:value={newShelfName}
		/>
		<button class="btn btn-primary" onclick={createShelf}>Create Shelf</button>
	</div>

	{#each shelves as shelf (shelf.id)}
		<div class="relative mt-2">
			<button
				class="btn btn-error btn-sm absolute right-2 top-2"
				onclick={() => deleteShelf(shelf.id)}
				disabled={shelf.is_default === 1}
			>
				Delete
			</button>
			<a href="?shelf={shelf.id}" class="block">
				{#await getShelfContents(shelf.id) then contents}
					<Shelf title={shelf.name} {contents} />
				{/await}
			</a>
		</div>

		{#if selectedShelfId === shelf.id && totalBooks && totalBooks.count > ITEMS_PER_PAGE}
			<div class="join grid grid-cols-2 w-full max-w-xs mx-auto my-4">
				<a
					href="?shelf={shelf.id}&offset={Math.max(0, (currentPage - 2) * ITEMS_PER_PAGE)}"
					class="join-item btn btn-outline {currentPage === 1 ? 'btn-disabled' : ''}">Previous</a
				>
				<a
					href="?shelf={shelf.id}&offset={currentPage * ITEMS_PER_PAGE}"
					class="join-item btn btn-outline {currentPage * ITEMS_PER_PAGE >= totalBooks.count
						? 'btn-disabled'
						: ''}">Next</a
				>
			</div>
		{/if}
	{:else}
		<div class="text-center py-8 text-gray-500">
			<p>You haven't created any shelves yet.</p>
			<p>Create a shelf to start organizing your books!</p>
		</div>
	{/each}
</div>
