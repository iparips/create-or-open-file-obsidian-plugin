import { describe, expect, it, vi, beforeEach } from 'vitest'
import { buildFieldValidations, validateCommand, validateImportedSettings } from '../importValidation'
import type { CommandConfig } from '../../../types'

// Mock the type guards
vi.mock('../typeGuards', () => ({
	isCommandSettings: vi.fn(),
	isImportedSettings: vi.fn(),
}))

import { isCommandSettings, isImportedSettings } from '../typeGuards'

describe('buildFieldValidations', () => {
	it('should build correct field validations for a command', () => {
		const command: CommandConfig = {
			commandName: 'test-command',
			templateFilePath: 'template.md',
			destinationFolderPattern: 'folder',
			fileNamePattern: 'file.md',
		}

		const validations = buildFieldValidations(command)

		expect(validations).toHaveLength(5)
		expect(validations[0]).toEqual({
			field: 'commandName',
			value: 'test-command',
			rules: expect.any(Array),
		})
		expect(validations[1]).toEqual({
			field: 'templateFilePath',
			value: 'template.md',
			rules: expect.any(Array),
		})
		expect(validations[2]).toEqual({
			field: 'destinationFolderPattern',
			value: 'folder',
			rules: expect.any(Array),
		})
		expect(validations[3]).toEqual({
			field: 'fileNamePattern',
			value: 'file.md',
			rules: expect.any(Array),
		})
		expect(validations[4]).toEqual({
			field: 'timeShift',
			value: undefined,
			rules: expect.any(Array),
		})
	})
})

describe('validateCommand', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should return no errors for valid command', () => {
		vi.mocked(isCommandSettings).mockReturnValue(true)

		const validCommand = {
			commandName: 'test-command',
			templateFilePath: 'template.md',
			destinationFolderPattern: 'folder',
			fileNamePattern: 'file.md',
		}

		const errors = validateCommand(validCommand, 0)

		expect(errors).toEqual([])
		expect(isCommandSettings).toHaveBeenCalledWith(validCommand)
	})

	it('should return no errors for command with empty templateFilePath', () => {
		vi.mocked(isCommandSettings).mockReturnValue(true)

		const validCommand = {
			commandName: 'test-command',
			templateFilePath: '',
			destinationFolderPattern: 'folder',
			fileNamePattern: 'file.md',
		}

		const errors = validateCommand(validCommand, 0)

		expect(errors).toEqual([])
	})

	it('should return error when type guard fails', () => {
		vi.mocked(isCommandSettings).mockReturnValue(false)

		const invalidCommand = null

		const errors = validateCommand(invalidCommand, 0)

		expect(errors).toHaveLength(1)
		expect(errors[0]).toEqual({
			field: 'command',
			message: 'Command 1 is not a valid object or has invalid field types',
			commandIndex: 0,
		})
		expect(isCommandSettings).toHaveBeenCalledWith(invalidCommand)
	})

	it('should return validation errors for empty required fields', () => {
		vi.mocked(isCommandSettings).mockReturnValue(true)

		const invalidCommand = {
			commandName: '',
			templateFilePath: 'template.md',
			destinationFolderPattern: '',
			fileNamePattern: '',
		}

		const errors = validateCommand(invalidCommand, 1)

		expect(errors).toHaveLength(3)
		expect(errors[0]).toEqual({
			field: 'commandName',
			message: 'Command 2: This field is mandatory',
			commandIndex: 1,
		})
		expect(errors[1]).toEqual({
			field: 'destinationFolderPattern',
			message: 'Command 2: This field is mandatory',
			commandIndex: 1,
		})
		expect(errors[2]).toEqual({
			field: 'fileNamePattern',
			message: 'Command 2: This field is mandatory',
			commandIndex: 1,
		})
	})

	it('should return validation error for template file without .md extension', () => {
		vi.mocked(isCommandSettings).mockReturnValue(true)

		const invalidCommand = {
			commandName: 'test-command',
			templateFilePath: 'template.txt',
			destinationFolderPattern: 'folder',
			fileNamePattern: 'file.md',
		}

		const errors = validateCommand(invalidCommand, 0)

		expect(errors).toHaveLength(1)
		expect(errors[0]).toEqual({
			field: 'templateFilePath',
			message: 'Command 1: File name should end with .md extension',
			commandIndex: 0,
		})
	})

	it('should return validation error for file name pattern without .md extension', () => {
		vi.mocked(isCommandSettings).mockReturnValue(true)

		const invalidCommand = {
			commandName: 'test-command',
			templateFilePath: 'template.md',
			destinationFolderPattern: 'folder',
			fileNamePattern: 'file.txt',
		}

		const errors = validateCommand(invalidCommand, 0)

		expect(errors).toHaveLength(1)
		expect(errors[0]).toEqual({
			field: 'fileNamePattern',
			message: 'Command 1: File name should end with .md extension',
			commandIndex: 0,
		})
	})

	it('should return multiple validation errors', () => {
		vi.mocked(isCommandSettings).mockReturnValue(true)

		const invalidCommand = {
			commandName: '',
			templateFilePath: 'template.txt',
			destinationFolderPattern: '',
			fileNamePattern: 'file.txt',
		}

		const errors = validateCommand(invalidCommand, 0)

		expect(errors).toHaveLength(4)
		expect(errors.map((e) => e.field)).toEqual([
			'commandName',
			'templateFilePath',
			'destinationFolderPattern',
			'fileNamePattern',
		])
	})
})

describe('validateImportedSettings', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should return valid result for correct data', () => {
		vi.mocked(isImportedSettings).mockReturnValue(true)
		vi.mocked(isCommandSettings).mockReturnValue(true)

		const validData = {
			commandConfigs: [
				{
					commandName: 'test-command-1',
					templateFilePath: 'template.md',
					destinationFolderPattern: 'folder',
					fileNamePattern: 'file.md',
				},
				{
					commandName: 'test-command-2',
					templateFilePath: '',
					destinationFolderPattern: 'another-folder',
					fileNamePattern: 'another-file.md',
				},
			],
		}

		const result = validateImportedSettings(validData)

		expect(result).toEqual({
			isValid: true,
			errors: [],
		})
		expect(isImportedSettings).toHaveBeenCalledWith(validData)
	})

	it('should return error when isImportedSettings fails', () => {
		vi.mocked(isImportedSettings).mockReturnValue(false)

		const result = validateImportedSettings(null)

		expect(result).toEqual({
			isValid: false,
			errors: [{ field: 'root', message: 'Invalid data format' }],
		})
		expect(isImportedSettings).toHaveBeenCalledWith(null)
	})

	it('should collect validation errors from multiple commands', () => {
		vi.mocked(isImportedSettings).mockReturnValue(true)
		vi.mocked(isCommandSettings).mockReturnValue(true)

		const invalidData = {
			commandConfigs: [
				{
					commandName: '',
					templateFilePath: 'template.md',
					destinationFolderPattern: 'folder',
					fileNamePattern: 'file.md',
				},
				{
					commandName: 'valid-command',
					templateFilePath: 'template.txt',
					destinationFolderPattern: '',
					fileNamePattern: 'file.md',
				},
			],
		}

		const result = validateImportedSettings(invalidData)

		expect(result.isValid).toBe(false)
		expect(result.errors).toHaveLength(3)

		// First command error
		expect(result.errors[0]).toEqual({
			field: 'commandName',
			message: 'Command 1: This field is mandatory',
			commandIndex: 0,
		})

		// Second command errors
		expect(result.errors[1]).toEqual({
			field: 'templateFilePath',
			message: 'Command 2: File name should end with .md extension',
			commandIndex: 1,
		})
		expect(result.errors[2]).toEqual({
			field: 'destinationFolderPattern',
			message: 'Command 2: This field is mandatory',
			commandIndex: 1,
		})
	})

	it('should handle empty commands array', () => {
		vi.mocked(isImportedSettings).mockReturnValue(true)

		const result = validateImportedSettings({ commandConfigs: [] })

		expect(result).toEqual({
			isValid: true,
			errors: [],
		})
	})
})
