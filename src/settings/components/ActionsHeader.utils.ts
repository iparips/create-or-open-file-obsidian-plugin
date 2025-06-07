import type { PluginSettings } from '../../types'
import type { SelectedFiles } from '../../types'
import { validateSettings } from '../utils/validateSettings'

export const processImportedSettings = async (
	{ filesContent }: SelectedFiles<string>,
	onSettingsImported: (settings: PluginSettings) => Promise<void>,
) => {
	try {
		const parsedData = JSON.parse(filesContent[0].content)
		const validationResult = validateSettings(parsedData)

		if (!validationResult.isValid) {
			const errorMessages = validationResult.getErrorSummaryText()
			alert(`Import failed due to validation errors:\n\n${errorMessages}`)
			return
		}

		await onSettingsImported(parsedData as PluginSettings)
	} catch (err: unknown) {
		alert('Import failed: Check your file and try again')
	}
}
