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
	const on_shelves = db
		?.selectFrom('shelf_books')
		.where('book_id', '=', id)
		.leftJoin('shelves', 'shelves.id', 'shelf_books.shelf_id')
		.orderBy('added_at desc')
		.selectAll()
		.execute();
	if (id) {
		const bookSearch = fetch(
			`https://openlibrary.org/search.json?q=key:/works/${id}&fields=*&limit=1`
		).then((r) => r.json());
		return { bookSearch, reading_sessions, on_shelves };
	}

	return { bookSearch: [], reading_sessions };
}) satisfies PageLoad;
