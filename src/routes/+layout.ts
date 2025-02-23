import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load = (async () => {
	if (!browser) return;

	try {
		const { db: thisDb } = await import('$lib/db');
		const db = await thisDb();
		const user = await db.selectFrom('users').selectAll().executeTakeFirst();
		return {
			db,
			user
		};
	} catch (error) {}
}) satisfies LayoutLoad;
