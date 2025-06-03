export type ValidationRule = (value: string) => string | undefined

export const VALIDATION_RULES = {
	required: (value: string) => value.trim() === '' ? 'This field is mandatory' : undefined,
	endsWithMd: (value: string) => (value.trim() !== '' && !value.endsWith('.md')) ? 'File name should end with .md extension' : undefined,
	requiredAndEndsWithMd: (value: string) => {
		if (value.trim() === '') return 'This field is mandatory'
		if (!value.endsWith('.md')) return 'File name should end with .md extension'
		return undefined
	}
}

export const validateField = (value: string, rules: ValidationRule[]): string | undefined => {
	const firstApplicableRule = rules.find(rule => rule(value))
	return firstApplicableRule ? firstApplicableRule(value) : undefined
} 