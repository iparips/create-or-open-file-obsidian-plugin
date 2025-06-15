import { describe, expect, it, vi, beforeEach } from 'vitest'
import { validateSettings } from '../../validation/validateSettings'
import { ValidationResult } from '../../validation/validationResult'
import type { CommandConfig } from '../../../../types'

// Mock the type guards
vi.mock('../../validation/typeGuards', () => ({
	isCommandSettings: vi.fn(),
	isImportedSettings: vi.fn(),
}))

import { isCommandSettings, isImportedSettings } from '../../validation/typeGuards'

function assertResultIsValid(result: ValidationResult) {
	expect(result).toBeInstanceOf(ValidationResult)
	expect(result.isValid).toBe(true)
	expect(result.errors).toEqual([])
	expect(result.hasErrors()).toBe(false)
	expect(result.getErrorCount()).toBe(0)
}

function buildCommandConfig(partialConfig: Partial<CommandConfig> = {}) {
	return {
		commandName: 'test-command',
		templateFilePath: 'template.md',
		destinationFolderPattern: 'folder',
		fileNamePattern: 'file.md',
		...partialConfig,
	}
}

describe('validateSettings', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('success cases', () => {
		it('returns valid result for correct data', () => {
			vi.mocked(isImportedSettings).mockReturnValue(true)
			vi.mocked(isCommandSettings).mockReturnValue(true)

			const validData = {
				commandConfigs: [buildCommandConfig()],
			}

			const result = validateSettings(validData)

			expect(isImportedSettings).toHaveBeenCalledWith(validData)
			assertResultIsValid(result)
		})

		it('returns valid result for an empty array of commands', () => {
			vi.mocked(isImportedSettings).mockReturnValue(true)

			const result = validateSettings({ commandConfigs: [] })

			assertResultIsValid(result)
		})
	})

	describe('file extension checks', () => {
		it('template file extension should be .md', () => {
			vi.mocked(isImportedSettings).mockReturnValue(true)
			vi.mocked(isCommandSettings).mockReturnValue(true)

			const invalidData = {
				commandConfigs: [buildCommandConfig({ templateFilePath: 'template.txt' })],
			}

			const result = validateSettings(invalidData)

			expect(result).toBeInstanceOf(ValidationResult)
			expect(result.isValid).toBe(false)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0]).toEqual({
				field: 'templateFilePath',
				fieldDisplayName: 'Template File',
				message: 'File name should end with .md extension',
				commandIndex: 0,
			})
		})

		it('file name extension should be .md', () => {
			vi.mocked(isImportedSettings).mockReturnValue(true)
			vi.mocked(isCommandSettings).mockReturnValue(true)

			const invalidData = {
				commandConfigs: [buildCommandConfig({ fileNamePattern: 'file.txt' })],
			}

			const result = validateSettings(invalidData)

			expect(result).toBeInstanceOf(ValidationResult)
			expect(result.isValid).toBe(false)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0]).toEqual({
				field: 'fileNamePattern',
				fieldDisplayName: 'File Name',
				message: 'File name should end with .md extension',
				commandIndex: 0,
			})
		})
	})

	it('should validate required fields', () => {
		vi.mocked(isImportedSettings).mockReturnValue(true)
		vi.mocked(isCommandSettings).mockReturnValue(true)

		const invalidData = {
			commandConfigs: [
				{
					commandName: '',
					destinationFolderPattern: '',
					fileNamePattern: '',
				},
			],
		}

		const result = validateSettings(invalidData)

		expect(result).toBeInstanceOf(ValidationResult)
		expect(result.isValid).toBe(false)
		expect(result.errors).toHaveLength(3)

		expect(result.errors[0]).toEqual({
			field: 'commandName',
			fieldDisplayName: 'Command Name',
			message: 'This field is mandatory',
			commandIndex: 0,
		})
		expect(result.errors[1]).toEqual({
			field: 'destinationFolderPattern',
			fieldDisplayName: 'Destination Folder',
			message: 'This field is mandatory',
			commandIndex: 0,
		})
		expect(result.errors[2]).toEqual({
			field: 'fileNamePattern',
			fieldDisplayName: 'File Name',
			message: 'This field is mandatory',
			commandIndex: 0,
		})
	})

	describe('type guard checks', () => {
		it('returns error when is data is not of ImportedSettings type', () => {
			vi.mocked(isImportedSettings).mockReturnValue(false)

			const result = validateSettings(null)

			expect(result).toBeInstanceOf(ValidationResult)
			expect(result.isValid).toBe(false)
			expect(result.errors).toEqual([{ field: 'root', fieldDisplayName: 'Settings', message: 'Invalid data format' }])
			expect(result.hasErrors()).toBe(true)
			expect(result.getErrorCount()).toBe(1)
			expect(isImportedSettings).toHaveBeenCalledWith(null)
		})

		it('returns error when commandSettings object has incorrect shape', () => {
			vi.mocked(isImportedSettings).mockReturnValue(true)
			vi.mocked(isCommandSettings).mockReturnValue(false)

			const invalidData = {
				commandConfigs: [null],
			}

			const result = validateSettings(invalidData)

			expect(result).toBeInstanceOf(ValidationResult)
			expect(result.isValid).toBe(false)
			expect(result.errors).toHaveLength(1)

			expect(result.errors[0]).toEqual({
				field: 'command',
				fieldDisplayName: 'Command',
				message: 'Invalid object or field types',
				commandIndex: 0,
			})
		})
	})
})
