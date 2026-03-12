import { Buffer } from 'node:buffer'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { RAWG_PROXY_PREFIX, proxyRawgRequest } from './server/rawgProxy.js'

type ProxyRequest = {
	url?: string
	method?: string
	headers: Record<string, string | string[] | undefined>
}

type ProxyResponse = {
	statusCode: number
	setHeader: (key: string, value: string) => void
	end: (body?: Uint8Array) => void
}

type ProxyMiddlewares = {
	use: (handler: (req: ProxyRequest, res: ProxyResponse, next: () => void) => void) => void
}

const attachRawgProxy = (middlewares: ProxyMiddlewares, env: Record<string, string>) => {
	middlewares.use(async (req, res, next) => {
		const requestUrl = req.url ? new URL(req.url, 'http://localhost') : null
		if (!requestUrl || !requestUrl.pathname.startsWith(RAWG_PROXY_PREFIX)) {
			next()
			return
		}

		const requestHeaders = Object.fromEntries(
			Object.entries(req.headers).map(([key, value]) => [key, Array.isArray(value) ? value.join(', ') : value ?? '']),
		)
		const response = await proxyRawgRequest({
			pathname: requestUrl.pathname,
			search: requestUrl.search,
			method: req.method ?? 'GET',
			headers: requestHeaders,
			env,
		})

		res.statusCode = response.status
		response.headers.forEach((value, key) => res.setHeader(key, value))
		const responseBody = await response.arrayBuffer()
		res.end(Buffer.from(responseBody))
	})
}

const rawgProxyPlugin = (env: Record<string, string>) => ({
	name: 'rawg-proxy',
	configureServer(server: { middlewares: ProxyMiddlewares }) {
		attachRawgProxy(server.middlewares, env)
	},
	configurePreviewServer(server: { middlewares: ProxyMiddlewares }) {
		attachRawgProxy(server.middlewares, env)
	},
})

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const isAnalyzeMode = mode === 'analyze'
	const initialChunkBudgetKb = 350
	const env = loadEnv(mode, process.cwd(), '')

	return {
		plugins: [react(), rawgProxyPlugin(env)],
		build: {
			chunkSizeWarningLimit: initialChunkBudgetKb,
			rollupOptions: {
				plugins: isAnalyzeMode
					? [
							visualizer({
								filename: 'dist/bundle-stats.html',
								gzipSize: true,
								brotliSize: true,
								template: 'treemap',
								open: false,
							}),
					  ]
					: [],
			},
		},
	}
})
