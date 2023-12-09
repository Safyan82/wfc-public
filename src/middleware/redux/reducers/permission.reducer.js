import { createSlice } from '@reduxjs/toolkit';

const permissionReducer = createSlice({
  name: 'permissionReducer',
  initialState: {
    localAccess: [],
    propAccess:{}
  },
  reducers: {
    setlocalPermission: (state, action) => {
       const prop = action.payload;
       const isExist = state.localAccess?.find((local)=>local?.label?.toLowerCase() == prop?.label?.toLowerCase());
       return {
        ...state,
        localAccess: isExist? state?.localAccess?.map((local)=>{
                if(local.label.toLowerCase()==prop.label.toLowerCase()){
                    const {label, ...rest} = prop;
                    return {
                        ...local,
                        ...rest,
                    }
                }else{
                    return local
                }
            })
            : [...state.localAccess, {...prop}]
       }     
    },
    setDefaultPropPermission : (state, action) =>{
        return{
            ...state,
            propAccess:{
                ...state.propAccess,
                ...action.payload,
            }

        }
    },
    updateDefaultPropPermissin: (state, action)=>{
        console.log(action.payload)
        return {
            ...state,
            propAccess: {
                ...state.propAccess,
                [action.payload.id]: {
                    ...action.payload.permission
                }
            }
        }
    },
    resetGroup:()=>{ return {group:{}}},
  },
});


export const { setlocalPermission, setDefaultPropPermission, updateDefaultPropPermissin } = permissionReducer.actions;
export default permissionReducer.reducer;