import React, { useState } from 'react'
import type { CommandConfig } from '../../types'
import { SettingInput } from './SettingInput'
import { validateField, VALIDATION_RULES, type ValidationRule } from '../utils/validation'

interface ValidationErrors {
	commandName?: string
	templateFilePath?: string
	destinationFolderPattern?: string
	fileNamePattern?: string
	timeShift?: string
}

interface CommandCardProps {
	command: CommandConfig
	index: number
	onUpdate: (index: number, field: keyof CommandConfig, value: string) => void
	onDelete: (index: number) => void
}

export const CommandCard: React.FC<CommandCardProps> = ({ command, index, onUpdate, onDelete }) => {
	const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

	const validate = (field: keyof CommandConfig, value: string, rules: ValidationRule[]) => {
		const errorMessage = validateField(rules, value)
		setValidationErrors((prev) => ({ ...prev, [field]: errorMessage }))
	}

	return (
		<div className="command-container">
			<div className="settings-grid">
				<SettingInput
					name="Command Name"
					description="The name will appear in Obsidian command palette"
					placeholder="Enter command name"
					value={command.commandName}
					onChange={(value) => onUpdate(index, 'commandName', value)}
					onBlur={(value) => validate('commandName', value, [VALIDATION_RULES.required])}
					error={validationErrors.commandName}
				/>

				<SettingInput
					name="Destination Folder"
					description="Path / pattern for destination folder"
					placeholder="01 - Journal/Weekly/Week-{week}"
					value={command.destinationFolderPattern}
					onChange={(value) => onUpdate(index, 'destinationFolderPattern', value)}
					onBlur={(value) => validate('destinationFolderPattern', value, [VALIDATION_RULES.required])}
					error={validationErrors.destinationFolderPattern}
				/>

				<SettingInput
					name="File Name"
					description="Path / pattern for the file name"
					placeholder="shopping-list.md"
					value={command.fileNamePattern}
					onChange={(value) => onUpdate(index, 'fileNamePattern', value)}
					onBlur={(value) => validate('fileNamePattern', value, [VALIDATION_RULES.requiredAndEndsWithMd])}
					error={validationErrors.fileNamePattern}
				/>

				<SettingInput
					name="Template File"
					description="Optional path to the template file"
					placeholder="00 - Meta/Templates/shopping-list-template.md"
					value={command.templateFilePath}
					onChange={(value) => onUpdate(index, 'templateFilePath', value)}
					onBlur={(value) => validate('templateFilePath', value, [VALIDATION_RULES.endsWithMd])}
					error={validationErrors.templateFilePath}
				/>

				<SettingInput
					name="Time shift"
					description="Optional time shift (e.g., '+1 day', '-1 week', '+2 months')"
					placeholder=""
					value={command.timeShift}
					onChange={(value) => onUpdate(index, 'timeShift', value)}
					error={validationErrors.timeShift}
				/>
			</div>

			<div className="command-footer">
				<button className="mod-warning" onClick={() => onDelete(index)}>
					Delete
				</button>
			</div>
		</div>
	)
}
