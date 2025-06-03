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