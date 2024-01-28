import { createSlice } from '@reduxjs/toolkit';

const newViewReducer = createSlice({
  name: 'newViewReducer',
  initialState: {
    togglenewCreateView: false
  },
  reducers: {
    setTogglenewCreateView: (state, action) => {
       return {
        ...state,
        togglenewCreateView: action.payload
       }     
    },
    resetTogglenewCreateView : (state, action) =>{
      return{
        ...state,
        togglenewCreateView: false
      }
    }
  },
});


export const { setTogglenewCreateView, resetTogglenewCreateView } = newViewReducer.actions;
export default newViewReducer.reducer;