export const ceilsNumber = (number: number, min: number, max: number) => {
	if (number > max) return max
	if (number < min) return min
	return number
}

export const calculateWinPercent = (line): number => {
	if (line.cp !== undefined) {
		return getWinPercentageFromCp(line.cp)
	}

	if (line.mate !== undefined) {
		return getWinPercentageFromMate(line.mate)
	}

	throw new Error('No cp or mate in line')
}

const getWinPercentageFromMate = (mate: number): number => {
	const mateInf = mate * Infinity
	return getWinPercentageFromCp(mateInf)
}

export function getWinPercentageFromCp(cp: number): number {
	const cpCeiled = ceilsNumber(cp, -1000, 1000)
	const MULTIPLIER = -0.00368208
	const winChances = 2 / (1 + Math.exp(MULTIPLIER * cpCeiled)) - 1
	return 50 + 50 * winChances
}
