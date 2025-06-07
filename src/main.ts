import { Plugin } from 'obsidian'
import { SettingsTab } from './settings/SettingsTab'
import { DEFAULT_SETTINGS } from './settings/constants'
import { createOrOpenFileCommandCallback } from './command/commandCallback'
import { ObsidianAdapter } from './notes/obsidianAdapter'
import { CommandConfig, PluginSettings } from './types'

export default class MyPlugin extends Plugin {
	settings!: PluginSettings

	async onload() {
		this.settings = await this.loadSettingsFromFile()
		this.registerCommands(this.settings.commandConfigs)
		// bind this so that "this" reference inside update updateSettings points to MyPlugin.
		this.addSettingTab(new SettingsTab(this.app, this, this.settings, this.updateSettings.bind(this)))
	}

	private async loadSettingsFromFile(): Promise<PluginSettings> {
		const data: PluginSettings = await this.loadData()
		return Object.assign({}, DEFAULT_SETTINGS, data)
	}

	onunload() {
		this.unregisterCommands()
	}

	private registerCommands(commandConfigs: CommandConfig[]): void {
		this.unregisterCommands()
		
		commandConfigs.forEach((config: CommandConfig, index: number) => {
			// Don't include manifest ID - Obsidian adds it automatically
			const commandId = `cmd-${index}`
			this.addCommand({
				id: commandId,
				name: config.commandName,
				callback: createOrOpenFileCommandCallback(new ObsidianAdapter(this.app), config),
			})
		})
	}

	private unregisterCommands() {
		// Find and remove all commands belonging to this plugin
		const allCommands = this.app.commands.listCommands()
		const myCommands = allCommands.filter((cmd) => cmd.id.startsWith(this.manifest.id))
		myCommands.forEach((cmd) => {
			this.app.commands.removeCommand(cmd.id)
		})
	}

	async updateSettings(newSettings: PluginSettings): Promise<void> {
		this.settings = newSettings
		await this.saveData(newSettings) // write to data.json
		this.registerCommands(newSettings.commandConfigs)
	}
}
