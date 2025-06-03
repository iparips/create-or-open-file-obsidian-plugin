import React, { useState } from 'react'
import type { CommandSettings, PluginSettings } from '../constants'

import { ActionsHeader } from './ActionsHeader'
import { CommandCard } from './CommandCard'

interface SettingsProps {
	settings: PluginSettings
	saveSettings: (newSettings: PluginSettings) => Promise<void>
}

export const SettingsComponent = ({ settings, saveSettings }: SettingsProps) => {
	const [localSettings, setLocalSettings] = useState<PluginSettings>(settings)

	const updateCommand = async (index: number, commandKey: keyof CommandSettings, newValue: string) => {
		const newSettings = { ...localSettings }
		newSettings.commands[index] = { ...newSettings.commands[index], [commandKey]: newValue }
		setLocalSettings(newSettings)
		await saveSettings(newSettings)
	}

	const deleteCommand = async (index: number) => {
		const newSettings = { ...localSettings }
		newSettings.commands.splice(index, 1)
		setLocalSettings(newSettings)
		await saveSettings(newSettings)
	}

	const addCommand = async () => {
		const newSettings = { ...localSettings }
		newSettings.commands = [
			{
				commandName: 'New Command',
				templateFilePath: '',
				destinationFolderPattern: '',
				fileNamePattern: '',
			},
			...newSettings.commands,
		]
		setLocalSettings(newSettings)
		await saveSettings(newSettings)
	}

	const handleSettingsImported = async (importedSettings: PluginSettings) => {
		setLocalSettings(importedSettings)
		await saveSettings(importedSettings)
	}

	return (
		<div className="note-creation-commands-settings">
			<ActionsHeader
				settings={localSettings}
				onSettingsImported={handleSettingsImported}
				onAddCommand={addCommand}
			/>
			{localSettings.commands.map((command, index) => (
				<CommandCard key={index} command={command} index={index} onUpdate={updateCommand} onDelete={deleteCommand} />
			))}
		</div>
	)
}
