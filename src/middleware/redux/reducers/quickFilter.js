import { createSlice } from '@reduxjs/toolkit';

const QuickFilterReducer = createSlice({
  name: 'QuickFilterReducer',
  initialState: {
    quickFilter: {},
    advanceFilter: [],
  },
  reducers: {
    setQuickFilter: (state, action) => {
       return {
        ...state,
        quickFilter: {...state.quickFilter, ...action.payload}
       }     
    },
    setAdvanceFilter: (state, action) => {
       return {
        ...state,
        advanceFilter: [...action.payload]
       }     
    },
  },
});


export const { setQuickFilter, setAdvanceFilter } = QuickFilterReducer.actions;
export default QuickFilterReducer.reducer;