import { createSlice } from '@reduxjs/toolkit';

const noteReducer = createSlice({
  name: 'noteReducer',
  initialState: {
    noteToggle: false
  },
  reducers: {
    setNoteToggle: (state, action) => {
      console.log(action, "action.payload");
       return {
        ...state,
        noteToggle: action.payload
       }     
    },
    resetNoteState : (state, action) =>{
      return{
        ...state,
        noteToggle: false
      }
    }
  },
});


export const { setNoteToggle, resetNoteState } = noteReducer.actions;
export default noteReducer.reducer;