import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const _ITEMS_PER_PAGE = 10;

export const load = (async ({ url, fetch, parent }) => {
	const { db } = await parent();
	if (!db) return error(500, 'Database not found');
	const searchParams = new URLSearchParams(url.search);
	const query = searchParams.get('q') || '';
	const offset = searchParams.get('offset') || '0';

	// Query the database for books on the 'currently reading' shelf
	const currentlyReadingBooks = await db
		.selectFrom('shelves')
		.innerJoin('shelf_books', 'shelves.id', 'shelf_books.shelf_id')
		.innerJoin('books', 'shelf_books.book_id', 'books.id')
		.select(['books.id', 'books.title', 'books.authors', 'books.image_url'])
		.where('shelves.name', '=', 'Currently Reading')
		.execute();

	const bookList = query
		? fetch(
				`https://openlibrary.org/search.json?q=${query}&fields=key,edition_key,title,title_sort,first_publish_year,cover_edition_key,author_name,ratings_average,number_of_pages_median&limit=${_ITEMS_PER_PAGE}&offset=${offset}`
			).then((r) => r.json())
		: {
				q: query
			};

	return {
		bookList,
		q: query,
		currentlyReadingBooks // Include the currently reading books in the returned data
	};
}) satisfies PageLoad;
