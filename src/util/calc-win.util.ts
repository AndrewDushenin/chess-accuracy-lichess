export function calculateWinPercent(cp: number): number {
	return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1)
}
