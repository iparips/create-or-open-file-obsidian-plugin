import { vi } from 'vitest'

vi.mock('obsidian', () => ({
	App: vi.fn(),
	Plugin: vi.fn(),
	TFile: vi.fn(),
	TFolder: vi.fn(),
	Notice: vi.fn(),
	PluginSettingTab: vi.fn(),
}))
