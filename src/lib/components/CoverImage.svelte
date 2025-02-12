<script>
	// This is super cool! https://codepen.io/realvjy/pen/KKEdXOa
	let {
		title = '',
		key = '',
		className = '',
		author = '',
		loading = false,
		disableInteractions = false
	} = $props();
	let imageLoaded = $state(false);
	let cw = $state(0);
	let err = $state(false);
	let height = $derived((cw * 59) / 36); // NOTE: this is a magic number, the aspect ratio of the cover image
	$inspect(disableInteractions);
</script>

<div class="w-full book-items" bind:clientWidth={cw}>
	<div class="main-book-wrap">
		<div class="book-cover">
			<div
				class="book-inside absolute w-[90%] h-[96%] top-[1%] left-[1rem] border-[1px] border-solid border-grey-300 rounded-lg bg-white"
			></div>
			<div class="book-image {disableInteractions ? '' : 'with-interactions'}">
				<!-- if key then load image-->
				{#if key && (loading || !imageLoaded)}
					<div
						class={`skeleton ${className || 'object-cover w-full rounded-box'}`}
						style="height: {height}px;"
					></div>
				{/if}
				{#if key}
					<img
						class={`${className || 'object-cover w-full rounded-box '}${
							imageLoaded && !err ? 'block' : ' hidden'
						}`}
						alt={title}
						style="height: {height}px;"
						onload={() => (imageLoaded = true)}
						onerror={() => (err = true)}
						crossorigin="anonymous"
						src="https://cdn.statically.io/img/covers.openlibrary.org/f=auto/b/olid/{key}-M.jpg"
					/>
				{:else if !loading}
					<div
						class="flex flex-col items-center justify-center w-full p-1 text-xs text-center border-4 rounded-box bg-accent"
						style="height: {height}px;"
					>
						<div
							class="flex flex-col items-center justify-center h-full overflow-hidden break-normal"
						>
							<span>{title}</span>
							<small>{author}</small>
						</div>
					</div>
				{/if}
				<div class="effect"></div>
				<div class="light"></div>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.book-items {
		@apply relative cursor-default grid break-inside-avoid;
	}

	.main-book-wrap {
		@apply relative;
	}

	.book-cover {
		@apply relative;
	}

	.book-cover .book-inside {
		box-shadow:
			inset -2px 0 0 grey,
			inset -3px 0 0 #dbdbdb,
			inset -4px 0 0 white,
			inset -5px 0 0 #dbdbdb,
			inset -6px 0 0 white,
			inset -7px 0 0 #dbdbdb,
			inset -8px 0 0 white,
			inset -9px 0 0 #dbdbdb;
	}

	.book-cover .book-image {
		line-height: 0;
		position: relative;
		border-radius: 2px 6px 6px 2px;
		transition: all 0.3s ease-in-out;
		cursor: pointer;
	}

	.book-image img {
		grid-row: 1 / -1;
		grid-column: 1;
		width: 100%;
		border-radius: 2px 6px 6px 2px;
	}

	.with-interactions {
		cursor: pointer;
	}
	.with-interactions:hover {
		cursor: pointer;
		transform: perspective(1500px) rotateY(-2deg) translateX(-6px) scaleX(0.94);
		transform-style: preserve-3d;
	}

	.effect {
		position: absolute;
		width: 20px;
		height: 100%;
		margin-left: 5px;
		top: 0;
		border-left: 2px solid #00000010;
		background-image: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0.2) 0%,
			rgba(255, 255, 255, 0) 100%
		);
		transition: all 0.5s ease;
		z-index: 5;
	}

	.light {
		width: 90%;
		height: 100%;
		position: absolute;
		border-radius: 3px;
		background-image: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0.2) 100%
		);
		top: 0;
		right: 0;
		opacity: 0.1;
		transition: all 0.5s ease;
		z-index: 4;
	}
</style>
