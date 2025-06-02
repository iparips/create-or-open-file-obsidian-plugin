import React from 'react'

interface DestinationFolderProps {
	value: string
	onChange: (value: string) => void
	onBlur?: (value: string) => void
	error?: string
}

export const DestinationFolder: React.FC<DestinationFolderProps> = ({ value, onChange, onBlur, error }) => {
	return (
		<div className="setting-item">
			<div>
				<div className="setting-item-name">Destination Folder</div>
				<div className="setting-item-description">Pattern for destination folder</div>
			</div>
			<div>
				{error && <div style={{ color: 'red', fontSize: '12px', marginBottom: '4px' }}>{error}</div>}
				<input
					type="text"
					className={`w-full ${error ? 'error' : ''}`}
					style={{ borderColor: error ? 'red' : undefined }}
					placeholder="01 - Journal/Weekly/Week-{week}"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onBlur={(e) => onBlur?.(e.target.value)}
				/>
			</div>
		</div>
	)
}
