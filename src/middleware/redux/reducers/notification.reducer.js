import { createSlice } from '@reduxjs/toolkit';

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
    }
  },
});


export const { setNotification } = notificationReducer.actions;
export default notificationReducer.reducer;