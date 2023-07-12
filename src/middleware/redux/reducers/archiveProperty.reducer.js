import { createSlice } from '@reduxjs/toolkit';

const archiveReducer = createSlice({
  name: 'archiveReducer',
  initialState: {
    archiveFilteredData: null,
    isFilterActive: false,
    isloading: false,
    refetchedFiltered:null
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
    setArchivePropertyLoading: (state, action) =>{
      return{
        ...state,
        isloading: action.payload
      }
    },
    resetArchivePropertyFilteredData:()=>{ return {archiveFilteredData: null, isFilterActive:false}},
    setRefetchFilteredProperty: (state, action)=>{
      return{
        ...state,
        refetchedFiltered: action.payload
      }
    }
  },
});


export const { setArchivePropertyLoading, 
  setArchivePropertyFilteredData, 
  setArchivePropertyFilter, 
  resetArchivePropertyFilteredData,
  setRefetchFilteredProperty
} = archiveReducer.actions;
export default archiveReducer.reducer;