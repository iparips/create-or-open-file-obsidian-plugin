import React from 'react'
import type { PluginSettings } from '../constants'

interface ImportExportSettingsProps {
	settings: PluginSettings
	onSettingsImported: (settings: PluginSettings) => Promise<void>
}

export const ImportExportSettings: React.FC<ImportExportSettingsProps> = ({
	settings,
	onSettingsImported
}) => {
	const exportSettings = () => {
		const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'note-creation-commands-settings.json'
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}

	const importSettings = () => {
		const input = document.createElement('input')
		input.type = 'file'
		input.accept = '.json'
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0]
			if (file) {
				try {
					const content = await file.text()
					const importedSettings = JSON.parse(content)
					await onSettingsImported(importedSettings)
				} catch (err) {
					console.error('Failed to import settings:', err)
				}
			}
		}
		input.click()
	}

	return (
		<div className="button-container">
			<button onClick={importSettings}>Import Settings</button>
			<button onClick={exportSettings}>Export Settings</button>
		</div>
	)
}
