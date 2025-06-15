import type { CommandConfig, ValidationError } from '../../../types'
import { validateField, VALIDATIONS, type ValidationRule } from './validateField'
import { isCommandSettings, isImportedSettings } from './typeGuards'
import { ValidationResult } from './validationResult'

export interface FieldValidation {
	field: keyof CommandConfig
	fieldDisplayName: string
	value: string | undefined
	rules: ValidationRule[]
}

const buildFieldValidations = (command: CommandConfig): FieldValidation[] => {
	return [
		{
			field: 'commandName',
			fieldDisplayName: 'Command Name',
			value: command.commandName,
			rules: [VALIDATIONS.required],
		},
		{
			field: 'templateFilePath',
			fieldDisplayName: 'Template File',
			value: command.templateFilePath,
			rules: [VALIDATIONS.endsWithMd],
		},
		{
			field: 'destinationFolderPattern',
			fieldDisplayName: 'Destination Folder',
			value: command.destinationFolderPattern,
			rules: [VALIDATIONS.required],
		},
		{
			field: 'fileNamePattern',
			fieldDisplayName: 'File Name',
			value: command.fileNamePattern,
			rules: [VALIDATIONS.requiredAndEndsWithMd],
		},
		{
			field: 'timeShift',
			fieldDisplayName: 'Time Shift',
			value: command.timeShift,
			rules: [], // Optional field, no validation rules needed
		},
	]
}

const validateCommand = (command: unknown, index: number): ValidationError[] => {
	if (!isCommandSettings(command)) {
		return [
			{
				field: 'command',
				fieldDisplayName: 'Command',
				message: 'Invalid object or field types',
				commandIndex: index,
			},
		]
	}

	const fieldValidations = buildFieldValidations(command)

	const errors: ValidationError[] = []
	fieldValidations.forEach(({ field, fieldDisplayName, value, rules }) => {
		const fieldError = validateField(rules, value)
		if (fieldError) {
			errors.push({
				field,
				fieldDisplayName,
				message: fieldError,
				commandIndex: index,
			})
		}
	})

	return errors
}

export const validateSettings = (data: unknown): ValidationResult => {
	if (!isImportedSettings(data)) {
		return new ValidationResult([{ field: 'root', fieldDisplayName: 'Settings', message: 'Invalid data format' }])
	}
	const errors = data.commandConfigs.flatMap((command, index) => validateCommand(command, index))
	return new ValidationResult(errors)
}
