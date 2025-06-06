import { Notice } from 'obsidian'
import { NoteCreator } from '../notes/noteCreator'
import { addDays, format } from 'date-fns'
import { ObsidianAdapter } from '../notes/obsidianAdapter'
import { CommandConfig } from '../types'

function processPattern(pattern: string, date: Date): string {
	return pattern
		.replace(/{week}/g, format(date, 'II'))
		.replace(/{year}/g, format(date, 'yyyy'))
		.replace(/{month}/g, format(date, 'MM'))
		.replace(/{day}/g, format(date, 'dd'))
		.replace(/{date}/g, format(date, 'yyyy-MM-dd'))
		.replace(/{time}/g, format(date, 'HH-mm-ss'))
		.replace(/{dow}/g, format(date, 'EEE'))
}

function buildNoteFilePath(commandName: string, destinationFolderPattern: string, fileNamePattern: string) {
	const now = new Date()
	const isTomorrowCommand = commandName.toLowerCase().includes('tomorrow')
	const targetDate = isTomorrowCommand ? addDays(now, 1) : now
	const destinationFolder = processPattern(destinationFolderPattern, targetDate)
	const fileName = processPattern(fileNamePattern, targetDate)
	return `${destinationFolder}/${fileName}`
}

export function createOrOpenFileCommandCallback(obsidianAdapter: ObsidianAdapter, commandConfig: CommandConfig) {
	return async () => {
		const { commandName, destinationFolderPattern, fileNamePattern, templateFilePath } = commandConfig
		const noteFilePath = buildNoteFilePath(commandName, destinationFolderPattern, fileNamePattern)
		await new NoteCreator(obsidianAdapter)
			.openOrCreateFileFromTemplate(noteFilePath, templateFilePath)
			.then((outcome) => new Notice(outcome))
			.catch((err) => new Notice(err))
	}
}
