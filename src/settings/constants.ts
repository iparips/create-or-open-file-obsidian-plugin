export interface PluginSettings {
	commandName: string;
	templateFilePath: string;
	destinationFolderPattern: string;
	fileNamePattern: string;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	commandName: 'Weekly shopping list',
	templateFilePath: '00 - Meta/Templates/shopping-list-template.md',
	destinationFolderPattern: '01 - Journal/Weekly/Week-{week}',
	fileNamePattern: 'shopping-list.md'
}
