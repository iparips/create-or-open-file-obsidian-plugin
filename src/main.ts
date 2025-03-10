// import { App, Modal, Plugin } from 'obsidian';
import { Plugin } from 'obsidian'
import { SampleSettingTab } from './settings/settingsTab'
import { DEFAULT_SETTINGS, PluginSettings } from './settings/constants'
import { NoteCreator } from './noteCreator'

export default class MyPlugin extends Plugin {
	settings: PluginSettings

	async onload() {
		await this.loadSettings()

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-or-create-this-weeks-shopping-list',
			name: "Open or create this week's shopping list",
			callback: async () => {
				await new NoteCreator(this.app).openOrCreateShoppingListFile()
			},
		})

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this))

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt)
		})
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}
}

// class SampleModal extends Modal {
// 	constructor(app: App) {
// 		super(app);
// 	}
//
// 	onOpen() {
// 		const {contentEl} = this;
// 		contentEl.setText('Woah!');
// 	}
//
// 	onClose() {
// 		const {contentEl} = this;
// 		contentEl.empty();
// 	}
// }
