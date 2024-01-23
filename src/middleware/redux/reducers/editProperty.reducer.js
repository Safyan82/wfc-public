import { createSlice } from '@reduxjs/toolkit';

const editPropertyReducer = createSlice({
  name: 'editPropertyReducer',
  initialState: {
    isbtnEnabled: true,
  },
  reducers: {
    setBtnState: (state, action) => {
       return {
        ...state,
        isbtnEnabled: action.payload
       }     
    },
    resetGroup:()=>{ return {group:{}}},
    resetEditProperty:(state, action)=>{
      return {
        ...state,
        isbtnEnabled: true,
      }
    }
  },
});


export const { setBtnState, resetEditProperty } = editPropertyReducer.actions;
export default editPropertyReducer.reducer;