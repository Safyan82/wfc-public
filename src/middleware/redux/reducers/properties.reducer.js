import { createSlice } from '@reduxjs/toolkit';

const propertyReducer = createSlice({
  name: 'propertyReducer',
  initialState: {
    groupFilterId: null,
  },
  reducers: {
    setPropertyFilterByGroup: (state, action) => {
       return {
        ...state,
        groupFilterId: action.payload,
       }     
    },
    resetPropertyFilterByGroup:()=>{ return {groupFilterId: null}}
  },
});


export const { setPropertyFilterByGroup,  resetPropertyFilterByGroup } = propertyReducer.actions;
export default propertyReducer.reducer;