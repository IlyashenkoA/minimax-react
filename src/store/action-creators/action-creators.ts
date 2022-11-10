import { ICombination } from './../reducers/RowReducer';
import { ACTIONS } from '../types/actions';

export const createRow = () => {
	return { type: ACTIONS.CREATE_ROW };
}

export const updateRow = (row: string[]) => {
	return { type: ACTIONS.UPDATE_ROW, payload: row };
};

export const addCombination = (data: ICombination) => {
	return { type: ACTIONS.ADD_COMBINATION, payload: data };
};

export const removeCombination = (data: ICombination) => {
	return { type: ACTIONS.REMOVE_COMBINATION, payload: data };
};

export const resetCombination = () => {
	return { type: ACTIONS.RESET_COMBINATION }
}
