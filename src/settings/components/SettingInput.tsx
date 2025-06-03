import React from 'react'

interface SettingInputProps {
	name: string
	description: string
	placeholder: string
	value: string
	onChange: (value: string) => void
	onBlur?: (value: string) => void
	error?: string
}

export const SettingInput: React.FC<SettingInputProps> = ({ 
	name, 
	description, 
	placeholder, 
	value, 
	onChange, 
	onBlur, 
	error 
}) => {
	return (
		<div className="setting-item">
			<div>
				<div className="setting-item-name">{name}</div>
				<div className="setting-item-description">{description}</div>
			</div>
			<div>
				{error && <div style={{ color: 'red', fontSize: '12px', marginBottom: '4px' }}>{error}</div>}
				<input
					type="text"
					className={`w-full ${error ? 'error' : ''}`}
					style={{ borderColor: error ? 'red' : undefined }}
					placeholder={placeholder}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onBlur={(e) => onBlur?.(e.target.value)}
				/>
			</div>
		</div>
	)
} 