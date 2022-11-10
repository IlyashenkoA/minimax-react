import { ACTIONS } from '../types/actions';

/**
 * Generate numbers between 0 and 1
 *
 * Optimal length of the array is 10
 */
const LENGTH = 10;
const initialState: RowState = {
	row: Array.from({ length: LENGTH }, () =>
		Math.floor(Math.random() * 2).toString()
	),
};

interface RowState {
	row: string[];
}

export interface ICombination {
	key: number;
	value: number;
}

interface RowAction {
	type: string;
	payload: any;
}

export const RowReducer = (state = initialState, action: RowAction) => {
	switch (action.type) {
		case ACTIONS.CREATE_ROW:
			return {
				...state,
				row: Array.from({ length: action.payload }, () =>
					Math.floor(Math.random() * 2).toString()
				),
			};
		case ACTIONS.UPDATE_ROW:
			return {
				...state,
				row: [...action.payload],
			};
		default:
			return state;
	}
};
