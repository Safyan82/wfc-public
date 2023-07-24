import React, { useEffect, useState } from 'react';
import {SearchOutlined} from '@ant-design/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Checkbox, Collapse, Input } from "antd";
import './editform.css';
import { useQuery } from '@apollo/client';
import { GetPropertyByGroupQuery } from '../../util/query/properties.query';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addFieldToBranchSchema, removeFieldFromBranchSchema } from '../../middleware/redux/reducers/branch.reducer';
import { Loader } from '../../components/loader';


export const AddProperty=({back})=>{

    const {data, loading, error} = useQuery(GetPropertyByGroupQuery);
    const [list, setList] = useState([]);
    const {branchSchema, propertyToBeRemoveFromSchema} = useSelector((state)=>state.branchReducer);
    const dispatch = useDispatch();

    useEffect(()=>{
        if(propertyToBeRemoveFromSchema){
            dispatch(removeFieldFromBranchSchema({_id: propertyToBeRemoveFromSchema}));

            const isExist = rawlist?.map((list)=>{
                const properties = list?.properties.map((property)=> {
                    if(property._id==propertyToBeRemoveFromSchema){
                        return {
                            ...property,
                            isChecked: false
                        }
                    }else{
                        return property
                    }
                });
    
                return {
                    ...list, properties
                }
            
            });
            setRawList(isExist);
        }
    }, [propertyToBeRemoveFromSchema]);


    const handelProperty = (e, propertyData)=>{
        if(e.target.checked){
            dispatch(addFieldToBranchSchema({...propertyData, isLocalDeleted: 0}));
            const isExist = rawlist?.map((list)=>{

                const properties = list?.properties.map((property)=> {
                    if(property._id==propertyData._id){
                        return {
                            ...property,
                            isChecked: true
                        }
                    }else{
                        return property
                    }
                });
    
                return {
                    ...list, properties
                }
            
            });
            setRawList(isExist);
        }else{
            dispatch(removeFieldFromBranchSchema(propertyData))
            const isExist = rawlist?.map((list)=>{

                const properties = list?.properties.map((property)=> {
                    if(property._id==propertyData._id){
                        return {
                            ...property,
                            isChecked: false
                        }
                    }else{
                        return property
                    }
                });
    
                return {
                    ...list, properties
                }
            
            });
            setRawList(isExist);
        }
    };

    const { branchSchemaNewFields } = useSelector(state=>state.branchReducer);
    

    const renderProperties = (property, id, propertyData, isChecked)=>{

        const isExist = branchSchema.find((field)=>field.propertyId===id);
        console.log(isExist);
        const isReadOnlyExist = branchSchema.find((field)=>field.propertyId===id && field.isReadOnly==true);
        if(isExist && !isReadOnlyExist){
            dispatch(addFieldToBranchSchema ({...propertyData, isMandatory: isExist?.isMandatory}));
            
        }
        
            
        return(
            <div style={{marginBottom:'16px'}} className='propertiesCheckboxes'>
                <Checkbox id={id} defaultChecked={isReadOnlyExist? isExist : isChecked} checked={isReadOnlyExist? isExist : isChecked} disabled={isReadOnlyExist} onChange={(e)=>handelProperty(e, propertyData)}>{property}</Checkbox>
            </div>
        );
        
        
        
    };
    
    const [rawlist, setRawList] = useState([]);
    useEffect(()=>{
        if(data?.getPropertyByGroup?.data){

            setRawList(data.getPropertyByGroup.data?.map((data)=>{
                const properties = data?.properties?.map((property)=>{
                    const isExist = branchSchema.find((field)=>field.propertyId===property._id);
                    const isLocalExist = branchSchemaNewFields.find((field)=>field._id===property._id && field.isLocalDeleted==0)
                    if(isExist && isLocalExist){
                        return {
                            ...property,
                            isChecked:true
                        }
                    }else{
                        return property
                    }
                });
                return {
                    ...data,
                    properties
                }
            }));
        }
    }, [data?.getPropertyByGroup]);


    useEffect(()=>{
        const d = rawlist?.map((data)=>({
            key: data._id,
            label: data._id,
            children: data?.properties?.map((property)=>renderProperties(property?.label, property?._id, property, property?.isChecked)) ,
        }));
        setList(d);
    },[rawlist]);

   

    return(
        <>
            
            <div className="sidebarheader">
                <div className='sidebarheader-innerText'>

                    <div className='sidebarheader-inner' onClick={back}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </div>
                    <span className='prop-text'>Add properties</span>
                </div>
            </div>
            <div className='content-text'>
                <div className="text">
                    <p style={{marginBottom:'12px'}}>
                        Properties are fields that capture and store information. Choose the properties users will see when they create a Branch. 
                    </p>
                    Either the post code, branch name, or address must be required.
                </div>
                
                    <Input 
                        className='generic-input-control search-prop'
                        suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
                        placeholder='Search properties'
                    />
                <div style={{marginTop:'5%'}}>
                    {loading?
                        <>
                        <br/>
                        <Loader />
                        </>
                        :
                        <Collapse accordion items={list}/>
                    }
                </div>

            </div>
        </>
    )
}