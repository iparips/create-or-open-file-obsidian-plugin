import { addDays, addMonths, addWeeks, addYears, format } from 'date-fns'

/**
 * Available pattern placeholder units
 */
export const PATTERN_UNITS = {
	YEAR: 'year',
	MONTH: 'month',
	DAY: 'day',
	DATE: 'date',
	TIME: 'time',
	WEEK: 'week',
	DOW: 'dow',
} as const

/**
 * Available time shift units (subset of pattern units)
 */
export const TIME_SHIFT_UNITS = {
	YEAR: 'year',
	MONTH: 'month',
	DAY: 'day',
	WEEK: 'week',
} as const

/**
 * Parsed time shift with amount and unit
 */
export type ParsedTimeShift = {
	shift: number
	unit: string
}

/**
 * Parses a time shift modifier string and returns the shift amount and unit
 * @param timeShift - The time shift string (examples: "+1 day", "-2 weeks", "+3 months")
 * @returns Object with shift amount and unit, or undefined if invalid
 */
function parseTimeShiftModifier(timeShift: string): ParsedTimeShift | undefined {
	const match = timeShift.trim().match(/^([+-]?\d+)\s+(day|days|week|weeks|month|months|year|years)$/i)
	if (!match) return undefined

	const [, shiftString, unitString] = match
	const shift = parseInt(shiftString, 10)
	const unit = unitString.toLowerCase()

	// Normalize plural forms to singular
	const normalizedUnit = unit.replace(/s$/, '')

	return { shift, unit: normalizedUnit }
}

/**
 * Applies a time shift to a date based on the specified unit and shift amount
 * @param date - The base date to shift
 * @param unit - The time unit to shift (examples: "year", "month", "day", "week", "time", "dow")
 * @param shift - The amount to shift (examples: 3, -2, 1, -5)
 * @returns A new Date object with the shift applied
 */
function applyTimeShift(date: Date, unit: string, shift: number): Date {
	switch (unit) {
		case TIME_SHIFT_UNITS.YEAR:
			return addYears(date, shift)
		case TIME_SHIFT_UNITS.MONTH:
			return addMonths(date, shift)
		case TIME_SHIFT_UNITS.DAY:
			return addDays(date, shift)
		case TIME_SHIFT_UNITS.WEEK:
			return addWeeks(date, shift)
		default:
			return date
	}
}

/**
 * Processes a single placeholder and returns the formatted date component
 * @param unit - The time unit extracted from the placeholder (e.g., "year", "month", "day", "date", "time", "week", "dow")
 * @param date - The date to apply the formatting to
 * @returns The formatted date component as a string
 */
function formatPlaceholder(unit: string, date: Date): string {
	switch (unit) {
		case PATTERN_UNITS.YEAR:
			return format(date, 'yyyy')
		case PATTERN_UNITS.MONTH:
			return format(date, 'MM')
		case PATTERN_UNITS.DAY:
			return format(date, 'dd')
		case PATTERN_UNITS.DATE:
			return format(date, 'yyyy-MM-dd')
		case PATTERN_UNITS.TIME:
			return format(date, 'HH-mm-ss')
		case PATTERN_UNITS.WEEK:
			return format(date, 'II')
		case PATTERN_UNITS.DOW:
			return format(date, 'EEE')
		default:
			return `{${unit}}`
	}
}

/**
 * Processes a pattern string by replacing placeholders with formatted date components
 *
 * Supports the following placeholders:
 * - {year} - 4-digit year (e.g., "2025")
 * - {month} - 2-digit month (e.g., "06")
 * - {day} - 2-digit day (e.g., "07")
 * - {date} - ISO date format (e.g., "2025-06-07")
 * - {time} - Time in HH-mm-ss format (e.g., "14-30-45")
 * - {week} - ISO week number (e.g., "23")
 * - {dow} - Day of week abbreviation (e.g., "Sat")
 *
 * @param pattern - The pattern string containing placeholders (e.g., "{year}-{month}-{day}.md")
 * @param date - The base date to extract components from
 * @param timeShift - Optional time shift to apply before processing (e.g., "+1 day", "-2 weeks")
 * @returns The processed pattern with placeholders replaced by actual date values
 */
export function processPattern(pattern: string, date: Date, timeShift?: string): string {
	let targetDate = date
	if (timeShift) {
		const parsed = parseTimeShiftModifier(timeShift)
		if (parsed) {
			targetDate = applyTimeShift(date, parsed.unit, parsed.shift)
		}
	}

	// Replace all placeholders with values from the shifted date
	return pattern.replace(/{(year|month|day|date|time|week|dow)}/g, (match, unitPlaceholder) => {
		return formatPlaceholder(unitPlaceholder, targetDate)
	})
}
