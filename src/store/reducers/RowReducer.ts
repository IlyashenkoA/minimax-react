import { ACTIONS } from '../types/actions';

const LENGTH = 10;

/**
 * An array is created so that the logic on the first render works
 */
const initialState: RowState = {
	row:
		localStorage.getItem('row') &&
		JSON.parse(localStorage.getItem('row')!).length <= LENGTH &&
		JSON.parse(localStorage.getItem('row')!).length > 2
			? JSON.parse(localStorage.getItem('row')!)
			: Array.from({ length: LENGTH }, () =>
					Math.floor(Math.random() * 2).toString()
			  ),
};

interface RowState {
	row: string[];
}

interface RowAction {
	type: string;
	payload: any;
}

export const RowReducer = (state = initialState, action: RowAction) => {
	switch (action.type) {
		case ACTIONS.CREATE_ROW:
			const localRow = localStorage.getItem('row');
			const localRowLength = +localStorage.getItem('rowLength')!;
			const whoStart = localStorage.getItem('whoStart');

			/**
			 * Generate numbers between 0 and 1
			 *
			 * In case if previous game has not been finished, will be returned row from localStorage
			 *
			 * Otherwise will be created a new array with length from a payload
			 */
			const row =
				localRow &&
				whoStart &&
				JSON.parse(localRow).length <= localRowLength &&
				JSON.parse(localRow).length > 2
					? JSON.parse(localRow)
					: Array.from({ length: action.payload }, () =>
							Math.floor(Math.random() * 2).toString()
					  );

			// Save a row in localStorage
			localStorage.setItem('row', JSON.stringify(row));

			return {
				row: row,
			};
		case ACTIONS.UPDATE_ROW:
			// Update a row in localStorage
			localStorage.setItem('row', JSON.stringify(action.payload));

			return {
				row: [...action.payload],
			};
		default:
			return state;
	}
};
