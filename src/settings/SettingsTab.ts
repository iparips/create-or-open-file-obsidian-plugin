import { App, PluginSettingTab, Notice } from 'obsidian'
import React from 'react'
import { createRoot, type Root } from 'react-dom/client'

import type MyPlugin from '../main'
import { SettingsComponent } from './components'
import { PluginSettings } from '../types'
import { validateImportedSettings } from './utils/importValidation'

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

		// Create React root and render component
		this.root = createRoot(containerEl)
		this.root.render(
			React.createElement(SettingsComponent, {
				settings: (this.plugin as MyPlugin).settings, // Get current settings from plugin
				updatePluginSettings: this.updatePluginSettingsCallback,
			}),
		)
	}

	hide(): void {
		// Validate settings before closing
		const validationResult = validateImportedSettings((this.plugin as MyPlugin).settings)

		if (!validationResult.isValid) {
			const errorMessages = validationResult.errors.map((error) => error.message).join('\n')
			new Notice(`Settings validation failed:\n${errorMessages}`, 8000)
			return // Prevent closing if validation fails
		}

		// Clean up React root when settings tab is hidden
		if (this.root) {
			this.root.unmount()
			this.root = null
		}
	}
}
