import React, { useEffect, useState } from 'react'
import type { CommandConfig, PluginSettings } from '../../types'

import { ActionsHeader } from './ActionsHeader'
import { CommandCard } from './CommandCard'
import { ValidationSummary } from './ValidationSummary'
import { validateSettings } from '../utils/validation/validateSettings'
import { ValidationResult } from '../utils/validation/validationResult'

interface SettingsProps {
	settings: PluginSettings
	updatePluginSettings: (newSettings: PluginSettings) => Promise<void>
}

export const SettingsComponent = ({ settings, updatePluginSettings }: SettingsProps) => {
	const [localSettings, setLocalSettings] = useState<PluginSettings>(settings)
	const [validationResult, setValidationResult] = useState<ValidationResult>(new ValidationResult([]))

	const updateCommand = async (index: number, commandKey: keyof CommandConfig, newValue: string) => {
		const newSettings = { ...localSettings }
		newSettings.commandConfigs[index] = { ...newSettings.commandConfigs[index], [commandKey]: newValue }
		setLocalSettings(newSettings)
		await updatePluginSettings(newSettings)
	}

	const deleteCommand = async (index: number) => {
		const newSettings = { ...localSettings }
		newSettings.commandConfigs.splice(index, 1)
		setLocalSettings(newSettings)
		await updatePluginSettings(newSettings)
	}

	const addCommand = async () => {
		const newSettings = { ...localSettings }
		newSettings.commandConfigs = [
			{
				commandName: '',
				templateFilePath: '',
				destinationFolderPattern: '',
				fileNamePattern: '',
				timeShift: '',
			},
			...newSettings.commandConfigs,
		]
		setLocalSettings(newSettings)
		await updatePluginSettings(newSettings)
	}

	const handleSettingsImported = async (importedSettings: PluginSettings) => {
		setLocalSettings(importedSettings)
		await updatePluginSettings(importedSettings)
	}

	useEffect(() => {
		const result = validateSettings(localSettings)
		setValidationResult(result)
	}, [localSettings])

	return (
		<div className="note-creation-commands-settings">
			<ActionsHeader settings={localSettings} onSettingsImported={handleSettingsImported} onAddCommand={addCommand} />
			<ValidationSummary validationResult={validationResult} />
			{localSettings.commandConfigs.map((command: CommandConfig, index) => (
				<CommandCard
					key={index}
					command={command}
					index={index}
					onUpdate={updateCommand}
					onDelete={deleteCommand}
					validationErrors={validationResult.getErrorsForCommand(index)}
				/>
			))}
		</div>
	)
}
