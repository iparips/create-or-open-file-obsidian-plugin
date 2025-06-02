import React from 'react'

interface CommandNameProps {
	value: string
	onChange: (value: string) => void
}

export const CommandName: React.FC<CommandNameProps> = ({ value, onChange }) => {
	return (
		<div className="setting-item">
			<div>
				<div className="setting-item-name">Command Name</div>
				<div className="setting-item-description">
					The name of the command that will appear in Obsidian command palette
				</div>
			</div>
			<input
				type="text"
				className="w-full"
				placeholder="Enter command name"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	)
} 