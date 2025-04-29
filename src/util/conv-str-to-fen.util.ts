import { Chess } from 'chess.js';

export function convertMovesToFEN(movesString: string): string[] {
	const chess = new Chess();
	const moves = movesString.split(' ');
	const fenPositions: string[] = [];

	for (const move of moves) {
		if (!chess.move(move)) {
			throw new Error(`Invalid move: ${move}`);
		}
		fenPositions.push(chess.fen());
	}

	return fenPositions;
}
