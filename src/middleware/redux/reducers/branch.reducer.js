import { createSlice } from '@reduxjs/toolkit';

const branchReducer = createSlice({
  name: 'branchReducer',
  initialState: {
    branchSchema: [],
    branchSchemaNewFields : [],
    propertyToBeRemoveFromSchema: null,
    propertyToBeMandatory: false,
    branchEditSchemaNewFields : [],
    refreshGrid: false,
    removeAllColumnsView: false,
  },
  reducers: {
    setPropertyToBeRemoveFromSchema: (state, action)=>{
        return {
            ...state,
            propertyToBeRemoveFromSchema: action.payload,
        }
    },

    setBranchSchema: (state, action) => {
       return {
        ...state,
        branchSchema: action.payload,
       }     
    },
    
    addFieldToBranchSchema: (state, action) => {
        const isExist = state.branchSchemaNewFields.find((schema)=>schema._id === action.payload._id);
        console.log(isExist, "isExist", action.payload);
        return {
         ...state,
         branchSchemaNewFields: isExist ? state.branchSchemaNewFields.map((schema)=>{
                if(schema._id==action.payload._id){
                    const {_id, ...rest} = action.payload
                    return {
                        ...schema,
                        ...rest,
                    }
                }else{
                    
                    return schema
                }  
            }): [...state.branchSchemaNewFields, {isLocalDeleted:0, ...action.payload}],
        }     
    },

    resetAndReorderBranchSchema : (state, action) => {
        console.log(action.payload, "payload");
        return{
            ...state,
            branchSchemaNewFields: action.payload.map((item)=>item)
        }   
    },

    addFieldToBranchEditColumn: (state, action) => {
        const isExist = state.branchEditSchemaNewFields.find((schema)=>schema._id === action.payload._id);
        
        return {
         ...state,
         branchEditSchemaNewFields: isExist ? state.branchEditSchemaNewFields.map((schema)=>{
                if(schema._id==action.payload._id){
                    const {_id, ...rest} = action.payload
                    return {
                        ...schema,
                        ...rest,
                    }
                }else{
                    
                    return schema
                }  
            }): [...state.branchEditSchemaNewFields, {isLocalDeleted:0, ...action.payload}],
        }     
    },

    resetbranchSchemaNewFields : (state, action) => {
        return {
            ...state,
            branchSchemaNewFields:[]
        }
    },

    resetSchemaNewFieldsOnCancel : (state, action) => {
        return {
            ...state,
            branchSchemaNewFields:[...state?.branchSchemaNewFields?.filter((field)=>field?.isNew!==1 || !field?.hasOwnProperty('isNew'))?.map((f)=>({...f,isLocalDeleted:0}))]
        }
    },

    removeFieldFromBranchSchema: (state, action) => {
        return{
            ...state,
            branchSchemaNewFields: state.branchSchemaNewFields.map((schema)=>{
                if(schema._id==action.payload._id){
                    const {_id, ...rest} = action.payload
                    return {
                        ...schema,
                        isLocalDeleted:1
                    }
                }else{
                    
                    return schema
                }  
            }),
            propertyToBeRemoveFromSchema: null,
        }
    },

    resetBranch:()=>{ return {branchSchemaNewFields:[], branchSchema:[], propertyToBeRemoveFromSchema:null, removeAllColumnsView:false}},

    refreshBranchGrid : (state, action) => {
        return {
            ...state,
            refreshGrid: action.payload
        }
    },
    
    removeAllColumns: (state, action) =>{
        return{
            ...state,
            branchSchemaNewFields: state.branchSchemaNewFields.map((schema)=>{
                
                return {
                    ...schema,
                    isLocalDeleted: 1
                }
               
            }),
            removeAllColumnsView: action.payload
        }
    }

  },

});


export const { resetSchemaNewFieldsOnCancel, resetBranch, resetAndReorderBranchSchema, setBranchSchema, addFieldToBranchSchema, refreshBranchGrid,
    addFieldToBranchEditColumn, removeFieldFromBranchSchema, 
    setPropertyToBeRemoveFromSchema, resetbranchSchemaNewFields, removeAllColumns } = branchReducer.actions;
export default branchReducer.reducer;