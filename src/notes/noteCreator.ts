import type { App, TFile } from 'obsidian'

export class NoteCreator {
	app: App

	constructor(app: App) {
		this.app = app
	}

	public async openOrCreateFileFromTemplate(noteFilePath: string, templateFilePath: string): Promise<string> {
		const noteFileExists = this.app.vault.getFileByPath(noteFilePath)
		const noteFolderPath = noteFilePath.substring(0, noteFilePath.lastIndexOf('/'))

		return noteFileExists
			? this.openFile(noteFilePath, noteFolderPath)
			: this.createFileAndFolder(noteFilePath, noteFolderPath, templateFilePath)
				.then(() => this.openFile(noteFilePath, noteFolderPath))
				.then(() => Promise.resolve(`Created new file from template: ${noteFilePath}`))
	}

	private async openFile(filePath: string, folder: string): Promise<string> {
		return this.app.workspace
			.openLinkText(filePath, folder)
			.catch(() => Promise.reject(`Could not open the filePath [${filePath}], folder[${folder}]`))
			.then(() => Promise.resolve('File opened successfully'))
	}

	private async createFileAndFolder(filePath: string, folderPath: string, templateFilePath: string): Promise<TFile> {
		const templateFile = this.app.vault.getFileByPath(templateFilePath)
		if (!templateFile) {
			return Promise.reject('Template file not found')
		}

		const noteFolderExists = this.app.vault.getFolderByPath(folderPath)
		if (!noteFolderExists) {
			await this.app.vault.createFolder(folderPath)
		}

		return this.app.vault
			.read(templateFile)
			.then((templateContent: string) => this.app.vault.create(filePath, templateContent))
	}
}
