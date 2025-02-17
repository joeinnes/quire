import { env } from '$env/dynamic/public';

export const ITEMS_PER_PAGE = Number(env.PUBLIC_ITEMS_PER_PAGE) || 20;

if (isNaN(ITEMS_PER_PAGE) || ITEMS_PER_PAGE <= 0) {
	throw new Error('PUBLIC_ITEMS_PER_PAGE must be a positive number');
}
