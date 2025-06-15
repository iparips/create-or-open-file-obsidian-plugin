import { defineConfig } from 'vitest/config'

export default defineConfig({
	resolve: {
		alias: {
			obsidian: new URL('./src/test-support/__mocks__/obsidian.ts', import.meta.url).pathname,
		},
	},
	test: {
		environment: 'happy-dom',
		testTimeout: 10000,
		hookTimeout: 10000,
		teardownTimeout: 5000,
		globals: true,
		passWithNoTests: true,
	},
	optimizeDeps: {
		exclude: ['obsidian'],
	},
})
