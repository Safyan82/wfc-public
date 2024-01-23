import { createSlice } from '@reduxjs/toolkit';

const QuickFilterReducer = createSlice({
  name: 'QuickFilterReducer',
  initialState: {
    quickFilter: {},
    advanceFilter: [],
    selectedViewId: null,
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
    resetQuickFilter : (state, action)=>{return { ...state, quickFilter:{} }},
    resetAdvanceFilter : (state, action)=>{return { ...state, advanceFilter:[] }},
    setSelectedViewId: (state, action) => {
      return{
        state,
        selectedViewId: action.payload
      }
    },
    resetAllFilter: (state, action) =>{
      return{
        ...state,
        quickFilter: {},
        advanceFilter: [],
        selectedViewId: null,
      }
    }
  },
});


export const { setQuickFilter, setAdvanceFilter, resetQuickFilter, resetAdvanceFilter, setSelectedViewId, resetAllFilter } = QuickFilterReducer.actions;
export default QuickFilterReducer.reducer;