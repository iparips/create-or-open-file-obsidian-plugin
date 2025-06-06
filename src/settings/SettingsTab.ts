import { App, PluginSettingTab } from 'obsidian'
import React from 'react'
import { createRoot, type Root } from 'react-dom/client'

import type MyPlugin from '../main'
import { SettingsComponent } from './components'
import { PluginSettings } from '../types'

export class SettingsTab extends PluginSettingTab {
	settings: PluginSettings
	updatePluginSettingsCallback: (newSettings: PluginSettings) => Promise<void>
	private root: Root | null = null

	constructor(
		app: App,
		plugin: MyPlugin,
		settings: PluginSettings,
		updateSettingsCallback: (newSettings: PluginSettings) => Promise<void>,
	) {
		super(app, plugin)
		this.settings = settings
		this.updatePluginSettingsCallback = updateSettingsCallback
	}

	display(): void {
		const { containerEl } = this
		containerEl.empty()

		// Create React root and render component
		this.root = createRoot(containerEl)
		this.root.render(
			React.createElement(SettingsComponent, {
				settings: this.settings,
				updatePluginSettings: this.updatePluginSettingsCallback,
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
