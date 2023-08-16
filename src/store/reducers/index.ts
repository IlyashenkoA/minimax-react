import { combineReducers } from 'redux';

import { CombinationReducer } from './CombinationReducer';

export const rootReducer = combineReducers({
  CombinationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
