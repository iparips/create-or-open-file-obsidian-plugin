import React from 'react'

interface TemplateFileProps {
	value: string
	onChange: (value: string) => void
}

export const TemplateFile: React.FC<TemplateFileProps> = ({ value, onChange }) => {
	return (
		<div className="setting-item">
			<div>
				<div className="setting-item-name">Template File</div>
				<div className="setting-item-description">
					Path to the template file
				</div>
			</div>
			<input
				type="text"
				className="w-full"
				placeholder="00 - Meta/Templates/shopping-list-template.md"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	)
} 