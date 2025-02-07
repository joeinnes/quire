<script>
	import { page } from '$app/state';
	import debounce from 'debounce';
	import { _ITEMS_PER_PAGE } from '../../routes/+page';
	const searchForBook = debounce((e) => {
		e.preventDefault();
		if (e.key === 'Enter') {
			searchForBook.clear();
		}
		e.target.form.requestSubmit();
	}, 2000);
	let searchQuery = $derived(page.data?.q);
	let user = $derived(page.data?.user);
	let searchBar = $state();
	let isSearching = $state(false);

	$effect(() => {
		if (isSearching) {
			searchBar.focus();
		}
	});
</script>

<div class="z-10 shadow-sm navbar bg-primary text-primary-content">
	<div class="navbar-start">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost btn-circle">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-5 h-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h7"
					/>
				</svg>
			</div>
			<ul
				class="p-2 mt-3 shadow menu menu-sm dropdown-content bg-base-100 text-primary rounded-box z-1 w-52"
			>
				<li>
					<a href="/me">
						<div class="avatar avatar-placeholder">
							<div class="bg-neutral text-neutral-content w-10 rounded-full mask mask-squircle">
								{#if user && user.name}
									{user.name
										.split(' ')
										.map((/** @type string */ name) => name[0].toUpperCase())
										.join('')}
								{/if}
							</div>
						</div>
						{user.name}</a
					>
				</li>
			</ul>
		</div>
	</div>
	<div class="navbar-center">
		{#if isSearching}
			<form class="relative flex-1 w-full text-primary" method="GET" data-sveltekit-keepfocus>
				<label class="input">
					<svg
						class="h-[1em] opacity-50 absolute inset-y-0 left-0 ml-3 my-auto"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						><g
							stroke-linejoin="round"
							stroke-linecap="round"
							stroke-width="2.5"
							fill="none"
							stroke="currentColor"
							><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g
						></svg
					>
					<input
						type="search"
						placeholder="Search"
						name="q"
						oninput={searchForBook}
						class="pl-8"
						bind:this={searchBar}
						value={searchQuery}
						onblur={(el) => {
							if (!el.currentTarget.value) isSearching = false;
						}}
					/>
				</label>
			</form>
		{:else}
			<a class="text-3xl font-light tracking-tighter" style="font-variant: small-caps;" href="/"
				>Quire</a
			>
		{/if}
	</div>
	<div class="navbar-end">
		<button
			class="btn btn-ghost btn-circle"
			aria-label="Search"
			onclick={() => (isSearching = true)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="w-5 h-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
		</button>
	</div>
</div>
