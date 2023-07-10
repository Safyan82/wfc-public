import { createSlice } from '@reduxjs/toolkit';

const groupReducer = createSlice({
  name: 'groupReducer',
  initialState: {
    group: {}
  },
  reducers: {
    setGroupData: (state, action) => {
       return {
        ...state,
        group: {...action.payload}
       }     
    },
    resetGroup:()=>{ return {group:{}}}
  },
});


export const { setGroupData,resetGroup } = groupReducer.actions;
export default groupReducer.reducer;