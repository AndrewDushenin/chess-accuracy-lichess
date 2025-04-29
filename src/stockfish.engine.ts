import { spawn } from 'child_process'
import { execSync } from 'child_process'

export async function evaluateFENs(
	fens: string[]
): Promise<Array<{ eval?: number; mate?: number }>> {
	const stockfishPath = execSync('which stockfish').toString().trim()
	const stockfish = spawn(stockfishPath)
	const evaluations: Array<{ eval?: number; mate?: number }> = []

	const depthParam = 17
	const isWhiteToMove = fens[0].split(' ')[1] === 'w'

	return new Promise((resolve, reject) => {
		let currentIndex = 0
		let output = ''

		const sendCommand = (command: string) => {
			stockfish.stdin.write(`${command}\n`)
		}

		stockfish.stdout.on('data', data => {
			output += data.toString()

			const depthMatch = output.match(
				new RegExp(`info depth ${depthParam} .* score (cp|mate) (-?\\d+)`)
			)
			if (depthMatch) {
				const scoreType = depthMatch[1]
				const scoreValue = parseInt(depthMatch[2], 10)

				if (scoreType === 'cp') {
					const correctedEval =
						currentIndex % 2 === (isWhiteToMove ? 0 : 1) ? scoreValue : -scoreValue
					evaluations.push({ eval: correctedEval })
				} else if (scoreType === 'mate') {
					const correctedMate =
						currentIndex % 2 === (isWhiteToMove ? 0 : 1) ? scoreValue : -scoreValue
					evaluations.push({ mate: correctedMate })
				}

				output = ''
				currentIndex++

				if (currentIndex < fens.length) {
					sendCommand(`position fen ${fens[currentIndex]}`)
					sendCommand(`go depth ${depthParam}`)
				} else {
					sendCommand('quit')
					resolve(evaluations)
				}
			} else if (output.includes('bestmove (none)')) {
				sendCommand('quit')
				resolve(evaluations)
				return
			} else if (output.includes('bestmove') || output.includes('info')) {
				output = ''
			}
		})

		stockfish.stderr.on('data', data => {
			console.error('Error from Stockfish:', data.toString())
			reject(new Error(data.toString()))
		})

		sendCommand('uci')
		sendCommand(`setoption name Threads value 8`)
		sendCommand(`position fen ${fens[currentIndex]}`)
		sendCommand(`go depth ${depthParam}`)
	})
}
