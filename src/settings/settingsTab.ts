// import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { App, PluginSettingTab, Setting } from 'obsidian'

import type MyPlugin from '../main'

export class SettingTab extends PluginSettingTab {
	plugin: MyPlugin

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const { containerEl } = this
		containerEl.empty()
		containerEl.createEl('h2', { text: 'Note Creation Settings' })

		new Setting(containerEl)
			.setName('Command Name')
			.setDesc('The name of the command that will appear in Obsidian command palette')
			.addText((text) =>
				text
					.setPlaceholder('Enter command name')
					.setValue(this.plugin.settings.commandName)
					.onChange(async (value) => {
						this.plugin.settings.commandName = value
						await this.plugin.saveSettings()
					}),
			)

		new Setting(containerEl)
			.setName('Template File Path')
			.setDesc('Path to the template file that will be used for new notes')
			.addText((text) =>
				text
					.setPlaceholder('00 - Meta/Templates/shopping-list-template.md')
					.setValue(this.plugin.settings.templateFilePath)
					.onChange(async (value) => {
						this.plugin.settings.templateFilePath = value
						await this.plugin.saveSettings()
					}),
			)

		new Setting(containerEl)
			.setName('Destination Folder Pattern')
			.setDesc('Pattern for the destination folder. Use {week} for week number, {year} for year, etc.')
			.addText((text) =>
				text
					.setPlaceholder('01 - Journal/Weekly/Week-{week}')
					.setValue(this.plugin.settings.destinationFolderPattern)
					.onChange(async (value) => {
						this.plugin.settings.destinationFolderPattern = value
						await this.plugin.saveSettings()
					}),
			)

		new Setting(containerEl)
			.setName('File Name Pattern')
			.setDesc('Pattern for the file name. Use {date} for current date, {time} for current time, etc.')
			.addText((text) =>
				text
					.setPlaceholder('shopping-list')
					.setValue(this.plugin.settings.fileNamePattern)
					.onChange(async (value) => {
						this.plugin.settings.fileNamePattern = value
						await this.plugin.saveSettings()
					}),
			)
	}
}
