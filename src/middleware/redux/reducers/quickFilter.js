import { createSlice } from '@reduxjs/toolkit';

const QuickFilterReducer = createSlice({
  name: 'QuickFilterReducer',
  initialState: {
    quickFilter:{}
  },
  reducers: {
    setQuickFilter: (state, action) => {
       return {
        ...state,
        quickFilter: {...state.quickFilter, ...action.payload}
       }     
    },
  },
});


export const { setQuickFilter } = QuickFilterReducer.actions;
export default QuickFilterReducer.reducer;