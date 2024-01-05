import { createSlice } from '@reduxjs/toolkit';

// this reducer is use for user creation proccess from setting

const userReducer = createSlice({
  name: 'userReducer',
  initialState: {
    userDetail: {},
    emailVerificationDetail: {},
    refetchUser: false
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
    },

    refetchAllUser : (state, action) =>{
      return {
        ...state, 
        refetchUser: action.payload
      }
    },

  },
});


export const { setUserDetail, resetUserDetail, checkEmailDetails, refetchAllUser } = userReducer.actions;
export default userReducer.reducer;