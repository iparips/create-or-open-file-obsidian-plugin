import { PluginSettings } from '../types'

export const DEFAULT_SETTINGS: PluginSettings = {
	commandConfigs: [
		{
			commandName: 'eg: Weekly shopping list',
			templateFilePath: 'eg: 00 - Meta/Templates/shopping-list-template.md',
			destinationFolderPattern: 'eg: 01 - Journal/Weekly/Week-{week}',
			fileNamePattern: 'eg: shopping-list.md',
		},
	],
}
