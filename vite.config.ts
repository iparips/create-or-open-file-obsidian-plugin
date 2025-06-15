import { defineConfig } from 'vitest/config'

export default defineConfig({
	resolve: {
		alias: {
			obsidian: new URL('./src/test-support/__mocks__/obsidian.ts', import.meta.url).pathname,
		},
	},
	test: {
		environment: 'jsdom',
	},
	optimizeDeps: {
		exclude: ['obsidian'],
	},
})
