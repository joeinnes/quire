import { sql } from 'kysely';

import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	const { db } = await parent();
	const reading_sessions = db
		.selectFrom('reading_sessions')
		.select([
			'reading_sessions.book_id',
			'reading_sessions.started_at',
			sql<number>`COUNT(DISTINCT reading_sessions.finished_at)`.as('total_reads'),
			sql<string>`MAX(reading_sessions.finished_at)`.as('most_recent_finished')
		])
		.groupBy('reading_sessions.book_id')
		.orderBy(sql`COALESCE(NULLIF(MAX(reading_sessions.finished_at), ''), '9999-12-31')`, 'desc')
		.execute();
	return {
		sessions: reading_sessions
	};
}) satisfies PageLoad;
