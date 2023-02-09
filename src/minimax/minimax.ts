import { ICombination } from '../store/reducers/CombinationReducer';
import { Players } from '../store/types/players';

export const computerMove = (row: string[]) => {
	const bestMove = getBestMove(row);
	const combination = row[bestMove - 1] + row[bestMove];
	const newValue = combination === '10' || combination === '00' ? '1' : '0';

	row[bestMove - 1] = newValue;
	row.splice(bestMove, 1);

	return row;
};

export const humanMove = (row: string[], combination: ICombination[]) => {
	const stringCombination = '' + combination[0].value + combination[1].value;
	const newValue =
		stringCombination === '10' || stringCombination === '00' ? '1' : '0';

	row.splice(combination[1].key, 1);
	row[combination[0].key] = newValue;

	return row;
};

const getBestMove = (row: string[]) => {
	let bestValue = -1000;
	let position = -1;

	for (let i = 1; i < row.length; i++) {
		const combination = row[i - 1] + row[i];

		if (combination === '10' || combination === '00') {
			const currentRow = [...row];
			currentRow[i - 1] = '1';
			currentRow.splice(i, 1);

			const moveValue = minimax({
				row: currentRow,
				depth: 0,
				isMax: false,
				alpha: -Infinity,
				beta: Infinity,
			});

			if (moveValue > bestValue) {
				position = i;
				bestValue = moveValue;
			}
		}

		const currentRow = [...row];
		currentRow[i - 1] = '0';
		currentRow.splice(i, 1);

		const moveValue = minimax({
			row: currentRow,
			depth: 0,
			isMax: false,
			alpha: -Infinity,
			beta: Infinity,
		});

		if (moveValue > bestValue) {
			position = i;
			bestValue = moveValue;
		}
	}

	return position;
};

const isMoveLeft = (row: string[]) => row.length > 2;

const evaluate = (combinations: string[], hasStarted: Players) => {
	const combination = combinations.join('');
	const isComputer = hasStarted === Players.COMPUTER;

	if ((combination === '11' || combination === '00') && !isComputer) return -10;
	if ((combination === '10' || combination === '01') && isComputer) return -10;
	if ((combination === '11' || combination === '10') && isComputer) return 10;
	if ((combination === '10' || combination === '01') && !isComputer) return 10;

	return 0;
};

export const isGameOver = (row: string[]) => !isMoveLeft(row);

export const getWinner = (row: string[], hasStarted: string) => {
	const combination = row.join('');
	const isComputer = hasStarted === Players.COMPUTER;

	if ((combination === '11' || combination === '00') && !isComputer)
		return 'Player won!';
	if ((combination === '11' || combination === '00') && isComputer)
		return 'Computer won';
	if ((combination === '10' || combination === '01') && isComputer)
		return 'Player won!';
	if ((combination === '10' || combination === '01') && !isComputer)
		return 'Computer won';

	return '';
};

interface MiniMaxProps {
	row: string[];
	depth: number;
	isMax: boolean;
	alpha: number;
	beta: number;
}

const minimax = ({ row, depth, isMax, alpha, beta }: MiniMaxProps) => {
	let currentRow;
	let score = evaluate(row, Players.COMPUTER);

	if (score === 10) {
		return score;
	}

	if (score === -10) {
		return score;
	}

	if (!isMoveLeft(row)) {
		return 0;
	}

	if (isMax) {
		let best = -1000;

		for (let i = 1; i < row.length; i++) {
			const combination = '' + row[i - 1] + row[i];

			if (combination === '10' || combination === '00') {
				currentRow = [...row];
				row[i - 1] = '1';
				row.splice(i, 1);

				best = Math.max(
					best,
					minimax({
						row: row,
						depth: depth + 1,
						isMax: !isMax,
						alpha: alpha,
						beta: beta,
					})
				);
				alpha = Math.max(alpha, best);

				row = currentRow;

				if (beta < alpha) {
					return best;
				}
			} else {
				currentRow = [...row];
				row[i - 1] = '0';
				row.splice(i, 1);

				best = Math.min(
					best,
					minimax({
						row: row,
						depth: depth + 1,
						isMax: !isMax,
						alpha: alpha,
						beta: beta,
					})
				);
				beta = Math.min(alpha, best);

				row = currentRow;

				if (beta < alpha) {
					return best;
				}
			}
		}

		return best;
	}

	let best = 1000;

	for (let i = 1; i < row.length; i++) {
		const combination = '' + row[i - 1] + row[i];

		if (combination === '10' || combination === '00') {
			currentRow = [...row];
			row[i - 1] = '1';
			row.splice(i, 1);

			best = Math.max(
				best,
				minimax({
					row: row,
					depth: depth + 1,
					isMax: !isMax,
					alpha: alpha,
					beta: beta,
				})
			);

			row = currentRow;
		} else {
			currentRow = [...row];
			row[i - 1] = '0';
			row.splice(i, 1);

			best = Math.min(
				best,
				minimax({
					row: row,
					depth: depth + 1,
					isMax: !isMax,
					alpha: alpha,
					beta: beta,
				})
			);

			row = currentRow;
		}
	}

	return best;
};

module.exports = { isMoveLeft, getWinner, isGameOver };
