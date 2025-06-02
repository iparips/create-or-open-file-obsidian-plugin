import { Notice, Plugin } from 'obsidian'
import { SettingsTab } from './settings/SettingsTab'
import { DEFAULT_SETTINGS, PluginSettings } from './settings/constants'
import { NoteCreator } from './notes/noteCreator'
import { format, addDays } from 'date-fns'
import { ObsidianAdapter } from './notes/obsidianAdapter'

function processPattern(pattern: string, date: Date): string {
	return pattern
		.replace(/{week}/g, format(date, 'II'))
		.replace(/{year}/g, format(date, 'yyyy'))
		.replace(/{month}/g, format(date, 'MM'))
		.replace(/{day}/g, format(date, 'dd'))
		.replace(/{date}/g, format(date, 'yyyy-MM-dd'))
		.replace(/{time}/g, format(date, 'HH-mm-ss'))
		.replace(/{dow}/g, format(date, 'EEE'))
}

export default class MyPlugin extends Plugin {
	settings!: PluginSettings
	private commandIds: string[] = []

	async onload() {
		await this.loadSettings()
		this.registerCommands()
		this.addSettingTab(new SettingsTab(this.app, this))
	}

	onunload() {
		this.unregisterCommands()
	}

	private registerCommands() {
		// Unregister any existing commands first
		this.unregisterCommands()

		// Register new commands
		this.settings.commands.forEach((command, index) => {
			const commandId = `command-${index}`
			this.commandIds.push(commandId)

			this.addCommand({
				id: commandId,
				name: command.commandName,
				callback: async () => {
					await this.loadSettings()
					const now = new Date()
					const isTomorrowCommand = command.commandName.toLowerCase().includes('tomorrow')
					const targetDate = isTomorrowCommand ? addDays(now, 1) : now
					const destinationFolder = processPattern(command.destinationFolderPattern, targetDate)
					const fileName = processPattern(command.fileNamePattern, targetDate)
					const currentFile = `${destinationFolder}/${fileName}`

					await new NoteCreator(new ObsidianAdapter(this.app))
						.openOrCreateFileFromTemplate(currentFile, command.templateFilePath)
						.then((outcome) => new Notice(outcome))
						.catch((err) => new Notice(err))
				},
			})
		})
	}

	private unregisterCommands() {
		this.commandIds.forEach(id => {
			// @ts-ignore - Obsidian's type definitions don't include removeCommand
			this.app.commands.removeCommand(`${this.manifest.id}:${id}`)
		})
		this.commandIds = []
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings(newSettings: PluginSettings) {
		this.settings = newSettings
		await this.saveData(newSettings); // write to data.json
		this.registerCommands()
	}
}
