import type { App, TFile } from 'obsidian'

export class ObsidianAdapter {
	app: App

	constructor(app: App) {
		this.app = app
	}

	/**
	 * filePath is the path of the file to open
	 * sourcePath path of file where the link is being opened from
	 * 	(used for relative path resolution)
	 * returns a promise with string representing message to user
	 * 	about the operation
	 *  */
	public async openFile(filePath: string, sourcePath = ""): Promise<string> {
		return this.app.workspace
			.openLinkText(filePath, sourcePath)
			.catch(() => Promise.reject(`Could not open the filePath [${filePath}], sourcePath[${sourcePath}]`))
			.then(() => Promise.resolve('File opened successfully'))
	}

	public doesFileExist(fullPath: string): boolean {
		return this.app.vault.getFileByPath(fullPath) !== null
	}

	public async createFileAndFolder(filePath: string, templateFilePath: string): Promise<TFile> {
		const folderPath = filePath.substring(0, filePath.lastIndexOf('/'))
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
