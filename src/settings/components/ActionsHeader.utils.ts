import type { PluginSettings } from '../constants'
import type { SelectedFiles } from '../../types'
import { validateImportedSettings } from '../utils/importValidation'

export const processImportedSettings = async (
	{ filesContent }: SelectedFiles<string>,
	onSettingsImported: (settings: PluginSettings) => Promise<void>,
) => {
	try {
		const parsedData = JSON.parse(filesContent[0].content)
		const validationResult = validateImportedSettings(parsedData)

		if (!validationResult.isValid) {
			const errorMessages = validationResult.errors.map((error) => error.message).join('\n')
			alert(`Import failed due to validation errors:\n\n${errorMessages}`)
			return
		}

		await onSettingsImported(parsedData as PluginSettings)
	} catch (err: unknown) {
		alert('Import failed: Check your file and try again')
	}
}
