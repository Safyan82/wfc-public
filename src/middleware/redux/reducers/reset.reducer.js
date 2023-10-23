// resetSlice.js
import { createSlice } from '@reduxjs/toolkit';

const resetSlice = createSlice({
  name: 'reset',
  initialState: false,
  reducers: {
    resetAll: () => true,
  },
});

export const { resetAll } = resetSlice.actions;
export default resetSlice.reducer;
