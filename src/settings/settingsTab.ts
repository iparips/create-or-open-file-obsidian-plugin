// import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian'

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

		// Add buttons for import/export
		const buttonContainer = containerEl.createDiv()
		buttonContainer.style.display = 'flex'
		buttonContainer.style.gap = '2em'
		buttonContainer.style.marginBottom = '1em'

		new Setting(buttonContainer)
			.setName('Import Settings')
			.setDesc('Import settings from a JSON file')
			.addButton((button) =>
				button
					.setButtonText('Import')
					.onClick(async () => {
						const input = document.createElement('input')
						input.type = 'file'
						input.accept = '.json'
						input.onchange = async (e) => {
							const file = (e.target as HTMLInputElement).files?.[0]
							if (file) {
								try {
									const content = await file.text()
									const settings = JSON.parse(content)
									this.plugin.settings = settings
									await this.plugin.saveSettings()
									this.display() // Refresh the display
								} catch (err) {
									new Notice('Failed to import settings: ' + err)
								}
							}
						}
						input.click()
					}),
			)

		new Setting(buttonContainer)
			.setName('Export Settings')
			.setDesc('Export current settings to a JSON file')
			.addButton((button) =>
				button
					.setButtonText('Export')
					.onClick(async () => {
						const blob = new Blob([JSON.stringify(this.plugin.settings, null, 2)], { type: 'application/json' })
						const url = URL.createObjectURL(blob)
						const a = document.createElement('a')
						a.href = url
						a.download = 'note-creation-commands-settings.json'
						document.body.appendChild(a)
						a.click()
						document.body.removeChild(a)
						URL.revokeObjectURL(url)
					}),
			)

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
			commandContainer.style.marginBottom = '0.5em'
			commandContainer.style.padding = '0.25em'
			commandContainer.style.border = '1px solid var(--background-modifier-border)'
			commandContainer.style.borderRadius = '4px'

			const headerDiv = commandContainer.createDiv()
			headerDiv.style.display = 'flex'
			headerDiv.style.justifyContent = 'space-between'
			headerDiv.style.alignItems = 'center'
			headerDiv.style.marginBottom = '0.25em'

			headerDiv.createEl('h3', { text: `Command ${index + 1}` })
			
			// Move delete button to header
			new Setting(headerDiv)
				.addButton((button) =>
					button
						.setButtonText('Delete')
						.setWarning()
						.onClick(async () => {
							this.plugin.settings.commands.splice(index, 1)
							await this.plugin.saveSettings()
							this.display() // Refresh the display
						}),
				)

			// Create a grid layout for settings
			const settingsGrid = commandContainer.createDiv()
			settingsGrid.style.display = 'flex'
			settingsGrid.style.flexDirection = 'column'
			settingsGrid.style.gap = '0.25em'

			// Add padding to all setting items
			const addSetting = (container: HTMLElement) => {
				const setting = new Setting(container)
				setting.settingEl.style.padding = '0.30em 0'
				setting.settingEl.style.display = 'grid'
				setting.settingEl.style.gridTemplateColumns = '1fr 1fr'
				setting.settingEl.style.gap = '0.5em'
				setting.settingEl.style.alignItems = 'center'
				return setting
			}

			// Command Name
			const nameSetting = addSetting(settingsGrid)
				.setName('Command Name')
				.setDesc('The name of the command that will appear in Obsidian command palette')
				.addText((text) => {
					text.inputEl.style.width = '100%'
					text
						.setPlaceholder('Enter command name')
						.setValue(command.commandName)
						.onChange(async (value) => {
							command.commandName = value
							await this.plugin.saveSettings()
						})
				})

			// Template File Path
			addSetting(settingsGrid)
				.setName('Template File')
				.setDesc('Path to the template file')
				.addText((text) => {
					text.inputEl.style.width = '100%'
					text
						.setPlaceholder('00 - Meta/Templates/shopping-list-template.md')
						.setValue(command.templateFilePath)
						.onChange(async (value) => {
							command.templateFilePath = value
							await this.plugin.saveSettings()
						})
				})

			// Destination Folder Pattern
			addSetting(settingsGrid)
				.setName('Destination Folder')
				.setDesc('Pattern for destination folder')
				.addText((text) => {
					text.inputEl.style.width = '100%'
					text
						.setPlaceholder('01 - Journal/Weekly/Week-{week}')
						.setValue(command.destinationFolderPattern)
						.onChange(async (value) => {
							command.destinationFolderPattern = value
							await this.plugin.saveSettings()
						})
				})

			// File Name Pattern
			addSetting(settingsGrid)
				.setName('File Name')
				.setDesc('Pattern for the file name')
				.addText((text) => {
					text.inputEl.style.width = '100%'
					text
						.setPlaceholder('shopping-list')
						.setValue(command.fileNamePattern)
						.onChange(async (value) => {
							command.fileNamePattern = value
							await this.plugin.saveSettings()
						})
				})
		})
	}
}
