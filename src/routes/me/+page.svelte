<script lang="ts">
	import { deleteDb, getDb, overwriteDb } from '$lib/db';
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
		<div class="flex flex-col gap-2">
			<button class="btn btn-error" onclick={() => deleteDb()}>Delete DB</button>
			<button
				class="btn btn-primary"
				onclick={async () => {
					const dbFile = await getDb();
					const blob = new Blob([dbFile], { type: 'application/octet-stream' });
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = 'quire-backup.sqlite3';
					a.click();
					URL.revokeObjectURL(url);
				}}
			>
				Export DB
			</button>
			<div class="form-control w-full">
				<label class="label">
					<span class="label-text-alt">Import database (this will overwrite your current data)</span
					>
					<input
						type="file"
						accept=".sqlite3"
						class="file-input w-full"
						onchange={(e) => {
							if (!e.target || !(e.target instanceof HTMLInputElement) || !e.target.files) return;
							const file = e.target.files[0];
							if (!file) return;
							if (
								confirm(
									'Are you sure you want to overwrite your current database? This action cannot be undone.'
								)
							) {
								const reader = new FileReader();
								reader.onload = (e) => {
									if (!e.target || !e.target.result) return;
									const arrayBuffer = e.target.result;
									if (arrayBuffer instanceof ArrayBuffer) {
										const uint8Array = new Uint8Array(arrayBuffer);
										overwriteDb(uint8Array);
										window.location.reload();
									}
								};
								reader.readAsArrayBuffer(file);
							}
						}}
					/>
				</label>
			</div>
		</div>

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
