import React from 'react'
import { saveAs } from 'file-saver'
import { useFilePicker } from 'use-file-picker'
import type { PluginSettings } from '../constants'
import { processImportedSettings } from './ActionsHeader.utils'
import type { SelectedFiles } from '../../types'

interface ActionsHeaderProps {
	settings: PluginSettings
	onSettingsImported: (settings: PluginSettings) => Promise<void>
	onAddCommand: () => void
}

export const ActionsHeader: React.FC<ActionsHeaderProps> = ({ settings, onSettingsImported, onAddCommand }) => {
	const exportSettings = (): void => {
		const dataStr: string = JSON.stringify(settings, null, 2)
		const blob: Blob = new Blob([dataStr], { type: 'application/json' })
		saveAs(blob, 'note-creation-commands-settings.json')
	}

	const { openFilePicker, loading } = useFilePicker({
		accept: '.json',
		multiple: false,
		readAs: 'Text',
		onFilesSuccessfullySelected: (selectedFiles: SelectedFiles<string>) =>
			processImportedSettings(selectedFiles, onSettingsImported),
	})

	return (
		<div className="button-container">
			<button onClick={onAddCommand}>Add Command</button>
			<button onClick={openFilePicker} disabled={loading}>
				{loading ? 'Loading...' : 'Import Settings'}
			</button>
			<button onClick={exportSettings}>Export Settings</button>
		</div>
	)
}
