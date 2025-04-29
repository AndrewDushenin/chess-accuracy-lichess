import { convertMovesToFEN } from './util/conv-str-to-fen.util'
import { calculateAccuracy } from './util/calc-accur.util'
import { calculateWinPercent } from './util/calc-win.util'
import { evaluateFENs } from './stockfish.engine'
import { harmonicMean, standardDeviation, weightedMean } from './util/math.util'

const gameString = 'd4 Nf6 Nc3 g6 Bf4 Bg7 e4 d6 e5 dxe5 dxe5 Qxd1+ Rxd1 Nh5 Nd5 Nxf4 Nxc7+ Kf8 Rd8#'
const fenArray = convertMovesToFEN(gameString)

async function gameAnalyse(fens: string[] = []) {
	const evalueted = await evaluateFENs(fens)
	console.log('evalueted', evalueted)

	const winChanceWhite = [{ eval: 15 }, ...evalueted].map(i =>
		i.eval
			? { win: +calculateWinPercent(i.eval).toFixed(2) }
			: i.mate
			? i.mate > 0
				? { win: 100 }
				: { win: 0 }
			: { i }
	)
	const winChanceBlack = evalueted
		.map(i => (i.eval ? { eval: -i.eval } : i.mate ? { mate: -i.mate } : { i }))
		.map(i =>
			i.eval
				? { win: +calculateWinPercent(i.eval).toFixed(2) }
				: i.mate
				? i.mate > 0
					? { win: 100 }
					: { win: 0 }
				: { i }
		)
	console.log(winChanceWhite, winChanceBlack)

	const accuracyWhite = winChanceWhite.flatMap((i, index, arr) => {
		if (index % 2 === 0) {
			const next = arr[index + 1]
			if (next) {
				return i.win !== undefined && next.win !== undefined
					? [calculateAccuracy(i.win, next.win)]
					: []
			}
		}
		return []
	})
	const accuracyBlack = winChanceBlack.flatMap((i, index, arr) => {
		if (index % 2 === 0) {
			const next = arr[index + 1]
			if (next) {
				return i.win !== undefined && next.win !== undefined
					? [calculateAccuracy(i.win, next.win)]
					: []
			}
		}
		return []
	})

	const avgMeanWhite = +(accuracyWhite.reduce((a, b) => a + b, 0) / accuracyWhite.length).toFixed(2)
	const avgMeanBlack = +(accuracyBlack.reduce((a, b) => a + b, 0) / accuracyBlack.length).toFixed(2)

	const harmWhite = +harmonicMean(accuracyWhite).toFixed(2)
	const harmBlack = +harmonicMean(accuracyBlack).toFixed(2)

	//
	//
	// Calculate the weighted mean
	// const windowSize = Math.max(2, Math.min(8, Math.floor(evalueted.length / 10)))
	// const stndDev = Math.max(0.5, Math.min(12, standardDeviation(//here arr windowSlice)))
	const weightedWhite = 0 // weightedMean( ...here arr {value accuracy and weight})
	const weightedBlack = 0 // weightedMean( ...here arr {value accuracy and weight})
	// ---------------------------
	//
	//

	const resWhite = +((weightedWhite + harmWhite) / 2).toFixed(2)
	const resBlack = +((weightedBlack + harmBlack) / 2).toFixed(2)

	return `
	wAvarage% ${avgMeanWhite} - bAverage% ${avgMeanBlack}
	wWeighted% ${weightedWhite} - bWeighted% ${weightedBlack}
	wHarmonic% ${harmWhite} - bHarmonic% ${harmBlack}
	w% ${resWhite} - b% ${resBlack}`
}

;(async () => {
	console.log(await gameAnalyse(fenArray))
})()
