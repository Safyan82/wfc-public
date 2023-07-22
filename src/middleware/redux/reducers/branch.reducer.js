import { createSlice } from '@reduxjs/toolkit';

const branchReducer = createSlice({
  name: 'branchReducer',
  initialState: {
    branchSchema: [],
    branchSchemaNewFields : [],
    propertyToBeRemoveFromSchema: null,
    propertyToBeMandatory: false,
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
    resetBranch:()=>{ return {branchSchema:[], propertyToBeRemoveFromSchema:null}},
  },
});


export const { setBranchSchema, addFieldToBranchSchema, removeFieldFromBranchSchema, setPropertyToBeRemoveFromSchema } = branchReducer.actions;
export default branchReducer.reducer;