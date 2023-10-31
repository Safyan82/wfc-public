import { createSlice } from '@reduxjs/toolkit';

const branchDataReducer = createSlice({
  name: 'branchDataReducer',
  initialState: {
    specificBranchData: {},
    remvFieldSpecificBranchView: null
  },
  reducers: {
    setSpecificBranchData: (state, action)=>{
        return {
            ...state,
            specificBranchData: {...action.payload},
        }
    },

    removeDataFieldFromSpecificBranchView: (state, action) => {
        return{
            ...state,
            remvFieldSpecificBranchView: action.payload
        }
    },

    AddDataFieldFromView : (state, action) => {
        return{
            ...state,
            remvFieldSpecificBranchView: action.payload,
        }
    },

    resetDataFieldForNewView : (state, action) =>{
        return {
            ...state,
            remvFieldSpecificBranchView: null,
        }
    }


  },

});


export const { resetDataFieldForNewView, AddDataFieldFromView, setSpecificBranchData, removeDataFieldFromSpecificBranchView } = branchDataReducer.actions;
export default branchDataReducer.reducer;