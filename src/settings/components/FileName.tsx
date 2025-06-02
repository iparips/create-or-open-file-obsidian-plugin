import React from 'react'

interface FileNameProps {
	value: string
	onChange: (value: string) => void
	onBlur?: (value: string) => void
	error?: string
}

export const FileName: React.FC<FileNameProps> = ({ value, onChange, onBlur, error }) => {
	return (
		<div className="setting-item">
			<div>
				<div className="setting-item-name">File Name</div>
				<div className="setting-item-description">Pattern for the file name</div>
			</div>
			<div>
				{error && <div style={{ color: 'red', fontSize: '12px', marginBottom: '4px' }}>{error}</div>}
				<input
					type="text"
					className={`w-full ${error ? 'error' : ''}`}
					style={{ borderColor: error ? 'red' : undefined }}
					placeholder="shopping-list.md"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onBlur={(e) => onBlur?.(e.target.value)}
				/>
			</div>
		</div>
	)
}
