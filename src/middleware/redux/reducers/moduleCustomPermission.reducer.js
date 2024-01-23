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
    resetModuleCustomPermission: (state, action)=>{
      return{
        ...state,
        moduleCustomPermission: {}
      }
    }
  },
});


export const { setModuleCustomPermission, resetModuleCustomPermission } = moduleCustomPermissionReducer.actions;
export default moduleCustomPermissionReducer.reducer;