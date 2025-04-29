export function calculateAccuracy(winBefore: number, winAfter: number): number {
	if (winBefore <= winAfter) {
		return 100
	}
	const formula = +(103.1668 * Math.exp(-0.04354 * (winBefore - winAfter)) - 3.1669).toFixed(2)
	return Math.max(0, Math.min(100, formula + 1))
}
