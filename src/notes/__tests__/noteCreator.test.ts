import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockApp, mockTFile } from '../../test-support/__mocks__/obsidian'
import { NoteCreator } from '../noteCreator'
import { ObsidianAdapter } from '../obsidianAdapter'
import type { App } from 'obsidian'

// Mock obsidian module for import purposes
vi.mock('obsidian', () => import('../../test-support/__mocks__/obsidian'))

describe('NoteCreator', () => {
	let app: App
	let adapter: ObsidianAdapter
	let noteCreator: NoteCreator
	const noteFilePath = 'test/folder/file.md'
	const templateFilePath = 'templates/template.md'

	beforeEach(() => {
		app = mockApp()
		adapter = new ObsidianAdapter(app)
		noteCreator = new NoteCreator(adapter)
	})

	describe('openOrCreateFileFromTemplate', () => {
		it('opens existing file when it exists', async () => {
			vi.spyOn(adapter, 'doesFileExist').mockReturnValue(true)
			vi.spyOn(adapter, 'openFile').mockResolvedValue('File opened successfully')

			const result = await noteCreator.openOrCreateFileFromTemplate(noteFilePath, templateFilePath)

			expect(adapter.doesFileExist).toHaveBeenCalledWith(noteFilePath)
			expect(adapter.openFile).toHaveBeenCalledWith(noteFilePath)
			expect(result).toBe('File opened successfully')
		})

		it('creates new file from template when file does not exist', async () => {
			vi.spyOn(adapter, 'doesFileExist').mockReturnValue(false)
			vi.spyOn(adapter, 'createFileAndFolder').mockResolvedValue(mockTFile(noteFilePath))
			vi.spyOn(adapter, 'openFile').mockResolvedValue('File opened successfully')

			const result = await noteCreator.openOrCreateFileFromTemplate(noteFilePath, templateFilePath)

			expect(adapter.doesFileExist).toHaveBeenCalledWith(noteFilePath)
			expect(adapter.createFileAndFolder).toHaveBeenCalledWith(noteFilePath, templateFilePath)
			expect(adapter.openFile).toHaveBeenCalledWith(noteFilePath)
			expect(result).toBe('File opened successfully')
		})

		it('propagates error when template file is not found', async () => {
			vi.spyOn(adapter, 'doesFileExist').mockReturnValue(false)
			vi.spyOn(adapter, 'createFileAndFolder').mockRejectedValue('Template file not found')

			await expect(noteCreator.openOrCreateFileFromTemplate(noteFilePath, templateFilePath)).rejects.toBe(
				'Template file not found',
			)
		})

		it('propagates error when file cannot be opened', async () => {
			vi.spyOn(adapter, 'doesFileExist').mockReturnValue(true)
			vi.spyOn(adapter, 'openFile').mockRejectedValue('Could not open file')

			await expect(noteCreator.openOrCreateFileFromTemplate(noteFilePath, templateFilePath)).rejects.toBe(
				'Could not open file',
			)
		})
	})
})
