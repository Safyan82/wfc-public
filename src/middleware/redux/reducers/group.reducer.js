import { createSlice } from '@reduxjs/toolkit';

const groupReducer = createSlice({
  name: 'groupReducer',
  initialState: {
    group: {},
    propertiesToBeMoved:[]
  },
  reducers: {
    setGroupData: (state, action) => {
       return {
        ...state,
        group: {...action.payload}
       }     
    },
    resetGroup:()=>{ return {group:{}}},
    moveToGroup:(state,action)=>{
      return{
        ...state,
        propertiesToBeMoved: action.payload
      }
    }
  },
});


export const { setGroupData, resetGroup, moveToGroup } = groupReducer.actions;
export default groupReducer.reducer;