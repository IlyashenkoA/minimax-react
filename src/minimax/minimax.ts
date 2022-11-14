import { ICombination } from '../store/reducers/CombinationReducer';
import { Players } from '../App';

export const computerMove = (row: string[]) => {
	const array = [...row];
	const bestMove = getBestMove(array);

	for (const {} of row) {
		const combination = row[bestMove - 1] + row[bestMove];

		if (combination === '10' || combination === '00') {
			row[bestMove - 1] = '1';
			row.splice(bestMove, 1);

			return row;
		}
		row[bestMove - 1] = '0';
		row.splice(bestMove, 1);

		return row;
	}

	return row;
};

export const humanMove = (row: string[], combination: ICombination[]) => {
	const stringCombination = '' + combination[0].value + combination[1].value;

	if (stringCombination === '10' || stringCombination === '00') {
		row.splice(combination[1].key, 1);
		row[combination[0].key] = '1';
	} else {
		row.splice(combination[1].key, 1);
		row[combination[0].key] = '0';
	}

	return row;
};

const getBestMove = (row: string[]) => {
	let bestValue = -1000;
	let position = -1;

	for (let i = 1; i < row.length; i++) {
		const combination = '' + row[i - 1] + row[i];

		if (combination === '10' || combination === '00') {
			const currentRow = [...row];
			row[i - 1] = '1';
			row.splice(i, 1);

			const moveValue = minimax({
				row: row,
				depth: 0,
				isMax: false,
				alpha: -Infinity,
				beta: Infinity,
			});

			row = currentRow;

			if (moveValue > bestValue) {
				position = i;
				bestValue = moveValue;
			}
		}
		const currentRow = [...row];
		row[i - 1] = '0';
		row.splice(i, 1);

		const moveValue = minimax({
			row: row,
			depth: 0,
			isMax: false,
			alpha: -Infinity,
			beta: Infinity,
		});

		row = currentRow;

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

	if (hasStarted === Players.HUMAN) {
		if (combination === '11' || combination === '00') {
			return -10;
		}

		if (combination === '10' || combination === '01') {
			return 10;
		}
	}

	if (hasStarted === Players.COMPUTER) {
		if (combination === '10' || combination === '01') {
			return -10;
		}

		if (combination === '11' || combination === '10') {
			return 10;
		}
	}

	return 0;
};

export const isGameOver = (row: string[]) => !isMoveLeft(row);

export const getWinner = (row: string[], hasStarted: string) => {
	const combination = row.join('');

	if (
		(combination === '11' || combination === '00') &&
		hasStarted === Players.HUMAN
	) {
		return 'Player won!';
	}

	if (
		(combination === '11' || combination === '00') &&
		hasStarted === Players.COMPUTER
	) {
		return 'Computer won';
	}

	if (
		(combination === '10' || combination === '01') &&
		hasStarted === Players.COMPUTER
	) {
		return 'Player won!';
	}
	if (
		(combination === '10' || combination === '01') &&
		hasStarted === Players.HUMAN
	) {
		return 'Computer won';
	}

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

				if (alpha > beta) {
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
}
