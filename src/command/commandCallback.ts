import { Notice } from 'obsidian'
import { NoteCreator } from '../notes/noteCreator'
import { ObsidianAdapter } from '../notes/obsidianAdapter'
import { CommandConfig } from '../types'
import { processPattern } from './patternParser'

function buildNoteFilePath(destinationFolderPattern: string, fileNamePattern: string, timeShift?: string) {
	const now = new Date()
	const destinationFolder = processPattern(destinationFolderPattern, now, timeShift)
	const fileName = processPattern(fileNamePattern, now, timeShift)
	return `${destinationFolder}/${fileName}`
}

export function createOrOpenFileCommandCallback(obsidianAdapter: ObsidianAdapter, commandConfig: CommandConfig) {
	return async () => {
		const { destinationFolderPattern, fileNamePattern, templateFilePath, timeShift } = commandConfig
		const noteFilePath = buildNoteFilePath(destinationFolderPattern, fileNamePattern, timeShift)
		await new NoteCreator(obsidianAdapter)
			.openOrCreateFileFromTemplate(noteFilePath, templateFilePath)
			.then((outcome) => new Notice(outcome))
			.catch((err) => new Notice(err))
	}
}
