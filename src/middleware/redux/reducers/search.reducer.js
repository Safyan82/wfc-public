import { createSlice } from '@reduxjs/toolkit';

// this reducer is use for user creation proccess from setting

const searchReducer = createSlice({
  name: 'searchReducer',
  initialState: {
    isModalOpen: false,
    query: "",
    searchFilter:['Branch', 'Employee', 'Schedule', 'Site', 'Customer']
  },
  reducers: {

    setSearchViewModal: (state, action) => {
       return{
        ...state,
        isModalOpen: action.payload
       }    
    },

    setSearchQuery: (state, action) => {
       return{
        ...state,
        query: action.payload
       }    
    },
    
    handelSearchFilter: (state, action) =>{
      const isFilterExist = state?.searchFilter?.find((f)=>f==action.payload);
      return{
        ...state,
        searchFilter: isFilterExist? state?.searchFilter?.filter((f)=>f!==action.payload) : state.searchFilter?.length>0?[...state.searchFilter, action.payload]:[action.payload]
      }
    },

    resetSearchState: (state) =>{
        return{
            ...state,        
            isModalOpen: false,
            query: ""
        }
    },


  },
});


export const { setSearchViewModal, setSearchQuery, resetSearchState, handelSearchFilter } = searchReducer.actions;
export default searchReducer.reducer;