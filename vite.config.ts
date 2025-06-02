import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'jsdom',
		setupFiles: ['./src/test-support/setup.ts'],
		alias: {
			'obsidian': './src/test-support/__mocks__/obsidian.ts'
		},
	},
});
