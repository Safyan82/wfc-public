import { createSlice } from '@reduxjs/toolkit';

const editUserReducer = createSlice({
  name: 'editUserReducer',
  initialState: {
    editUserData: {}
  },
  reducers: {
    setEditUserData : (state, action) =>{
        return{
            ...state,
            editUserData: action.payload
        }
    },
    resetEditUserData : (state, action) =>{
      return {
        ...state,
        editUserData: {}
      }
    }
  },
});


export const { setEditUserData, resetEditUserData } = editUserReducer.actions;
export default editUserReducer.reducer;