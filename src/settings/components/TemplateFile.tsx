import React from 'react'

interface TemplateFileProps {
	value: string
	onChange: (value: string) => void
	onBlur?: (value: string) => void
	error?: string
}

export const TemplateFile: React.FC<TemplateFileProps> = ({ value, onChange, onBlur, error }) => {
	return (
		<div className="setting-item">
			<div>
				<div className="setting-item-name">Template File</div>
				<div className="setting-item-description">Path to the template file</div>
			</div>
			<div>
				{error && <div style={{ color: 'red', fontSize: '12px', marginBottom: '4px' }}>{error}</div>}
				<input
					type="text"
					className={`w-full ${error ? 'error' : ''}`}
					style={{ borderColor: error ? 'red' : undefined }}
					placeholder="00 - Meta/Templates/shopping-list-template.md"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onBlur={(e) => onBlur?.(e.target.value)}
				/>
			</div>
		</div>
	)
}
