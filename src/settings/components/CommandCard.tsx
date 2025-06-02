import React, { useState } from 'react'
import type { CommandSettings } from '../constants'
import { CommandHeader } from './CommandHeader'
import { CommandName } from './CommandName'
import { TemplateFile } from './TemplateFile'
import { DestinationFolder } from './DestinationFolder'
import { FileName } from './FileName'

interface ValidationErrors {
	commandName?: string
	templateFilePath?: string
	destinationFolderPattern?: string
	fileNamePattern?: string
}

interface CommandCardProps {
	command: CommandSettings
	index: number
	onUpdate: (index: number, field: keyof CommandSettings, value: string) => void
	onDelete: (index: number) => void
}

export const CommandCard: React.FC<CommandCardProps> = ({ command, index, onUpdate, onDelete }) => {
	const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

	const validateMandatory = (commandSettingKey: keyof CommandSettings, commandSettingValue: string) => {
		const error = commandSettingValue.trim() === '' ? 'This field is mandatory' : undefined
		setValidationErrors((prev) => ({
			...prev,
			[commandSettingKey]: error,
		}))
	}

	// Special validation for fileNamePattern to check .md extension
	const validateMandatoryAndEndsWithMd = (commandSettingKey: keyof CommandSettings, commandSettingValue: string) => {
		let error: string | undefined = undefined

		if (commandSettingValue.trim() === '') {
			error = 'This field is mandatory'
		} else if (!commandSettingValue.endsWith('.md')) {
			error = 'File name should end with .md extension'
		}

		setValidationErrors((prev) => ({
			...prev,
			[commandSettingKey]: error,
		}))
	}

	const validateEndsWithMd = (commandSettingKey: keyof CommandSettings, commandSettingValue: string) => {
		const error = (commandSettingValue.trim() !== '' && !commandSettingValue.endsWith('.md')) ? 'File name should end with .md extension' : undefined
		setValidationErrors((prev) => ({
			...prev,
			[commandSettingKey]: error,
		}))
	}

	return (
		<div className="command-container">
			<CommandHeader index={index} onDelete={onDelete} />

			<div className="settings-grid">
				<CommandName
					value={command.commandName}
					onChange={(value) => onUpdate(index, 'commandName', value)}
					onBlur={(value) => validateMandatory('commandName', value)}
					error={validationErrors.commandName}
				/>

				<TemplateFile
					value={command.templateFilePath}
					onChange={(value) => onUpdate(index, 'templateFilePath', value)}
					onBlur={(value) => validateEndsWithMd('templateFilePath', value)}
					error={validationErrors.templateFilePath}
				/>

				<DestinationFolder
					value={command.destinationFolderPattern}
					onChange={(value) => onUpdate(index, 'destinationFolderPattern', value)}
					onBlur={(value) => validateMandatory('destinationFolderPattern', value)}
					error={validationErrors.destinationFolderPattern}
				/>

				<FileName
					value={command.fileNamePattern}
					onChange={(value) => onUpdate(index, 'fileNamePattern', value)}
					onBlur={(value) => validateMandatoryAndEndsWithMd('fileNamePattern', value)}
					error={validationErrors.fileNamePattern}
				/>
			</div>
		</div>
	)
}
