import React from 'react'

interface FileNameProps {
	value: string
	onChange: (value: string) => void
}

export const FileName: React.FC<FileNameProps> = ({ value, onChange }) => {
	return (
		<div className="setting-item">
			<div>
				<div className="setting-item-name">File Name</div>
				<div className="setting-item-description">
					Pattern for the file name
				</div>
			</div>
			<input
				type="text"
				className="w-full"
				placeholder="shopping-list.md"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	)
} 