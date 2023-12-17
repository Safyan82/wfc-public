import { createSlice } from '@reduxjs/toolkit';

const moduleCustomPermissionReducer = createSlice({
  name: 'moduleCustomPermissionReducer',
  initialState: {
    moduleCustomPermission: {}
  },
  reducers: {
    setModuleCustomPermission: (state, action) => {
      console.log(action, "action.payload");
       return {
        ...state,
        moduleCustomPermission:{ ...state.moduleCustomPermission ,...action.payload}
       }     
    },
  },
});


export const { setModuleCustomPermission } = moduleCustomPermissionReducer.actions;
export default moduleCustomPermissionReducer.reducer;