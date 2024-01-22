import { createSlice } from '@reduxjs/toolkit';

// this reducer is use for user creation proccess from setting

const userRoleReducer = createSlice({
  name: 'userRoleReducer',
  initialState: {
    userRoleToBeEdit: null
  },
  reducers: {

    // this function is called from userCreation process from setting under user & team
    setUserRoleToBeEdit: (state, action) => {
        console.log(action.payload, "payyload")
       return{
        ...state,
        userRoleToBeEdit: {...action.payload}
       }    
    },


  },
});


export const { setUserRoleToBeEdit } = userRoleReducer.actions;
export default userRoleReducer.reducer;