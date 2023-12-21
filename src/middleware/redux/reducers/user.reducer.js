import { createSlice } from '@reduxjs/toolkit';

const userReducer = createSlice({
  name: 'userReducer',
  initialState: {
    userDetail: {}
  },
  reducers: {

    setUserDetail: (state, action) => {
        console.log(action.payload, "payyload")
       return{
        ...state,
        userDetail: {...action.payload}
       }    
    },

    resetUserDetail: () =>{
        return{
            userDetail: {}
        }
    }

  },
});


export const { setUserDetail, resetUserDetail } = userReducer.actions;
export default userReducer.reducer;