import { describe, expect, it } from 'vitest'
import { VALIDATIONS } from '../../validation/validations'

describe('VALIDATIONS', () => {
	describe('required', () => {
		it('should return error for empty string', () => {
			expect(VALIDATIONS.required('')).toBe('This field is mandatory')
		})

		it('should return error for whitespace-only string', () => {
			expect(VALIDATIONS.required('   ')).toBe('This field is mandatory')
			expect(VALIDATIONS.required('\t\n ')).toBe('This field is mandatory')
		})

		it('should return error for undefined', () => {
			expect(VALIDATIONS.required(undefined)).toBe('This field is mandatory')
		})

		it('should return undefined for valid non-empty string', () => {
			expect(VALIDATIONS.required('valid text')).toBeUndefined()
			expect(VALIDATIONS.required('a')).toBeUndefined()
		})

		it('should return undefined for string with leading/trailing whitespace but content', () => {
			expect(VALIDATIONS.required('  valid  ')).toBeUndefined()
		})
	})

	describe('endsWithMd', () => {
		it('should return undefined for empty string (optional field)', () => {
			expect(VALIDATIONS.endsWithMd('')).toBeUndefined()
		})

		it('should return undefined for undefined (optional field)', () => {
			expect(VALIDATIONS.endsWithMd(undefined)).toBeUndefined()
		})

		it('should return undefined for whitespace-only string', () => {
			expect(VALIDATIONS.endsWithMd('   ')).toBeUndefined()
		})

		it('should return error for non-empty string without .md extension', () => {
			expect(VALIDATIONS.endsWithMd('file.txt')).toBe('File name should end with .md extension')
			expect(VALIDATIONS.endsWithMd('file')).toBe('File name should end with .md extension')
			expect(VALIDATIONS.endsWithMd('file.pdf')).toBe('File name should end with .md extension')
		})

		it('should return undefined for string ending with .md', () => {
			expect(VALIDATIONS.endsWithMd('file.md')).toBeUndefined()
			expect(VALIDATIONS.endsWithMd('my-file.md')).toBeUndefined()
			expect(VALIDATIONS.endsWithMd('folder/file.md')).toBeUndefined()
		})

		it('should handle edge cases with .md in middle of filename', () => {
			expect(VALIDATIONS.endsWithMd('file.md.txt')).toBe('File name should end with .md extension')
			expect(VALIDATIONS.endsWithMd('my.md.file')).toBe('File name should end with .md extension')
		})
	})

	describe('requiredAndEndsWithMd', () => {
		it('should return error for empty string', () => {
			expect(VALIDATIONS.requiredAndEndsWithMd('')).toBe('This field is mandatory')
		})

		it('should return error for undefined', () => {
			expect(VALIDATIONS.requiredAndEndsWithMd(undefined)).toBe('This field is mandatory')
		})

		it('should return error for whitespace-only string', () => {
			expect(VALIDATIONS.requiredAndEndsWithMd('   ')).toBe('This field is mandatory')
		})

		it('should return error for non-empty string without .md extension', () => {
			expect(VALIDATIONS.requiredAndEndsWithMd('file.txt')).toBe('File name should end with .md extension')
			expect(VALIDATIONS.requiredAndEndsWithMd('file')).toBe('File name should end with .md extension')
		})

		it('should return undefined for valid .md file', () => {
			expect(VALIDATIONS.requiredAndEndsWithMd('file.md')).toBeUndefined()
			expect(VALIDATIONS.requiredAndEndsWithMd('my-file.md')).toBeUndefined()
		})

		it('should prioritize required validation over .md validation', () => {
			// Should return "mandatory" error, not ".md" error for empty strings
			expect(VALIDATIONS.requiredAndEndsWithMd('')).toBe('This field is mandatory')
			expect(VALIDATIONS.requiredAndEndsWithMd('   ')).toBe('This field is mandatory')
		})
	})
})
