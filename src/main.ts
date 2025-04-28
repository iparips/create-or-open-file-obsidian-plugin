import { Notice, Plugin } from 'obsidian'
import { SampleSettingTab } from './settings/settingsTab'
import { DEFAULT_SETTINGS, PluginSettings } from './settings/constants'
import { NoteCreator } from './notes/noteCreator'
import { format } from 'date-fns'
import { ObsidianAdapter } from './notes/obsidianAdapter'

export default class MyPlugin extends Plugin {
	settings: PluginSettings

	async onload() {
		await this.loadSettings()

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'this-weeks-shopping-list',
			name: "This week's shopping list",
			callback: async () => {
				const templateFilePath = '00 - Meta/Templates/shopping-list-template.md'
				const weekNumber = format(new Date(), 'II') // 'II' for 2-digit ISO week
				const currentShoppingListFolder = '01 - Journal/Weekly/Week-' + weekNumber
				const currentShoppingListFile = currentShoppingListFolder + '/shopping-list-test.md'

				await new NoteCreator(new ObsidianAdapter(this.app)).openOrCreateFileFromTemplate(currentShoppingListFile, templateFilePath)
					.then(outcome => new Notice(outcome))
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
