import { Notice, App, TAbstractFile, TFile } from 'obsidian'
import { format } from 'date-fns'

export class NoteCreator {
	app: App

	constructor(app: App) {
		this.app = app
	}

	public async openOrCreateShoppingListFile(): Promise<void> {
		// Get the current week number
		const weekNumber = format(new Date(), 'II') // 'II' for 2-digit ISO week

		const templateFilePath = '00 - Meta/Templates/shopping-list-template.md'
		const currentShoppingListFolder = '01 - Journal/Weekly/Week-' + weekNumber
		const currentShoppingListFile = currentShoppingListFolder + '/shopping-list-test.md'

		// Check if the shopping list file already exists
		if (this.app.vault.getAbstractFileByPath(currentShoppingListFile)) {
			// Open existing file if it exists
			this.app.workspace.openLinkText(currentShoppingListFile, currentShoppingListFolder)
			new Notice('Opened existing shopping list file!')
		} else {
			// Create a new file from template if it doesn't exist
			await this.createFileFromTemplate(templateFilePath, currentShoppingListFile)
		}
	}

	private async createFileFromTemplate(templatePath: string, newFilePath: string) {
		const { vault } = this.app

		// Get the template file
		const templateFile: TAbstractFile | null = vault.getAbstractFileByPath(templatePath)
		if (!templateFile || !(templateFile instanceof TFile)) {
			new Notice('Template file not found!')
			return
		}

		// Read the template content (this is an async operation)
		const templateContent = await vault.read(templateFile)

		// Create the new file (this is also an async operation)
		await vault.create(newFilePath, templateContent)
		new Notice(`Created new file from template: ${newFilePath}`)
	}
}
