import { createSlice } from '@reduxjs/toolkit';

//  ------------- Notification payload example ----------- 

// {
//   notificationState:true, 
//   message:"Property was created successfully",
//   error: false,
// }


const notificationReducer = createSlice({
  name: 'notificationReducer',
  initialState: {
    notificationToast: {}
  },
  reducers: {
    setNotification: (state, action) => {
       return {
        ...state,
        notificationToast: {...action.payload}
       }     
    },
    resetNotification: (state, action) =>{
      return{
        ...state,
        notificationToast: {}
      }
    }
  },
});


export const { setNotification, resetNotification } = notificationReducer.actions;
export default notificationReducer.reducer;