import React from 'react'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { SettingsComponent } from '../index'
import type { CommandSettings, PluginSettings } from '../../constants'

// Mock the child components to isolate our tests
vi.mock('../ImportExportSettings', () => ({
	ImportExportSettings: ({ onSettingsImported }: { onSettingsImported: (settings: PluginSettings) => void }) => (
		<div data-testid="import-export">
			<button
				onClick={() =>
					onSettingsImported({
						commands: [
							{ commandName: 'Imported', templateFilePath: '', destinationFolderPattern: '', fileNamePattern: '' },
						],
					})
				}
			>
				Import
			</button>
		</div>
	),
}))

vi.mock('../CommandCard', () => ({
	CommandCard: ({
		command,
		index,
		onUpdate,
		onDelete,
	}: {
		command: CommandSettings
		index: number
		onUpdate: (index: number, field: keyof CommandSettings, value: string) => void
		onDelete: (index: number) => void
	}) => (
		<div data-testid={`command-card-${index}`}>
			<input
				data-testid={`command-name-${index}`}
				value={command.commandName}
				onChange={(e) => onUpdate(index, 'commandName', e.target.value)}
			/>
			<button data-testid={`delete-${index}`} onClick={() => onDelete(index)}>
				Delete
			</button>
		</div>
	),
}))

describe('SettingsComponent', () => {
	const mockSaveSettings = vi.fn()
	let mockSettings: PluginSettings

	beforeEach(() => {
		vi.clearAllMocks()
		mockSettings = {
			commands: [
				{
					commandName: 'Test Command 1',
					templateFilePath: 'template1.md',
					destinationFolderPattern: 'folder1',
					fileNamePattern: 'file1.md',
				},
			],
		}
	})

	afterEach(() => {
		cleanup()
	})

	it('renders with initial settings', () => {
		render(<SettingsComponent settings={mockSettings} saveSettings={mockSaveSettings} />)

		expect(screen.getByText('Note Creation Commands')).toBeDefined()
		expect(screen.getByTestId('command-card-0')).toBeDefined()
		expect(screen.getByDisplayValue('Test Command 1')).toBeDefined()
	})

	describe('updateCommand', () => {
		it('updates local state and calls saveSettings when command name is changed', async () => {
			const user = userEvent.setup()
			render(<SettingsComponent settings={mockSettings} saveSettings={mockSaveSettings} />)

			const commandNameInput = screen.getByTestId('command-name-0') as HTMLInputElement

			await user.clear(commandNameInput)
			await user.type(commandNameInput, 'Updated Command Name')

			// Local state should update immediately (input shows new value)
			expect(commandNameInput.value).toBe('Updated Command Name')

			// saveSettings should be called with updated settings
			await waitFor(() => {
				expect(mockSaveSettings).toHaveBeenCalledWith({
					commands: [
						{
							commandName: 'Updated Command Name',
							templateFilePath: 'template1.md',
							destinationFolderPattern: 'folder1',
							fileNamePattern: 'file1.md',
						},
					],
				})
			})
		})
	})

	describe('deleteCommand', () => {
		it('removes command and calls saveSettings', async () => {
			const user = userEvent.setup()
			render(<SettingsComponent settings={mockSettings} saveSettings={mockSaveSettings} />)

			const deleteButton = screen.getByTestId('delete-0')
			await user.click(deleteButton)

			await waitFor(() => {
				expect(mockSaveSettings).toHaveBeenCalledWith({
					commands: [], // No commands remain after deleting the only one
				})
			})
		})
	})

	describe('addCommand', () => {
		it('adds new command with default values and calls saveSettings', async () => {
			const user = userEvent.setup()
			render(<SettingsComponent settings={mockSettings} saveSettings={mockSaveSettings} />)

			const addButton = screen.getByText('Add Command')
			await user.click(addButton)

			// Check that saveSettings was called with the expected commands
			expect(mockSaveSettings).toHaveBeenCalled()
			expect(mockSaveSettings.mock.lastCall).toEqual([{
				commands: [
					{
						commandName: 'Test Command 1',
						templateFilePath: 'template1.md',
						destinationFolderPattern: 'folder1',
						fileNamePattern: 'file1.md',
					},
					{
						commandName: 'New Command',
						templateFilePath: '',
						destinationFolderPattern: '',
						fileNamePattern: '',
					},
				],
			}])
		})
	})

	describe('handleSettingsImported', () => {
		it('updates settings when import button is clicked', async () => {
			const user = userEvent.setup()
			render(<SettingsComponent settings={mockSettings} saveSettings={mockSaveSettings} />)

			const importButton = screen.getByText('Import')
			await user.click(importButton)

			await waitFor(() => {
				expect(mockSaveSettings).toHaveBeenCalledWith({
					commands: [
						{
							commandName: 'Imported',
							templateFilePath: '',
							destinationFolderPattern: '',
							fileNamePattern: '',
						},
					],
				})
			})
		})
	})

	describe('local state management', () => {
		it('maintains local state independently of prop changes', async () => {
			const user = userEvent.setup()
			const { rerender } = render(<SettingsComponent settings={mockSettings} saveSettings={mockSaveSettings} />)

			// Change local state
			const commandNameInput = screen.getByTestId('command-name-0') as HTMLInputElement
			await user.clear(commandNameInput)
			await user.type(commandNameInput, 'Local Change')

			expect(commandNameInput.value).toBe('Local Change')

			// Re-render with same props (simulating parent not re-rendering yet)
			rerender(<SettingsComponent settings={mockSettings} saveSettings={mockSaveSettings} />)

			// Local state should persist
			expect(commandNameInput.value).toBe('Local Change')
		})
	})
})
