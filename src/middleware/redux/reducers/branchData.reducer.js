import { createSlice } from '@reduxjs/toolkit';

const branchDataReducer = createSlice({
  name: 'branchDataReducer',
  initialState: {
    specificBranchData: {}
  },
  reducers: {
    setSpecificBranchData: (state, action)=>{
        return {
            ...state,
            specificBranchData: {...action.payload},
        }
    },


  },

});


export const { setSpecificBranchData } = branchDataReducer.actions;
export default branchDataReducer.reducer;