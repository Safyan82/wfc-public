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
  },
});


export const { setNoteToggle } = noteReducer.actions;
export default noteReducer.reducer;