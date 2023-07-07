import { createSlice } from '@reduxjs/toolkit';

const createFieldReducer = createSlice({
  name: 'createField',
  initialState: {
    labelValue: [],
    propertyToBeEditId: null,
    rules:{
        propertyVisibility:true,
        dateType: 'anyDate',
    }
  },
  reducers: {
    setLabelValueForField: (state, action) => {
       return {
        ...state,
        labelValue: action.payload,
       }     
    },
    setEditPropertyId: (state, action) => {
        return{
            ...state,
            propertyToBeEditId: action.payload
        }
    },
    setPropertyTobeEdit: (state, action) => {
        return{
            ...state,
            propertyToBeEdit: action.payload,
        }
    },
    setRules: (state,action) =>{
        return{
            ...state,
            rules: {...state.rules, ...action.payload},
        }
    },
    resetRules: (state, action) =>{
        return {
            ...state,
            rules:{},
        }
    }
  },
});


export const { setLabelValueForField, setEditPropertyId, setPropertyTobeEdit, setRules, resetRules } = createFieldReducer.actions;
export default createFieldReducer.reducer;