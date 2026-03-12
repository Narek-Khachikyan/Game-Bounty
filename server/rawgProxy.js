export const RAWG_PROXY_PREFIX = '/api/rawg';
export const RAWG_UPSTREAM_ORIGIN = 'https://api.rawg.io';
export const RAWG_UPSTREAM_BASE_PATH = '/api';
export const RAWG_PROXY_CONFIGURATION_ERROR_CODE = 'MISSING_RAWG_API_KEY';
export const RAWG_PROXY_CONFIGURATION_ERROR_MESSAGE =
	'Missing RAWG_API_KEY. Add it to the server environment and restart the app.';
export const RAWG_PROXY_UPSTREAM_ERROR_CODE = 'RAWG_PROXY_ERROR';
export const RAWG_PROXY_UPSTREAM_ERROR_MESSAGE =
	'Failed to reach RAWG. Please try again later.';

const PROXY_PATH_PREFIXES = [`/.netlify/functions/rawg`, RAWG_PROXY_PREFIX];
const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' };
const NO_BODY_METHODS = new Set(['GET', 'HEAD']);

const createJsonResponse = (status, payload) =>
	new Response(JSON.stringify(payload), {
		status,
		headers: JSON_HEADERS,
	});

const stripProxyPrefix = (pathname) => {
	const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

	for (const prefix of PROXY_PATH_PREFIXES) {
		if (normalizedPath === prefix) {
			return '/';
		}

		if (normalizedPath.startsWith(`${prefix}/`)) {
			return normalizedPath.slice(prefix.length);
		}
	}

	return normalizedPath;
};

export const getRawgApiKey = (env = process.env) => env.RAWG_API_KEY || '';

export const getRawgProxyUpstreamUrl = ({ pathname, search = '', env = process.env }) => {
	const apiKey = getRawgApiKey(env);
	const upstreamUrl = new URL(
		`${RAWG_UPSTREAM_BASE_PATH}${stripProxyPrefix(pathname)}`,
		RAWG_UPSTREAM_ORIGIN,
	);
	const incomingSearch = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);

	incomingSearch.delete('key');
	incomingSearch.set('key', apiKey);
	upstreamUrl.search = incomingSearch.toString();

	return upstreamUrl;
};

export const proxyRawgRequest = async ({
	pathname,
	search = '',
	method = 'GET',
	headers = {},
	body,
	env = process.env,
}) => {
	const apiKey = getRawgApiKey(env);
	if (!apiKey) {
		return createJsonResponse(500, {
			code: RAWG_PROXY_CONFIGURATION_ERROR_CODE,
			message: RAWG_PROXY_CONFIGURATION_ERROR_MESSAGE,
		});
	}

	const upstreamHeaders = new Headers();
	const acceptHeader = headers.accept ?? headers.Accept;
	const contentTypeHeader = headers['content-type'] ?? headers['Content-Type'];
	if (acceptHeader) {
		upstreamHeaders.set('accept', acceptHeader);
	}
	if (contentTypeHeader && !NO_BODY_METHODS.has(method.toUpperCase())) {
		upstreamHeaders.set('content-type', contentTypeHeader);
	}

	try {
		const upstreamResponse = await fetch(
			getRawgProxyUpstreamUrl({ pathname, search, env }).toString(),
			{
				method,
				headers: upstreamHeaders,
				body: NO_BODY_METHODS.has(method.toUpperCase()) ? undefined : body,
			},
		);
		const responseHeaders = new Headers();
		const contentType = upstreamResponse.headers.get('content-type');
		if (contentType) {
			responseHeaders.set('content-type', contentType);
		}

		return new Response(upstreamResponse.body, {
			status: upstreamResponse.status,
			headers: responseHeaders,
		});
	} catch {
		return createJsonResponse(502, {
			code: RAWG_PROXY_UPSTREAM_ERROR_CODE,
			message: RAWG_PROXY_UPSTREAM_ERROR_MESSAGE,
		});
	}
};
