import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, fetch }) => {
	// Expect the external URL to be passed as a query parameter, e.g. ?url=https%3A%2F%2Fexample.com%2Fimage.jpg
	const target = url.searchParams.get('url');
	if (!target) {
		return new Response('Missing "url" parameter', { status: 400 });
	}

	let targetUrl: URL;
	try {
		targetUrl = new URL(target);
	} catch (err) {
		return new Response('Invalid URL parameter', { status: 400 });
	}

	// Ensure that only http and https protocols are allowed
	if (!['http:', 'https:'].includes(targetUrl.protocol)) {
		return new Response('URL protocol not allowed', { status: 400 });
	}

	// Fetch the external image.
	const res = await fetch(targetUrl.toString());
	if (!res.ok) {
		return new Response('Error fetching image', { status: res.status });
	}

	// Use the fetched Content-Type, or fall back to octet-stream
	const contentType = res.headers.get('content-type') || 'application/octet-stream';

	// Return the response body directly (streamed) with the Content-Type header.
	return new Response(res.body, {
		status: 200,
		headers: {
			'content-type': contentType
		}
	});
};
