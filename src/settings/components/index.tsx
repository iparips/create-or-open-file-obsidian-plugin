import React, { useState } from 'react'
import type { CommandSettings, PluginSettings } from '../constants'

import { ImportExportSettings } from './ImportExportSettings'
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
		newSettings.commands.push({
			commandName: 'New Command',
			templateFilePath: '',
			destinationFolderPattern: '',
			fileNamePattern: '',
		})
		setLocalSettings(newSettings)
		await saveSettings(newSettings)
	}

	const handleSettingsImported = async (importedSettings: PluginSettings) => {
		setLocalSettings(importedSettings)
		await saveSettings(importedSettings)
	}

	return (
		<div className="note-creation-commands-settings">
			<h2>Note Creation Commands</h2>

			<ImportExportSettings
				settings={localSettings}
				onSettingsImported={handleSettingsImported}
			/>

			<div style={{ marginBottom: '1em' }}>
				<button onClick={addCommand}>Add Command</button>
			</div>

			{localSettings.commands.map((command, index) => (
				<CommandCard
					key={index}
					command={command}
					index={index}
					onUpdate={updateCommand}
					onDelete={deleteCommand}
				/>
			))}
		</div>
	)
}
