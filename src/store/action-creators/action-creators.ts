import { ICombination } from './../reducers/CombinationReducer';
import { ACTIONS } from '../types/actions';

export const createRow = (rowLength: number) => {
	return { type: ACTIONS.CREATE_ROW, payload: rowLength };
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
