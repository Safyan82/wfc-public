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
    }
  },
});


export const { setEditUserData } = editUserReducer.actions;
export default editUserReducer.reducer;