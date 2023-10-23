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

    resetBranch:()=>{ return {branchSchema:[], propertyToBeRemoveFromSchema:null, removeAllColumnsView:false}},

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


export const { setBranchSchema, addFieldToBranchSchema, refreshBranchGrid,
    addFieldToBranchEditColumn, removeFieldFromBranchSchema, 
    setPropertyToBeRemoveFromSchema, resetbranchSchemaNewFields, removeAllColumns } = branchReducer.actions;
export default branchReducer.reducer;