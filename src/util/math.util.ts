export function standardDeviation(values: number[]): number {
	if (values.length <= 1) return NaN
	const mean = values.reduce((sum, val) => sum + val, 0) / values.length
	const variance = values.reduce((sum, val) => sum + (val - mean) ** 2, 0) / values.length
	return +Math.sqrt(variance).toFixed(2)
}

export function harmonicMean(values: number[]): number {
	if (values.length === 0) return 0
	const reciprocalSum = values.reduce((sum, val) => sum + (val !== 0 ? 1 / val : 0), 0)
	return reciprocalSum === 0 ? 0 : values.length / reciprocalSum
}

export function weightedMean(values: Array<{ value: number; weight: number }>): number {
	const valid = values.filter(({ value }) => Number.isFinite(value))
	if (valid.length === 0) return NaN
	const weightedSum = valid.reduce((sum, { value, weight }) => sum + value * weight, 0)
	const totalWeight = valid.reduce((sum, { weight }) => sum + weight, 0)
	return totalWeight === 0 ? 0 : weightedSum / totalWeight
}
