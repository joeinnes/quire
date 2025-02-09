<script lang="ts">
	import { deleteDb } from '$lib/db';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let { db, user } = $derived(data);
	const handleInputChange = async (e: Event & { currentTarget: HTMLInputElement }) => {
		if (!db || !user) return;
		const val = e.currentTarget.value;
		const key = e.currentTarget.name;
		await db
			.updateTable('users')
			.set({ [key]: val })
			.where('id', '=', user.id)
			.returningAll()
			.executeTakeFirst();
	};
</script>

{#await db}
	<section class="p-4">
		<h1 class="text-3xl font-semibold">Loading...</h1>
	</section>
{:then db}
	<section class="p-4 flex flex-col gap-2">
		<label
			>Name
			<input
				type="text"
				name="name"
				placeholder="Type here"
				class="input w-full"
				value={user?.name}
				onchange={handleInputChange}
			/>
		</label>
		<button class="btn btn-error" onclick={() => deleteDb()}>Delete DB</button>

		<!--
    Don't need this if app is not multiplayerI
    <label
			>Email
			<input type="text" placeholder="Type here" class="input w-full" />
		</label>

		<label
			>Username
			<input type="text" placeholder="Type here" class="input w-full" />
		</label>-->
	</section>
{/await}
