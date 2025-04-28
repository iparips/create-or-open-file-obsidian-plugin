import { Notice, Plugin } from 'obsidian'
import { SettingTab } from './settings/settingsTab'
import { DEFAULT_SETTINGS, PluginSettings } from './settings/constants'
import { NoteCreator } from './notes/noteCreator'
import { format } from 'date-fns'
import { ObsidianAdapter } from './notes/obsidianAdapter'

function processPattern(pattern: string, date: Date): string {
	return pattern
		.replace(/{week}/g, format(date, 'II'))
		.replace(/{year}/g, format(date, 'yyyy'))
		.replace(/{month}/g, format(date, 'MM'))
		.replace(/{day}/g, format(date, 'dd'))
		.replace(/{date}/g, format(date, 'yyyy-MM-dd'))
		.replace(/{time}/g, format(date, 'HH-mm-ss'))
}

export default class MyPlugin extends Plugin {
	settings: PluginSettings

	async onload() {
		await this.loadSettings()

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'this-weeks-shopping-list',
			name: this.settings.commandName,
			callback: async () => {
				await this.loadSettings()
				const now = new Date()
				const destinationFolder = processPattern(this.settings.destinationFolderPattern, now)
				const fileName = processPattern(this.settings.fileNamePattern, now)
				const currentShoppingListFile = `${destinationFolder}/${fileName}`

				await new NoteCreator(new ObsidianAdapter(this.app))
					.openOrCreateFileFromTemplate(currentShoppingListFile, this.settings.templateFilePath)
					.then((outcome) => new Notice(outcome))
			},
		})

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingTab(this.app, this))
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}
}
