import { App, PluginSettingTab, Notice } from 'obsidian'
import React from 'react'
import { createRoot, type Root } from 'react-dom/client'

import type MyPlugin from '../main'
import { SettingsComponent } from './components'
import { PluginSettings } from '../types'
import { validateSettings } from './utils/validateSettings'

export class SettingsTab extends PluginSettingTab {
	updatePluginSettingsCallback: (newSettings: PluginSettings) => Promise<void>
	private root: Root | null = null

	constructor(app: App, plugin: MyPlugin, updateSettingsCallback: (newSettings: PluginSettings) => Promise<void>) {
		super(app, plugin)
		this.updatePluginSettingsCallback = updateSettingsCallback
	}

	display(): void {
		const { containerEl } = this
		containerEl.empty()

		this.root = createRoot(containerEl)
		this.root.render(
			React.createElement(SettingsComponent, {
				settings: (this.plugin as MyPlugin).settings, // Get current settings from plugin
				updatePluginSettings: this.updatePluginSettingsCallback,
			}),
		)
	}

	hide(): void {
		const validationResult = validateSettings((this.plugin as MyPlugin).settings)
		if (!validationResult.isValid) {
			new Notice(`Please fill out the required settings for the new command to work`, 10000)
		}
		// Clean up React root when settings tab is hidden
		if (this.root) {
			this.root.unmount()
			this.root = null
		}
	}
}
