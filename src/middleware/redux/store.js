import { configureStore } from '@reduxjs/toolkit';
import ruleReducer from './reducers/rule.reducer';

const store = configureStore({
  reducer: {
    ruleReducer: ruleReducer,
  },
});

export default store;
