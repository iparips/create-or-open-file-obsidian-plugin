import type { ValidationError, CommandConfig } from '../../types'
import { validateField, VALIDATION_RULES, type ValidationRule } from './validation'
import { isImportedSettings, isCommandSettings } from './typeGuards'

export interface FieldValidation {
	field: keyof CommandConfig
	value: string | undefined
	rules: ValidationRule[]
}

export const buildFieldValidations = (command: CommandConfig): FieldValidation[] => {
	return [
		{
			field: 'commandName',
			value: command.commandName,
			rules: [VALIDATION_RULES.required],
		},
		{
			field: 'templateFilePath',
			value: command.templateFilePath,
			rules: [VALIDATION_RULES.endsWithMd],
		},
		{
			field: 'destinationFolderPattern',
			value: command.destinationFolderPattern,
			rules: [VALIDATION_RULES.required],
		},
		{
			field: 'fileNamePattern',
			value: command.fileNamePattern,
			rules: [VALIDATION_RULES.requiredAndEndsWithMd],
		},
	]
}

export const validateCommand = (command: unknown, index: number): ValidationError[] => {
	const commandNumber = index + 1

	if (!isCommandSettings(command)) {
		return [
			{
				field: 'command',
				message: `Command ${commandNumber} is not a valid object or has invalid field types`,
				commandIndex: index,
			},
		]
	}

	const fieldValidations = buildFieldValidations(command)

	const errors: ValidationError[] = []
	fieldValidations.forEach(({ field, value, rules }) => {
		const fieldError = validateField(rules, value)
		if (fieldError) {
			errors.push({
				field,
				message: `Command ${commandNumber}: ${fieldError}`,
				commandIndex: index,
			})
		}
	})

	return errors
}

export const validateImportedSettings = (data: unknown): { isValid: boolean; errors: ValidationError[] } => {
	if (!isImportedSettings(data)) {
		return { isValid: false, errors: [{ field: 'root', message: 'Invalid data format' }] }
	}
	const errors = data.commandConfigs.flatMap((command, index) => validateCommand(command, index))
	return { isValid: errors.length === 0, errors }
}
