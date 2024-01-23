import { createSlice } from '@reduxjs/toolkit';

// this reducer is use for user auth process to store user details

const userAuthReducer = createSlice({
  name: 'userAuthReducer',
  initialState: {
    authenticatedUserDetail : {},
    refreshAuthUser: ()=> {}
  },
  reducers: {
    setAuthUserDetail : (state, action)=>{
        return{
            ...state,
            authenticatedUserDetail: action.payload
        }
    },

    setAuthUserRefresh: (state, action) => {
      return {
        ...state,
        refreshAuthUser: action.payload
      }
    },

    resetAuthUserDetail: (state, action)=>{
      return {
        ...state,
        authenticatedUserDetail: {},
        refreshAuthUser: {}
      }
    }
   

  },
});


export const { setAuthUserDetail, setAuthUserRefresh, resetAuthUserDetail } = userAuthReducer.actions;
export default userAuthReducer.reducer;