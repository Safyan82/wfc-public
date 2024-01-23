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
    },
    resetGroupState : (state, action)=>{
      return {
        ...state,    
        group: {},
        propertiesToBeMoved:[]
      }
    }
  },
});


export const { setGroupData, resetGroup, moveToGroup, resetGroupState } = groupReducer.actions;
export default groupReducer.reducer;