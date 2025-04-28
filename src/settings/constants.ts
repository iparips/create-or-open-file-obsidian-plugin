export interface CommandSettings {
	commandName: string;
	templateFilePath: string;
	destinationFolderPattern: string;
	fileNamePattern: string;
}

export interface PluginSettings {
	commands: CommandSettings[];
}

export const DEFAULT_SETTINGS: PluginSettings = {
	commands: [{
		commandName: 'Weekly shopping list',
		templateFilePath: '00 - Meta/Templates/shopping-list-template.md',
		destinationFolderPattern: '01 - Journal/Weekly/Week-{week}',
		fileNamePattern: 'shopping-list.md'
	}]
}
