import { createSlice } from '@reduxjs/toolkit';

const ruleReducer = createSlice({
  name: 'rule',
  initialState: {
    rules: [],
  },
  reducers: {
    setRules: (state, action) => {
        state.rules = [...state.rules, action.payload];        
    }
  },
});


export const { setRules } = ruleReducer.actions;
export default ruleReducer.reducer;