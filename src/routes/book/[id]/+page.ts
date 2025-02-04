import type { PageLoad } from './$types';

export const load = (async ({ params, fetch }) => {
	const { id } = params;
	if (id) {
		const bookSearch = fetch(
			`https://openlibrary.org/search.json?q=key:/works/${id}&fields=*&limit=1`
		).then((r) => r.json());
		return { bookSearch };
	}

	return { bookSearch: [] };
}) satisfies PageLoad;
