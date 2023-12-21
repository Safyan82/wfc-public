import { createSlice } from '@reduxjs/toolkit';

const permissionReducer = createSlice({
  name: 'permissionReducer',
  initialState: {
    localAccess: [],
    propAccess:{
        Branch: {
            view: "All Branch",
            edit: "All Branch",
            delete: "All Branch",
        },
        Employee: {
            view: "All Employee",
            edit: "All Employee",
            delete: "All Employee",
        },
        Site: {
            view: "All Site",
            edit: "All Site",
            delete: "All Site",
        },
        Customer: {
            view: "All Customer",
            edit: "All Customer",
            delete: "All Customer",
        },
        SiteGroup: {
            view: "All SiteGroup",
            edit: "All SiteGroup",
            delete: "All SiteGroup",
        },
    }
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
            propAccess:state?.propAccess? {
                ...state.propAccess,
                [Object.keys(action.payload)[0]]: {
                    ...state[Object.keys(action.payload)[0]],
                    ...Object.values(action.payload)[0]
                }
            } 
            :{
                ...state.propAccess,
                ...action.payload,
            }

        }
    },
    updateDefaultPropPermissin: (state, action)=>{ 
        return {
            ...state,
            propAccess: {
                ...state.propAccess,
                [action.payload.objectType]:{
                    ...state.propAccess[action.payload.objectType],
                    [action.payload.id]: {
                        ...state.propAccess[action.payload.objectType][action.payload.id],
                        ...action.payload.permission,
                        objectType: action.payload.objectType
                    }
                }
            }
        }
    },
    updateModulePermission: (state, action)=>{
        const {objectType, ...rest} = action.payload;
        return{
            ...state,
            propAccess: {
                ...state.propAccess,
                [objectType] : {
                    ...state.propAccess[objectType],
                    ...rest
                }
            }
        }
    },
    setCustomModulePermission:(state, action)=>{
        return{
            ...state,
            propAccess: {
                ...state.propAccess,
                [action.payload.objectType]: {
                    ...state.propAccess[action.payload.objectType],
                    ["custom"+action.payload.objectType]: action.payload.custom
                }
            }
        }
    },
    resetPermission: (state, action)=>{
        return{
            ...state,
            propAccess: {
                Branch: {
                    view: "All Branch",
                    edit: "All Branch",
                    delete: "All Branch",
                },
                Employee: {
                    view: "All Employee",
                    edit: "All Employee",
                    delete: "All Employee",
                },
                Site: {
                    view: "All Site",
                    edit: "All Site",
                    delete: "All Site",
                },
                Customer: {
                    view: "All Customer",
                    edit: "All Customer",
                    delete: "All Customer",
                },
                SiteGroup: {
                    view: "All SiteGroup",
                    edit: "All SiteGroup",
                    delete: "All SiteGroup",
                },
            }
        }
    },
    setPreDefinedDBPermission: (state, action) =>{
        return{
            ...state,
            propAccess: {...action.payload}
        }
    }
  },
});


export const { setPreDefinedDBPermission, resetPermission,setCustomModulePermission, setlocalPermission, setDefaultPropPermission, updateDefaultPropPermissin, updateModulePermission } = permissionReducer.actions;
export default permissionReducer.reducer;