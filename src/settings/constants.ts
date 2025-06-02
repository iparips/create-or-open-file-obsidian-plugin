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
		commandName: 'eg: Weekly shopping list',
		templateFilePath: 'eg: 00 - Meta/Templates/shopping-list-template.md',
		destinationFolderPattern: 'eg: 01 - Journal/Weekly/Week-{week}',
		fileNamePattern: 'eg: shopping-list.md'
	}]
}
