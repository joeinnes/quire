import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

import { ITEMS_PER_PAGE } from '$lib/config';

export const load = (async ({ url, fetch, parent }) => {
	const { db } = await parent();
	if (!db) return error(500, 'Database not found');
	const searchParams = new URLSearchParams(url.search);
	const query = searchParams.get('q') || '';
	const offset = searchParams.get('offset') || '0';

	// Query the database for books on the 'currently reading' shelf
	const currentlyReadingBooks = await db
		.selectFrom('shelf_books')
		.innerJoin('shelves', 'shelves.id', 'shelf_books.shelf_id')
		.select(['shelf_books.book_id'])
		.where('shelves.name', '=', 'Currently Reading')
		.execute();

	const bookList = query
		? fetch(
				`https://openlibrary.org/search.json?q=${query}&fields=key,edition_key,title,title_sort,first_publish_year,cover_edition_key,author_name,ratings_average,number_of_pages_median&limit=${ITEMS_PER_PAGE}&offset=${offset}`
			).then((r) => r.json())
		: {
				q: query
			};

	const popularBooks = fetch(
		`https://openlibrary.org/trending/daily.json?limit=${ITEMS_PER_PAGE}`
	).then((r) => r.json());
	return {
		bookList,
		q: query,
		currentlyReadingBooks,
		popularBooks
	};
}) satisfies PageLoad;
