import React from 'react'
import type { CommandSettings } from '../constants'
import { CommandHeader } from './CommandHeader'
import { CommandName } from './CommandName'
import { TemplateFile } from './TemplateFile'
import { DestinationFolder } from './DestinationFolder'
import { FileName } from './FileName'

interface CommandCardProps {
	command: CommandSettings
	index: number
	onUpdate: (index: number, field: keyof CommandSettings, value: string) => void
	onDelete: (index: number) => void
}

export const CommandCard: React.FC<CommandCardProps> = ({ command, index, onUpdate, onDelete }) => {
	return (
		<div className="command-container">
			<CommandHeader index={index} onDelete={onDelete} />
			
			<div className="settings-grid">
				<CommandName 
					value={command.commandName}
					onChange={(value) => onUpdate(index, 'commandName', value)}
				/>

				<TemplateFile 
					value={command.templateFilePath}
					onChange={(value) => onUpdate(index, 'templateFilePath', value)}
				/>

				<DestinationFolder 
					value={command.destinationFolderPattern}
					onChange={(value) => onUpdate(index, 'destinationFolderPattern', value)}
				/>

				<FileName 
					value={command.fileNamePattern}
					onChange={(value) => onUpdate(index, 'fileNamePattern', value)}
				/>
			</div>
		</div>
	)
} 