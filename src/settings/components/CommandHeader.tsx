import React from 'react'

interface CommandHeaderProps {
	index: number
	onDelete: (index: number) => void
}

export const CommandHeader: React.FC<CommandHeaderProps> = ({ index, onDelete }) => {
	return (
		<div className="command-header">
			<h3>Command {index + 1}</h3>
			<button 
				className="mod-warning"
				onClick={() => onDelete(index)}
			>
				Delete
			</button>
		</div>
	)
} 