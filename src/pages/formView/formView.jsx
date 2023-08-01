import './formView.css';
import { FormHeader } from "../../components/header/header";
import { DatePicker, Form, Input, Select, TimePicker, TreeSelect } from 'antd';
import dayjs from 'dayjs';
import { useQuery } from '@apollo/client';
import { GET_BRANCHES, GetBranchObject } from '../../util/query/branch.query';
import { useEffect, useState } from 'react';
import { Loader } from '../../components/loader';

export const FormView = ()=>{
    
    const {data:branchObjectData, loading: branchObjectLoading, refetch: schemaRefetch} = useQuery(GetBranchObject,{
        fetchPolicy:'network-only'
    });
    const [branchProperties, setBranchProperties] = useState();

    useEffect(()=>{
        const preFields = branchObjectData?.getBranchProperty?.response.filter((branch)=>branch?.order == undefined) || [];
        const orderedFields = branchObjectData?.getBranchProperty?.response.filter((branch)=>branch?.order !==undefined).sort((a,b)=>a.order-b.order) || [];
        const mandatoryFields = branchObjectData?.getBranchProperty?.response.filter((branch)=>branch?.isMandatory) || [];
        setBranchProperties([...preFields, ...orderedFields]);
    },[branchObjectData]);

    return(
        <>
        
            <FormHeader
                title={"Preview Branch Form"}
                btnVisibility={false}
                url="/user/branch"
            />

            <div className="form-view-inner">
                <div className="form-view-body">
                    <div className="form-view-header">
                        <div className="h2">Review what users will see</div>
                    </div>

                    <div className="spacer">
                        <div className="form-view">

                            <div className="form-head-btn">
                                <div className='btn-skt'></div>
                                <div className='btn-skt'></div>
                                <div className='btn-skt'></div>
                            </div>
                            <div className="form-view-innerheader">
                                <div className="form-view-innerheader-wrap" >
                                    Create Branch 
                                </div>
                            </div>

                            {branchObjectLoading ? 
                            <Loader/>
                            :
                            <div className="form-view-inner-body">
                            {branchProperties?.map((property)=>{
                                const name = property?.propertyDetail?.label.replaceAll(" ","").toLowerCase();

                                return(
                                    
                                    property?.propertyDetail?.fieldType==="singlelineText" || property?.propertyDetail?.fieldType==="password" || property?.propertyDetail?.fieldType==="email" ?
                                    
                                    <Form.Item>
                                        <label>{property?.propertyDetail?.label} <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
                                        <Input 
                                            className='generic-input-control' 
                                            type={property?.propertyDetail?.fieldType==="password"? "password" : "text"}
                                            name={name} 
                                            id={name} 
                                            disabled
                                        />
                                    </Form.Item>  
                                    
                                    : property?.propertyDetail?.fieldType==="multilineText"?

                                    <Form.Item>
                                        <label>{property?.propertyDetail?.label} <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
                                        <Input.TextArea rows={4} 
                                            className='generic-input-control' 
                                            name={name} 
                                            id={name} 
                                            disabled
                                        />
                                    </Form.Item>  

                                    : property?.propertyDetail?.fieldType=="singleCheckbox" ?
                                    
                                    <Form.Item>
                                        <label>{property?.propertyDetail?.label} <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
                                        <Select
                                            name={name}
                                            id={name}
                                            
                                        >
                                            <Select.Option value="yes">Yes</Select.Option>
                                            <Select.Option value="no">No</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    
                                    : property?.propertyDetail?.fieldType == 'selectDropdown' || property?.propertyDetail?.fieldType == 'radioDropdown' ?
                                    
                                    <Form.Item>
                                        <label>{property?.propertyDetail?.label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup> </label>
                                            <Select 
                                            className='custom-select'  
                                            suffixIcon={<span className='dropdowncaret'></span>}
                                            name={name}
                                            id={name}
                                            
                                            >
                                                {property?.propertyDetail?.options?.map((option)=>(<Select.Option value={option.value}> {option.key} </Select.Option>))}
                                            </Select>
                                    </Form.Item>  
                                    
                                    : property?.propertyDetail?.fieldType == 'multiCheckbox' ?
                                    <Form.Item>
                                        <label>{property?.propertyDetail?.label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup> </label>
                                    <TreeSelect 
                                        multiple
                                        treeCheckable
                                        className='custom-select'   
                                        name={name}
                                        id={name}

                                        suffixIcon={<span className='dropdowncaret'></span>}
                                    >
                                        {property?.propertyDetail?.options?.map((option)=>(
                                            option?.value?.length > 0 && option?.showFormIn && <TreeSelect.TreeNode value={option.value} title={option.key}/>
                                        ))}
                                    </TreeSelect>
                                
                                    </Form.Item>  
                                    : property?.propertyDetail?.fieldType == 'date' || property?.propertyDetail?.fieldType == 'datetime-local'?
                                    <Form.Item>
                                    <label>{property?.propertyDetail?.label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
                                    <DatePicker
                                        showTime={property?.propertyDetail?.fieldType == "datetime-local"}
                                        name={name}                                       
                                        id={name}
                                        className='generic-input-control'
                                        suffixIcon={null}
                                    />
                                    </Form.Item>
                                    : property?.propertyDetail?.fieldType == 'time' ?
                                    <Form.Item>
                                    <label>{property?.propertyDetail?.label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
                                    <TimePicker
                                        id={name}
                                        className='generic-input-control'
                                        suffixIcon={null}
                                    />
                                    </Form.Item>
                                    :
                                    <Form.Item>
                                        <label>{property?.propertyDetail?.label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
                                        <Input 
                                        id={name}
                                        name={name} 
                                        disabled
                                        type={property?.propertyDetail?.fieldType} className='generic-input-control'
                                        /> 
                                        
                                    </Form.Item>
                                
                                )
                                })}
                            </div>
                            }

                            {/* footer */}

                            <div className="form-view-footer">
                                <div className="form-view-btn-layout">
                                    <div className="form-view-btn-layout-btn">
                                        <div className="btn-inner"></div>
                                    </div>
                                    <div className="form-view-btn-layout-btn">
                                        <div className="btn-inner"></div>
                                    </div>
                                    <div className="form-view-btn-layout-btn">
                                        <div className="btn-inner"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
};