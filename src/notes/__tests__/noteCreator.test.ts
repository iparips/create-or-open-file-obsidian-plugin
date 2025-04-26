import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockApp, mockTFile, mockTFolder, mockVault } from '../../test-support/__mocks__/obsidian'
import { NoteCreator } from '../noteCreator'
import type { App, Vault } from 'obsidian'

// Mock obsidian module for import purposes
vi.mock('obsidian', () => import('../../test-support/__mocks__/obsidian'))

describe('NoteCreator', () => {
	let app: App
	let vault: Vault
	let noteCreator: NoteCreator
	const filePath = 'test/folder/file.md'
	const templatePath = 'templates/template.md'
	const folderPath = 'test/folder'

	beforeEach(() => {
		vault = mockVault()
		app = mockApp(vault)
		noteCreator = new NoteCreator(app)
	})

	describe('openOrCreateFileFromTemplate', () => {
		describe('when note file exists', () => {
			it('opens note file', async () => {
				const existingNoteFile = mockTFile(filePath)
				vi.spyOn(vault, 'getFileByPath').mockReturnValue(existingNoteFile)
				vi.spyOn(app.workspace, 'openLinkText').mockResolvedValue(undefined)

				const result = await noteCreator.openOrCreateFileFromTemplate(filePath, templatePath)
				expect(result).toBe('File opened successfully')
				expect(app.workspace.openLinkText).toHaveBeenCalledWith(filePath, folderPath)
			})
		})

		describe('when note file does not exist', () => {
			it('exits with error when template file is not found', async () => {
				vi.spyOn(vault, 'getFileByPath').mockReturnValue(null)
				vi.spyOn(vault, 'getFolderByPath').mockReturnValue(null)

				await expect(noteCreator.openOrCreateFileFromTemplate(filePath, templatePath)).rejects
					.toBe('Template file not found')
			})

			it('creates note directory when note directory is missing', async () => {
				vi.spyOn(vault, 'getFolderByPath').mockReturnValue(null)

				const templateFile = mockTFile(templatePath)
				vi.spyOn(vault, 'getFileByPath').mockImplementation((path) => (path === templatePath ? templateFile : null))
				vi.spyOn(vault, 'createFolder').mockResolvedValue(undefined)
				vi.spyOn(vault, 'read').mockResolvedValue('template content')
				vi.spyOn(vault, 'create').mockResolvedValue(mockTFile(filePath))
				vi.spyOn(app.workspace, 'openLinkText').mockResolvedValue(undefined)

				const result = await noteCreator.openOrCreateFileFromTemplate(filePath, templatePath)
				expect(result).toBe('Created new file from template: test/folder/file.md')
				expect(vault.createFolder).toHaveBeenCalledWith(folderPath)
				expect(vault.create).toHaveBeenCalledWith(filePath, 'template content')
			})

			it('creates new files from template when note directory is present', async () => {
				const templateFile = mockTFile(templatePath)
				const existingFolder = mockTFolder(folderPath)

				vi.spyOn(vault, 'getFileByPath').mockImplementation((path) => (path === templatePath ? templateFile : null))
				vi.spyOn(vault, 'getFolderByPath').mockReturnValue(existingFolder)
				vi.spyOn(vault, 'read').mockResolvedValue('template content')
				vi.spyOn(vault, 'create').mockResolvedValue(mockTFile(filePath))
				vi.spyOn(app.workspace, 'openLinkText').mockResolvedValue(undefined)

				const result = await noteCreator.openOrCreateFileFromTemplate(filePath, templatePath)

				expect(result).toBe('Created new file from template: test/folder/file.md')
				expect(vault.createFolder).not.toHaveBeenCalled()
				expect(vault.create).toHaveBeenCalledWith(filePath, 'template content')
			})
		})
	})
})
