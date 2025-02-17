import { sql } from 'kysely';
import { ITEMS_PER_PAGE } from '$lib/config';
import type { PageLoad } from './$types';

export const load = (async ({ parent, url }) => {
	const offset = Number(url.searchParams.get('offset') || '0');
	const { db } = await parent();
	const reading_sessions = db
		.selectFrom('reading_sessions')
		.select([
			'reading_sessions.book_id',
			'reading_sessions.started_at',
			sql<number>`COUNT(DISTINCT CASE WHEN reading_sessions.finished_at != '' THEN reading_sessions.finished_at END)`.as(
				'total_reads'
			),
			sql<string>`MAX(reading_sessions.finished_at)`.as('most_recent_finished'),
			sql<number>`AVG(reading_sessions.rating)`.as('average_rating')
		])
		.groupBy('reading_sessions.book_id')
		.orderBy(sql`COALESCE(NULLIF(MAX(reading_sessions.finished_at), ''), '9999-12-31')`, 'desc')
		.limit(ITEMS_PER_PAGE)
		.offset(offset)
		.execute();

	const totalCount = await db
		.selectFrom('reading_sessions')
		.select([sql<number>`COUNT(DISTINCT book_id)`.as('count')])
		.executeTakeFirst();
	return {
		sessions: reading_sessions,
		totalCount
	};
}) satisfies PageLoad;
