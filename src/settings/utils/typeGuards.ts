import type { CommandSettings, ImportedSettings } from '../types'

export function isString(value: unknown): value is string {
	return typeof value === 'string'
}

export function isObject(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function isCommandSettings(value: unknown): value is CommandSettings {
	if (!isObject(value)) return false

	const { commandName, templateFilePath, destinationFolderPattern, fileNamePattern } = value

	return (
		isString(commandName) &&
		(templateFilePath === undefined || isString(templateFilePath)) &&
		isString(destinationFolderPattern) &&
		isString(fileNamePattern)
	)
}

export function isImportedSettings(value: unknown): value is ImportedSettings {
	if (!isObject(value)) return false

	const { commands } = value
	if (!Array.isArray(commands)) return false

	return commands.every(isCommandSettings)
}
