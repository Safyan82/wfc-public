import { createSlice } from '@reduxjs/toolkit';

const archiveReducer = createSlice({
  name: 'archiveReducer',
  initialState: {
    archiveFilteredData: null,
    isFilterActive: false
  },
  reducers: {
    setArchivePropertyFilteredData: (state, action) => {
       return {
        ...state,
        archiveFilteredData: action.payload,
       }     
    },
    setArchivePropertyFilter: (state, action) =>{
      return{
        ...state,
        isFilterActive: action.payload,
      }
    },
    resetArchivePropertyFilteredData:()=>{ return {archiveFilteredData: null, isFilterActive:false}}
  },
});


export const { setArchivePropertyFilteredData, setArchivePropertyFilter, resetArchivePropertyFilteredData } = archiveReducer.actions;
export default archiveReducer.reducer;