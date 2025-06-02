import React from 'react'

interface DestinationFolderProps {
	value: string
	onChange: (value: string) => void
}

export const DestinationFolder: React.FC<DestinationFolderProps> = ({ value, onChange }) => {
	return (
		<div className="setting-item">
			<div>
				<div className="setting-item-name">Destination Folder</div>
				<div className="setting-item-description">
					Pattern for destination folder
				</div>
			</div>
			<input
				type="text"
				className="w-full"
				placeholder="01 - Journal/Weekly/Week-{week}"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	)
} 