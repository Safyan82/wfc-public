import { createSlice } from '@reduxjs/toolkit';

const createFieldReducer = createSlice({
  name: 'createField',
  initialState: {
    labelValue: [],
    propertyToBeEditId: null,
    rules:{
        propertyVisibility:true,
        dateType: 'anyDate',
    },
    toggleSaveBtn: false,
    globalFieldType: '',
    propertyToBeEdit:{}
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
            rules:{
                propertyVisibility:true,
                dateType: 'anyDate',
            },
            propertyToBeEdit:{
                ...state.propertyToBeEdit,
                rules:{},
            },
        }
    },

    resetEditRules: (state, action) =>{
        return {
            ...state,
            propertyToBeEdit:{
                ...state.propertyToBeEdit,
                rules:{}
            },
        }
    },
    toggleSaveWhileUpdateProperty: (state, action) =>{
        return{
            ...state,
            toggleSaveBtn: true,
        }
    },
    setGlobalFieldType : (state, action) =>{
        return{
            ...state,
            globalFieldType: action.payload,
            rules:{
                propertyVisibility:true,
                dateType: 'anyDate',
            }, 
        }
    },
    resetFieldState : ()=> ({
        labelValue: [],
        propertyToBeEditId: null,
        rules:{
            propertyVisibility:true,
            dateType: 'anyDate',
        },
        toggleSaveBtn: false,
        globalFieldType: '',
        propertyToBeEdit:{}})
  },
});


export const { 
    setLabelValueForField, setEditPropertyId, 
    setPropertyTobeEdit, setRules, resetRules,
    toggleSaveWhileUpdateProperty,
    setGlobalFieldType, resetEditRules, resetFieldState,
    setEmailTags,
    } = createFieldReducer.actions;
export default createFieldReducer.reducer;