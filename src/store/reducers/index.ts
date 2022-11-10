import { combineReducers } from 'redux';

import { RowReducer } from './RowReducer';
import { CombinationReducer } from './CombinationReducer';

export const rootReducer  = combineReducers({
    RowReducer,
    CombinationReducer
});

export type RootState = ReturnType<typeof rootReducer>;