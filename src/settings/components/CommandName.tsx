import React from 'react'

interface CommandNameProps {
	value: string
	onChange: (value: string) => void
	onBlur?: (value: string) => void
	error?: string
}

export const CommandName: React.FC<CommandNameProps> = ({ value, onChange, onBlur, error }) => {
	return (
		<div className="setting-item">
			<div>
				<div className="setting-item-name">Command Name</div>
				<div className="setting-item-description">
					The name of the command that will appear in Obsidian command palette
				</div>
			</div>
			<div>
				{error && <div style={{ color: 'red', fontSize: '12px', marginBottom: '4px' }}>{error}</div>}
				<input
					type="text"
					className={`w-full ${error ? 'error' : ''}`}
					style={{ borderColor: error ? 'red' : undefined }}
					placeholder="Enter command name"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onBlur={(e) => onBlur?.(e.target.value)}
				/>
			</div>
		</div>
	)
}
