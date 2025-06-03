// Types for use-file-picker library integration
export interface SelectedFiles<T> {
	plainFiles: File[]
	filesContent: Array<{
		name: string
		content: T
		lastModified: number
		size: number
		type: string
		path: string
	}>
}

// Validation types
export interface ValidationError {
	field: string
	message: string
	commandIndex?: number
}

// Command settings types
export interface CommandSettings {
	commandName: string
	templateFilePath?: string
	destinationFolderPattern: string
	fileNamePattern: string
}

export interface ImportedSettings {
	commands: CommandSettings[]
}
