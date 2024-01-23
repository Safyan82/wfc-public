// resetSlice.js
import { createSlice } from '@reduxjs/toolkit';

const resetSlice = createSlice({
  name: 'resetReducer',
  initialState: false,
  reducers: {
    resetAll: () => {},
  },
});

export const { resetAll } = resetSlice.actions;
export default resetSlice.reducer;
