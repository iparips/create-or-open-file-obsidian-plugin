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
		containerEl.createEl('h2', { text: 'Note Creation Commands' })

		// Add button for new commands
		new Setting(containerEl)
			.setName('Add New Command')
			.setDesc('Add a new command configuration')
			.addButton((button) =>
				button
					.setButtonText('Add Command')
					.onClick(async () => {
						this.plugin.settings.commands.push({
							commandName: 'New Command',
							templateFilePath: '',
							destinationFolderPattern: '',
							fileNamePattern: ''
						})
						await this.plugin.saveSettings()
						this.display() // Refresh the display
					}),
			)

		// Display each command's settings
		this.plugin.settings.commands.forEach((command, index) => {
			const commandContainer = containerEl.createDiv('command-container')
			commandContainer.createEl('h3', { text: `Command ${index + 1}` })

			new Setting(commandContainer)
				.setName('Command Name')
				.setDesc('The name of the command that will appear in Obsidian command palette')
				.addText((text) =>
					text
						.setPlaceholder('Enter command name')
						.setValue(command.commandName)
						.onChange(async (value) => {
							command.commandName = value
							await this.plugin.saveSettings()
						}),
				)

			new Setting(commandContainer)
				.setName('Template File Path')
				.setDesc('Path to the template file that will be used for new notes')
				.addText((text) =>
					text
						.setPlaceholder('00 - Meta/Templates/shopping-list-template.md')
						.setValue(command.templateFilePath)
						.onChange(async (value) => {
							command.templateFilePath = value
							await this.plugin.saveSettings()
						}),
				)

			new Setting(commandContainer)
				.setName('Destination Folder Pattern')
				.setDesc('Pattern for the destination folder. Use {week} for week number, {year} for year, etc.')
				.addText((text) =>
					text
						.setPlaceholder('01 - Journal/Weekly/Week-{week}')
						.setValue(command.destinationFolderPattern)
						.onChange(async (value) => {
							command.destinationFolderPattern = value
							await this.plugin.saveSettings()
						}),
				)

			new Setting(commandContainer)
				.setName('File Name Pattern')
				.setDesc('Pattern for the file name. Use {date} for current date, {time} for current time, etc.')
				.addText((text) =>
					text
						.setPlaceholder('shopping-list')
						.setValue(command.fileNamePattern)
						.onChange(async (value) => {
							command.fileNamePattern = value
							await this.plugin.saveSettings()
						}),
				)

			// Add delete button for each command
			new Setting(commandContainer)
				.addButton((button) =>
					button
						.setButtonText('Delete Command')
						.setWarning()
						.onClick(async () => {
							this.plugin.settings.commands.splice(index, 1)
							await this.plugin.saveSettings()
							this.display() // Refresh the display
						}),
				)
		})
	}
}
