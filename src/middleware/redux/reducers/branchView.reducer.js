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
    }
  },
});


export const { setRefetchBranchView } = BranchViewReducer.actions;
export default BranchViewReducer.reducer;