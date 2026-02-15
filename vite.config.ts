import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const isAnalyzeMode = mode === 'analyze'
	const initialChunkBudgetKb = 350

	return {
		plugins: [react()],
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
