import { App, PluginSettingTab } from 'obsidian'
import React from 'react'
import { createRoot, type Root } from 'react-dom/client'

import type MyPlugin from '../main'
import { SettingsComponent } from './components'
import { PluginSettings } from './constants'

export class SettingsTab extends PluginSettingTab {
	plugin: MyPlugin
	private root: Root | null = null

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const { containerEl } = this
		containerEl.empty()

		// Create React root and render component
		this.root = createRoot(containerEl)
		this.root.render(
			React.createElement(SettingsComponent, {
				settings: this.plugin.settings,
				saveSettings: (newSettings: PluginSettings) => this.plugin.saveSettings(newSettings),
			}),
		)
	}

	hide(): void {
		// Clean up React root when settings tab is hidden
		if (this.root) {
			this.root.unmount()
			this.root = null
		}
	}
}
