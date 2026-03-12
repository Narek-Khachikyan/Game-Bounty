import { proxyRawgRequest } from '../../server/rawgProxy.js';

const getRequestUrl = (event) =>
	event.rawUrl ||
	`https://game-bounty.local${event.path}${event.rawQuery ? `?${event.rawQuery}` : ''}`;

export const handler = async (event) => {
	const requestUrl = new URL(getRequestUrl(event));
	const requestBody = event.body
		? event.isBase64Encoded
			? Buffer.from(event.body, 'base64')
			: event.body
		: undefined;
	const response = await proxyRawgRequest({
		pathname: requestUrl.pathname,
		search: requestUrl.search,
		method: event.httpMethod || 'GET',
		headers: event.headers || {},
		body: requestBody,
		env: process.env,
	});

	return {
		statusCode: response.status,
		headers: Object.fromEntries(response.headers.entries()),
		body: await response.text(),
	};
};
