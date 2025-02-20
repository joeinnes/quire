import { PUBLIC_ITEMS_PER_PAGE } from '$env/static/public';

export const ITEMS_PER_PAGE = Number(PUBLIC_ITEMS_PER_PAGE) || 20;

if (isNaN(ITEMS_PER_PAGE) || ITEMS_PER_PAGE <= 0) {
	throw new Error('PUBLIC_ITEMS_PER_PAGE must be a positive number');
}
