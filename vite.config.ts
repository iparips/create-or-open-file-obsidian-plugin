import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		alias: {
			'obsidian': './src/test-support/__mocks__/obsidian.ts'
		},
	},
});
