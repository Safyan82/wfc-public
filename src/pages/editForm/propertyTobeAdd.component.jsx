import React, { useEffect, useState } from 'react';
import {SearchOutlined} from '@ant-design/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faClose, faExternalLink, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Checkbox, Collapse, Input } from "antd";
import './editform.css';
import { useQuery } from '@apollo/client';
import { GetPropertyByGroupQuery } from '../../util/query/properties.query';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addFieldToBranchSchema, removeAllColumns, removeFieldFromBranchSchema } from '../../middleware/redux/reducers/branch.reducer';
import { Loader } from '../../components/loader';
import { Link } from 'react-router-dom';
import { SingleBranchViewQuery } from '../../util/query/branchView.query';


export const PropertyToBeAdd=({back})=>{

    const {data, loading, refetch} = useQuery(GetPropertyByGroupQuery,{
        fetchPolicy:'network-only'
    });
    const [list, setList] = useState([]);
    const {branchSchema, propertyToBeRemoveFromSchema} = useSelector((state)=>state.branchReducer);
    const dispatch = useDispatch();

    useEffect(()=>{
        refetch()
    }, []);

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


    const handelProperty = (e, propertyData, order)=>{
        if(e.target.checked){
            dispatch(addFieldToBranchSchema({...propertyData, isLocalDeleted: 0, isNew: 1, order}));
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

    const { branchSchemaNewFields, removeAllColumnsView } = useSelector(state=>state.branchReducer);
    
    const {data: branchView, loading: branchViewLoading, refetch: branchViewRefetch} = useQuery(SingleBranchViewQuery,{
        variables:{
          id: sessionStorage.getItem("selectedViewId")
        },
        fetchPolicy: 'network-only'
    });

    const renderProperties = (property, id, propertyData, isChecked, order)=>{
        const isExist =  branchSchema?.find((field)=>field.propertyId===id && field.isReadOnly);
        const isExistInSchema =  branchSchema?.find((field)=>field.propertyId===id );
        const  isMandatoryReadOnlyExist = branchView?.singlebranchView?.viewFields?.find((viewProp)=>viewProp?._id==id)
        const isReadOnlyExist = branchSchema?.find((field)=>field.propertyId===id && field.isReadOnly==true);
        if(isMandatoryReadOnlyExist){
            dispatch(addFieldToBranchSchema({...propertyData, isMandatory: isExist?.isMandatory, order: isExist?.order}));
        }
        
        if(isExistInSchema){
            return(
                <div style={{marginBottom:'16px'}} className='propertiesCheckboxes'>
                    <Checkbox 
                        id={id} 
                        defaultChecked={isReadOnlyExist? isExist : isChecked} 
                        disabled={isReadOnlyExist} 
                        checked={isReadOnlyExist? isExist  : isChecked}
                        onChange={(e)=>handelProperty(e, propertyData, isExist?.order)}
                    >
                        <span className='text'>{property}</span> 
                    </Checkbox>
                </div>
            );
        }   
        
        
        
    };
    
    const [rawlist, setRawList] = useState([]);
    const [dataToSearch, setDataToSearch] = useState();

    useEffect(()=>{
        if(data?.getPropertyByGroup?.data && branchView?.singlebranchView?.viewFields){
            const rawData = data.getPropertyByGroup.data?.map((data)=>{
                const properties = data?.properties?.map((property)=>{
                    
                    const isExist =  branchView?.singlebranchView?.viewFields?.find((field)=>field._id===property._id);
                    const isLocalExist = branchSchemaNewFields?.find((field)=>field._id===property._id && field.isLocalDeleted==0)

                    if(isExist){
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
            });

            setRawList([...rawData]);
            setDataToSearch([...rawData]);
        }
    }, [data?.getPropertyByGroup, branchView?.singlebranchView?.viewFields]);

    // removeAllColumnsView

    useEffect(()=>{
        if(removeAllColumnsView){
            const rawData = data.getPropertyByGroup.data?.map((data)=>{
                const properties = data?.properties?.map((property)=>{
                    
                    const isExist =  branchView?.singlebranchView?.viewFields?.find((field)=>field._id===property._id);

                    if(isExist){
                        return {
                            ...property,
                            isChecked:false
                        }
                    }else{
                        return property
                    }
                });
                return {
                    ...data,
                    properties
                }
            });

            setRawList([...rawData]);
            setDataToSearch([...rawData]);
            dispatch(removeAllColumns(false))
        }
    },[removeAllColumnsView]);

    useEffect(()=>{
        const d = rawlist?.map((data)=>({
            key: data._id,
            label: data._id,
            children: data?.properties?.map((property)=>renderProperties(property?.label, property?._id, property, property?.isChecked, data?.order)) ,
        }));
        setList(d);
    },[rawlist]);

    const [activeKeys, setActiveKeys] = useState([]);
    const [query, setQuery] = useState("");
    const handelSearch = (e) =>{
        if(e?.target?.value?.length>0){

            const queryData = dataToSearch?.map((parent)=>{
                const properties = parent?.properties?.filter((property)=>((property.label.toLowerCase()).includes(e.target.value.toLowerCase())));
                return {
                    ...parent,
                    properties: [...properties],
                }
            });
            const finalData = queryData?.filter((data)=> data?.properties?.length>0);
            setRawList([...finalData]);
            setActiveKeys(finalData?.map(data=>data._id));
        }else{
            setRawList([...dataToSearch])
        }
    };  

    return(
        <>
            
            <div className='content-text'>
                
                    <Input 
                        className='generic-input-control search-prop'
                        suffix={query? 
                            <FontAwesomeIcon style={{color:'#7c98b6', cursor:'pointer', fontSize: '20px'}} onClick={()=>{setQuery('');handelSearch('');}} icon={faClose}/> : 
                            <FontAwesomeIcon style={{color:'#0091ae'}} icon={faSearch}/> }
                        placeholder='Search Columns...'
                        onChange={(e)=>{
                            handelSearch(e);
                            setQuery(e.target.value);
                        }}
                        value={query}
                    />
                <div style={{marginTop:'1px', marginBottom:'5%'}}>
                    {loading || branchViewLoading?
                        <>
                        <br/>
                        <Loader />
                        </>
                        :
                        
                        <div style={{
                            maxHeight: '300px',
                            height: '210px',
                            overflow: 'scroll',
                            paddingTop: '3%'
                        }}>
                            {list?.map((data)=>(
                                <>
                                <div style={{color:'black',marginBottom:'10px', letterSpacing:'0.6px'}}>{data?.key}</div>
                                {data?.children.map((c)=>c)}
                                </>
                            ))}
                        </div>
                    }
                    <div className="text">Don't see the property you're looking for? <a href='' __blank style={{color:'#0091ae', fontWeight:'bold', letterSpacing:'0.3px'}}>Create a property <FontAwesomeIcon icon={faExternalLink}/> </a></div>

                </div>

            </div>
        </>
    )
}