import React, { useEffect, useState } from 'react';
import {SearchOutlined} from '@ant-design/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Checkbox, Collapse, Divider, Drawer, Input } from "antd";
import { useQuery } from '@apollo/client';
import { GetPropertyByGroupQuery } from '../../../util/query/properties.query';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addFieldToBranchSchema, removeFieldFromBranchSchema } from '../../../middleware/redux/reducers/branch.reducer';
import { Loader } from '../../../components/loader';
import { objectType } from '../../../util/types/object.types';


export const AddProperty=({back, close, visible, isPropOpen, setProp})=>{

    const {data, loading, refetch} = useQuery(GetPropertyByGroupQuery,{
        fetchPolicy:'network-only',
        variables:{
            objectType: objectType.Employee
        }
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

    const { branchSchemaNewFields } = useSelector(state=>state.branchReducer);
    

    const renderProperties = (property, id, propertyData, isChecked, order)=>{

        const isExist = branchSchema.find((field)=>field.propertyId===id);
        const isReadOnlyExist = branchSchema.find((field)=>field.propertyId===id && field.isReadOnly==true);
        if(isExist && !isReadOnlyExist){
            dispatch(addFieldToBranchSchema ({...propertyData, isMandatory: isExist?.isMandatory, order: isExist?.order}));
            
        }
        
            
        return(
            <div style={{marginBottom:'16px'}} className='propertiesCheckboxes'>
                <Checkbox id={id} defaultChecked={isReadOnlyExist? isExist : isChecked} checked={isReadOnlyExist? isExist : isChecked} disabled={isReadOnlyExist} onChange={(e)=>handelProperty(e, propertyData, isExist?.order)}>{property}</Checkbox>
            </div>
        );
        
        
        
    };
    
    const [rawlist, setRawList] = useState([]);
    const [dataToSearch, setDataToSearch] = useState();

    useEffect(()=>{
        if(data?.getPropertyByGroup?.data){
            const rawData = data.getPropertyByGroup.data?.map((data)=>{
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
            });

            setRawList([...rawData]);
            setDataToSearch([...rawData]);
        }
    }, [data?.getPropertyByGroup]);


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
            console.log(finalData);
            setRawList([...finalData]);
            setActiveKeys(finalData?.map(data=>data._id));
        }else{
            setRawList([...dataToSearch])
        }
    };  

    // const [isPropOpen, setProp] = useState(false);

    return(
        <>
        <Drawer
            title={
                isPropOpen?
                <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                    
                    <span>Add properties</span>
                    {/* <FontAwesomeIcon icon={faChevronLeft} style={{cursor:'pointer'}} onClick={()=>setProp(false)} /> */}
                </div>
                :
                "Edit Employee Form"
            }
            placement="right"
            closable={true}
            onClose={()=>{close();setProp(false)}}
            closeIcon={<FontAwesomeIcon icon={faClose} onClick={close} className='close-icon'/>}
            visible={visible}
            width={600}
            
            maskClosable={false}
            mask={false}
            footer={
              <div className='drawer-footer'>
                 
                  <button className='drawer-outlined-btn' onClick={()=>{close();setProp(false)}}>Cancel</button>
              </div>
            }
        >
        {
            isPropOpen?
            <>
                <div className='content-text'>
                    <div className="text">
                        <p style={{marginBottom:'12px'}}>
                            Properties are fields that capture and store information. Choose the properties users will see when they create a Employee. 
                        </p>
                        Either the post code, branch name, or address must be required.
                    </div>
                    
                        <Input 
                            className='generic-input-control search-prop'
                            suffix={query? 
                                <FontAwesomeIcon style={{color:'#7c98b6', cursor:'pointer', fontSize: '20px'}} onClick={()=>{setQuery('');handelSearch('');}} icon={faClose}/> : 
                                <FontAwesomeIcon style={{color:'#0091ae'}} icon={faSearch}/> }
                            placeholder='Search properties'
                            onChange={(e)=>{
                                handelSearch(e);
                                setQuery(e.target.value);
                            }}
                            value={query}
                        />
                    <div style={{marginTop:'5%', marginBottom:'5%'}}>
                        {loading?
                            <>
                            <br/>
                            <Loader />
                            </>
                            :
                            
                            query?.length>0 ?
                            <Collapse activeKey={activeKeys}  items={list}/>
                            :
                            <Collapse   items={list}/>
                        }
                    </div>

                </div>
            </>

            :
             null

            // <>
            //     {/* main content of property */}
            //     <div className="left-sidebar-item">
            //         <div className="left-sidebar-item-text" onClick={()=>setProp(true)} >Add properties</div>
            //         <FontAwesomeIcon icon={faChevronRight} style={{fontSize:'18px'}} />
            //     </div>
            //     <Divider/>
            //     <div className="left-sidebar-item">
            //         <div className="left-sidebar-item-text">Add conditional logic</div>
            //         <FontAwesomeIcon icon={faChevronRight} style={{fontSize:'18px'}} />
            //     </div>
            //     <Divider/>
            //     <div className="left-sidebar-item">
            //         <div className="left-sidebar-item-text">Add associations </div>
            //         <FontAwesomeIcon icon={faChevronRight} style={{fontSize:'18px'}} />
            //     </div>
            // </>
        }
        </Drawer>

        </>
    )
}