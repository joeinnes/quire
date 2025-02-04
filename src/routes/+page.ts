import type { PageLoad } from './$types';

export const _ITEMS_PER_PAGE = 10;

export const load = (async ({ url, fetch }) => {
	const searchParams = new URLSearchParams(url.search);
	const query = searchParams.get('q') || '';
	const offset = searchParams.get('offset') || '0';
	const bookList = query
		? fetch(
				`https://openlibrary.org/search.json?q=${query}&fields=key,edition_key,title,title_sort,first_publish_year,cover_edition_key,author_name,ratings_average,number_of_pages_median&limit=${_ITEMS_PER_PAGE}&offset=${offset}`
			).then((r) => r.json())
		: {
				q: query
			};
	return {
		bookList,
		q: query
	};
}) satisfies PageLoad;
