export type ValidationRule = (value?: string) => string | undefined

export const VALIDATIONS = {
	required: (value?: string) => (!value || value.trim() === '' ? 'This field is mandatory' : undefined),
	endsWithMd: (value?: string) =>
		value && value.trim() !== '' && !value.endsWith('.md') ? 'File name should end with .md extension' : undefined,
	requiredAndEndsWithMd: (value?: string) => {
		if (!value || value.trim() === '') return 'This field is mandatory'
		if (!value.endsWith('.md')) return 'File name should end with .md extension'
		return undefined
	},
}
