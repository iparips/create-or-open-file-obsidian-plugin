import { App, TAbstractFile, TFile } from 'obsidian'

export class NoteCreator {
	app: App

	constructor(app: App) {
		this.app = app
	}

	public async openOrCreateFileFromTemplate(filePath: string, templateFilePath: string): Promise<string> {
		const folderPath = filePath.substring(0, filePath.lastIndexOf('/'))
		const folderExists = this.app.vault.getFolderByPath(folderPath)
		const fileExists = this.app.vault.getAbstractFileByPath(filePath)

		return folderExists && fileExists
			? this.openFile(filePath, folderPath)
			: this.createAndOpenFile(folderPath, filePath, templateFilePath)
	}

	private async openFile(filePath: string, folder: string): Promise<string> {
		return this.app.workspace
			.openLinkText(filePath, folder)
			.catch(() => Promise.reject(`Could not open the filePath [${filePath}], folder[${folder}]`))
			.then(() => Promise.resolve('File opened successfully'))
	}

	private async createAndOpenFile(folderPath: string, filePath: string, templateFilePath: string): Promise<string> {
		return this.app.vault
			.createFolder(folderPath)
			.catch((error) => Promise.resolve(error)) // ignore error if folder exists
			.then(() => this.readTemplate(templateFilePath))
			.then((templateContent) => this.app.vault.create(filePath, templateContent))
			.then(() => this.openFile(filePath, folderPath))
			.then(() => Promise.resolve(`Created new file from template: ${filePath}`))
	}

	private async readTemplate(templateFilePath: string): Promise<string> {
		const { vault } = this.app
		const templateFile: TAbstractFile | null = vault.getAbstractFileByPath(templateFilePath)
		return templateFile && templateFile instanceof TFile
			? vault.read(templateFile)
			: Promise.reject('Template file not found')
	}
}
