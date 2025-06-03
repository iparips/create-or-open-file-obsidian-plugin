import { describe, expect, it } from 'vitest'
import { VALIDATION_RULES, validateField } from '../validation'

describe('VALIDATION_RULES', () => {
	describe('required', () => {
		it('should return error for empty string', () => {
			expect(VALIDATION_RULES.required('')).toBe('This field is mandatory')
		})

		it('should return error for whitespace-only string', () => {
			expect(VALIDATION_RULES.required('   ')).toBe('This field is mandatory')
			expect(VALIDATION_RULES.required('\t\n ')).toBe('This field is mandatory')
		})

		it('should return undefined for valid non-empty string', () => {
			expect(VALIDATION_RULES.required('valid text')).toBeUndefined()
			expect(VALIDATION_RULES.required('a')).toBeUndefined()
		})

		it('should return undefined for string with leading/trailing whitespace but content', () => {
			expect(VALIDATION_RULES.required('  valid  ')).toBeUndefined()
		})
	})

	describe('endsWithMd', () => {
		it('should return undefined for empty string (optional field)', () => {
			expect(VALIDATION_RULES.endsWithMd('')).toBeUndefined()
		})

		it('should return undefined for whitespace-only string', () => {
			expect(VALIDATION_RULES.endsWithMd('   ')).toBeUndefined()
		})

		it('should return error for non-empty string without .md extension', () => {
			expect(VALIDATION_RULES.endsWithMd('file.txt')).toBe('File name should end with .md extension')
			expect(VALIDATION_RULES.endsWithMd('file')).toBe('File name should end with .md extension')
			expect(VALIDATION_RULES.endsWithMd('file.pdf')).toBe('File name should end with .md extension')
		})

		it('should return undefined for string ending with .md', () => {
			expect(VALIDATION_RULES.endsWithMd('file.md')).toBeUndefined()
			expect(VALIDATION_RULES.endsWithMd('my-file.md')).toBeUndefined()
			expect(VALIDATION_RULES.endsWithMd('folder/file.md')).toBeUndefined()
		})

		it('should handle edge cases with .md in middle of filename', () => {
			expect(VALIDATION_RULES.endsWithMd('file.md.txt')).toBe('File name should end with .md extension')
			expect(VALIDATION_RULES.endsWithMd('my.md.file')).toBe('File name should end with .md extension')
		})
	})

	describe('requiredAndEndsWithMd', () => {
		it('should return error for empty string', () => {
			expect(VALIDATION_RULES.requiredAndEndsWithMd('')).toBe('This field is mandatory')
		})

		it('should return error for whitespace-only string', () => {
			expect(VALIDATION_RULES.requiredAndEndsWithMd('   ')).toBe('This field is mandatory')
		})

		it('should return error for non-empty string without .md extension', () => {
			expect(VALIDATION_RULES.requiredAndEndsWithMd('file.txt')).toBe('File name should end with .md extension')
			expect(VALIDATION_RULES.requiredAndEndsWithMd('file')).toBe('File name should end with .md extension')
		})

		it('should return undefined for valid .md file', () => {
			expect(VALIDATION_RULES.requiredAndEndsWithMd('file.md')).toBeUndefined()
			expect(VALIDATION_RULES.requiredAndEndsWithMd('my-file.md')).toBeUndefined()
		})

		it('should prioritize required validation over .md validation', () => {
			// Should return "mandatory" error, not ".md" error for empty strings
			expect(VALIDATION_RULES.requiredAndEndsWithMd('')).toBe('This field is mandatory')
			expect(VALIDATION_RULES.requiredAndEndsWithMd('   ')).toBe('This field is mandatory')
		})
	})
})

describe('validateField', () => {
	it('should return undefined when no rules provided', () => {
		expect(validateField('any value', [])).toBeUndefined()
	})

	it('should return undefined when all rules pass', () => {
		expect(validateField('file.md', [VALIDATION_RULES.required, VALIDATION_RULES.endsWithMd])).toBeUndefined()
	})

	it('should return first failing rule error', () => {
		// Empty string should fail required rule first
		expect(validateField('', [VALIDATION_RULES.required, VALIDATION_RULES.endsWithMd])).toBe('This field is mandatory')
	})

	it('should return first failing rule error when multiple rules fail', () => {
		// Required rule should be checked first, even though endsWithMd would also fail
		expect(validateField('', [VALIDATION_RULES.required, VALIDATION_RULES.endsWithMd])).toBe('This field is mandatory')
	})

	it('should return second rule error when first passes', () => {
		expect(validateField('file.txt', [VALIDATION_RULES.required, VALIDATION_RULES.endsWithMd])).toBe('File name should end with .md extension')
	})

	it('should work with single rule', () => {
		expect(validateField('', [VALIDATION_RULES.required])).toBe('This field is mandatory')
		expect(validateField('valid', [VALIDATION_RULES.required])).toBeUndefined()
	})

	it('should work with combined rule', () => {
		expect(validateField('', [VALIDATION_RULES.requiredAndEndsWithMd])).toBe('This field is mandatory')
		expect(validateField('file.txt', [VALIDATION_RULES.requiredAndEndsWithMd])).toBe('File name should end with .md extension')
		expect(validateField('file.md', [VALIDATION_RULES.requiredAndEndsWithMd])).toBeUndefined()
	})

	it('should handle rule order correctly', () => {
		// Order matters - first failing rule wins
		expect(validateField('file.txt', [VALIDATION_RULES.endsWithMd, VALIDATION_RULES.required])).toBe('File name should end with .md extension')
		expect(validateField('file.txt', [VALIDATION_RULES.required, VALIDATION_RULES.endsWithMd])).toBe('File name should end with .md extension')
	})
}) 