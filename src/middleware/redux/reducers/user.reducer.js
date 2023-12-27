import { createSlice } from '@reduxjs/toolkit';

const userReducer = createSlice({
  name: 'userReducer',
  initialState: {
    userDetail: {},
    emailVerificationDetail: {}
  },
  reducers: {

    // this function is called from userCreation process from setting under user & team
    setUserDetail: (state, action) => {
        console.log(action.payload, "payyload")
       return{
        ...state,
        userDetail: {...action.payload}
       }    
    },

    resetUserDetail: (state) =>{
        return{
            ...state,
            userDetail: {},
            emailVerificationDetail: {}
        }
    },

    // terminated user & team

    checkEmailDetails: (state, action)=>{
      return {
        ...state,
        emailVerificationDetail: {...action.payload},
      }
    }

  },
});


export const { setUserDetail, resetUserDetail, checkEmailDetails } = userReducer.actions;
export default userReducer.reducer;