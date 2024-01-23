import { createSlice } from '@reduxjs/toolkit';

const BranchViewReducer = createSlice({
  name: 'branchViewReducer',
  initialState: {
    refetchBranchView: null
  },
  reducers: {
    setRefetchBranchView : (state, action)=>{
        return {
            ...state,
            refetchBranchView: action.payload
        }
    },

    // reset branch view
    resetBranchView: (state, action) =>{
      return{
        ...state,
        refetchBranchView: null
      }
    }
  },
});


export const { setRefetchBranchView, resetBranchView } = BranchViewReducer.actions;
export default BranchViewReducer.reducer;