import { ACTIONS } from '../types/actions';

const initialState: RowState = {
	combination: [],
};

interface RowState {
	combination: ICombination[];
}

interface ICombination {
	key: number;
	value: number;
}

interface CombinationAction {
	type: string;
	payload: ICombination;
}

export const CombinationReducer = (
	state = initialState,
	action: CombinationAction
) => {
	switch (action.type) {
		case ACTIONS.ADD_COMBINATION:
			return {
				...state,
				combination: [...state.combination, action.payload],
			};
		case ACTIONS.REMOVE_COMBINATION:
			return {
				...state,
				combination: state.combination.filter((item) => {
					return item.key !== action.payload.key;
				}),
			};
    case ACTIONS.RESET_COMBINATION:
      return {
        combination: []
      }
		default:
			return state;
	}
};
