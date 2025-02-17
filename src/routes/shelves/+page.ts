import { ITEMS_PER_PAGE } from '$lib/config';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url }) => {
	const { db, user } = await parent();
	if (!user) throw new Error('No user');
	const shelfId = url.searchParams.get('shelf') || '';
	const offset = Number(url.searchParams.get('offset') || '0');

	const shelves = await db
		.selectFrom('shelves')
		.where('user_id', '=', user.id)
		.selectAll()
		.execute();

	let shelfContents;
	let totalBooks;

	if (shelfId) {
		shelfContents = await db
			.selectFrom('shelf_books')
			.where('shelf_id', '=', shelfId)
			.selectAll()
			.limit(ITEMS_PER_PAGE)
			.offset(offset)
			.execute();

		totalBooks = await db
			.selectFrom('shelf_books')
			.where('shelf_id', '=', shelfId)
			.select(db.fn.count<number>('book_id').as('count'))
			.executeTakeFirst();
	}

	return {
		db,
		user,
		shelves,
		shelfContents,
		totalBooks
	};
};
