import type { PageLoad } from './$types';

export const load = (async ({ params, fetch, parent }) => {
	const { db } = await parent();
	const { id } = params;
	const reading_sessions = db
		?.selectFrom('reading_sessions')
		.where('book_id', '=', id)
		.orderBy('created_at desc')
		.orderBy('started_at desc')
		.selectAll()
		.execute();
	console.log('reading sessions', await reading_sessions);
	if (id) {
		const bookSearch = fetch(
			`https://openlibrary.org/search.json?q=key:/works/${id}&fields=*&limit=1`
		).then((r) => r.json());
		return { bookSearch, reading_sessions };
	}

	return { bookSearch: [], reading_sessions };
}) satisfies PageLoad;
