import { createSlice } from '@reduxjs/toolkit';

const propertyReducer = createSlice({
  name: 'propertyReducer',
  initialState: {
    groupFilterId: null,
    editGridColumn: false,
  },
  reducers: {
    setPropertyFilterByGroup: (state, action) => {
       return {
        ...state,
        groupFilterId: action.payload,
       }     
    },
    resetPropertyFilterByGroup:()=>{ return {groupFilterId: null}},
    setEditGridColumn: (state, action)=>{
      return{
        ...state,
        editGridColumn: action.payload,
      }
    },
    resetPropertyState : (state, action) =>{
      return{
        ...state,
        groupFilterId: null,
        editGridColumn: false,
      }
    }
  },
});


export const { setPropertyFilterByGroup,  resetPropertyFilterByGroup, setEditGridColumn, resetPropertyState } = propertyReducer.actions;
export default propertyReducer.reducer;