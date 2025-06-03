import type { ValidationError } from '../types'
import { validateField, VALIDATION_RULES, type ValidationRule } from './validation'

// Type for command object during validation (less strict than CommandSettings)
export interface Command {
	commandName?: unknown
	templateFilePath?: unknown
	destinationFolderPattern?: unknown
	fileNamePattern?: unknown
}

export interface FieldValidation {
	field: string
	value: unknown
	rules: ValidationRule[]
	label: string
}

export const buildFieldValidations = (command: Command): FieldValidation[] => {
	return [
		{
			field: 'commandName',
			value: command.commandName,
			rules: [VALIDATION_RULES.required],
			label: 'Command name',
		},
		{
			field: 'templateFilePath',
			value: command.templateFilePath,
			rules: [VALIDATION_RULES.endsWithMd],
			label: 'Template file path',
		},
		{
			field: 'destinationFolderPattern',
			value: command.destinationFolderPattern,
			rules: [VALIDATION_RULES.required],
			label: 'Destination folder pattern',
		},
		{
			field: 'fileNamePattern',
			value: command.fileNamePattern,
			rules: [VALIDATION_RULES.requiredAndEndsWithMd],
			label: 'File name pattern',
		},
	]
}

export const validateCommand = (command: unknown, index: number): ValidationError[] => {
	const errors: ValidationError[] = []
	const commandNumber = index + 1

	if (!command || typeof command !== 'object') {
		errors.push({
			field: 'command',
			message: `Command ${commandNumber} is not a valid object`,
			commandIndex: index,
		})
		return errors
	}

	const fieldValidations = buildFieldValidations(command as Command)

	fieldValidations.forEach(({ field, value, rules, label }) => {
		if (typeof value !== 'string') {
			errors.push({
				field,
				message: `Command ${commandNumber}: ${label} must be a string`,
				commandIndex: index,
			})
		} else {
			const fieldError = validateField(value, rules)
			if (fieldError) {
				errors.push({
					field,
					message: `Command ${commandNumber}: ${fieldError}`,
					commandIndex: index,
				})
			}
		}
	})

	return errors
}

export const validateImportedSettings = (data: any): { isValid: boolean; errors: ValidationError[] } => {
	const errors: ValidationError[] = []

	// Check if data exists and has the right structure
	if (!data || typeof data !== 'object') {
		errors.push({ field: 'root', message: 'Invalid file format: expected JSON object' })
		return { isValid: false, errors }
	}

	if (!data.commands || !Array.isArray(data.commands)) {
		errors.push({ field: 'commands', message: 'Invalid format: missing or invalid commands array' })
		return { isValid: false, errors }
	}

	// Validate each command using the extracted function
	data.commands.forEach((command: any, index: number) => {
		const commandErrors = validateCommand(command, index)
		errors.push(...commandErrors)
	})

	return { isValid: errors.length === 0, errors }
}
