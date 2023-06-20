import React, { useState, useEffect } from 'react';
import { Select, Input, Button, Modal, Radio, Checkbox, Form, Switch } from 'antd';
import CheckboxTable from './table';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
const { Option } = Select;

const multi=[
    'singleCheckbox',
    'multiCheckbox',
    'selectDropdown',
    'radioDropdown',
];


export function CreateField({fieldType,label}){
    const [fields, setFields] = useState([]);
    const [singleInput, setSingleInput] = useState([
    'text',
    'multilineText',
    'singlelineNumber',
    'password',
    'number','email','date','time','datetime-local']);
    const [multiInput, setMutiInput] = useState(['multiCheckbox', 'selectDropdown', 'radioDropdown']);

    const [labelValue, setLabelValue] = useState([{id:0}]);
    const [selectedId, setSelectedId] = useState();
    const [visible, setVisible] = useState(false);
    const [inputTypeDefaultValue, setinputTypeDefaultValue] = useState("none");
    

    useEffect(()=>{
        if(fieldType){
            handelChange(fieldType);
        }
    },[fieldType])

    const handelChange=(e)=>{
        
        const id= new Date().getMilliseconds();
        switch(e){
            case 'singlelineText':
                setFields([{id: new Date().getMilliseconds(), type: 'text', label}]);
                break;
            case 'multilineText':
                setFields([{id: new Date().getMilliseconds(), type: 'multilineText', label}]);
                break;
            case 'email':
                setFields([{id: new Date().getMilliseconds(), type: 'email', label}]);
                
            break;
            case 'phone':
                setFields([{id: new Date().getMilliseconds(), type: 'text', label}]);  
            break;
            case 'password':
                setFields([{id: new Date().getMilliseconds(), type: 'password', label}]);
                
            break;
            case 'number':
                setFields([{id: new Date().getMilliseconds(), type: 'number', label}]);
                
                break;
            case 'date':
                setFields([{id: new Date().getMilliseconds(), type: 'date', label}]);
                
                break;
            case 'time':
                setFields([{id: new Date().getMilliseconds(), type: 'time', label}]);
                
                break;
            case 'datetime-local':
                setFields([{id: new Date().getMilliseconds(), type: 'datetime-local', label}]);
                
                break;

            case 'radioDropdown':
                setFields([{id, type: 'select' , group:'radioDropdown' , label}]);
                setSelectedId(id)
                break;

            case 'selectDropdown':
                setFields([{id, type: 'select', group:'selectDropdown' , label}]);
                setSelectedId(id)
                break;

            case 'multiCheckbox':
                setFields([{id, type: 'select', group:'multiCheckbox' , label}]);
                setSelectedId(id)
                
                break;
                
        }
        setinputTypeDefaultValue("none");
    }

    const handelValue=(e, index)=>{
        if(e.key=="Enter"){
            setLabelValue([...labelValue, {id:index+1}]);
            setTimeout(()=>{

                const nextField = document.getElementById(`key${(index+1)}`);
                nextField.focus();
            },100)
        }else{
            setLabelValue(labelValue?.map((lv)=>{
                if(lv.id==index){
                    return {
                        ...lv,
                        [e.target.name]: e.target.value,
                    }
                }else{
                    return lv;
                }
            }))
        }
    }

    const [tableData, setTableData] = useState([]);

    useEffect(()=>{
        setTableData(labelValue?.map((lv, i)=>(
            {
                key: i,
                label: <Input id={"key"+i} className='generic-input-control' placeholder='Enter label' name="key" onKeyUp={(e) => handelValue(e, i)} />,
                value: <Input className='generic-input-control'  placeholder='Value' name="Enter value" onKeyUp={(e) => handelValue(e, i)} />,
                toggle: <Switch/>
            } 
        )));
    },[labelValue]);


    const createOption=()=>{
        setLabelValue([...labelValue, {id:labelValue.length}]);
            setTimeout(()=>{

                const nextField = document.getElementById(`key${(labelValue.length)}`);
                nextField.focus();
            },100)
    }

    const footerContent = ()=>{
        return(

          <div className='table-footer'>
          <div onClick={createOption}>
            <FontAwesomeIcon icon={faPlus}/> <span>Add an option</span>
          </div>
            <div>
              <FontAwesomeIcon icon={faList}/> <span>Load options</span>
            </div>
            <div onClick={
                async()=>{
                    await setLabelValue([{id:0}]); 
                    document.getElementById("key0").value=null;
            }}>
              <FontAwesomeIcon icon={faTrash}/> <span>Clear all</span>
            </div>
          </div>
        )
      }


    return(

        <>
            
            {multi.includes(fieldType) && 
                <CheckboxTable tableData={tableData} footerContent={footerContent} />
            }
        
            <Form.Item>
                <label>Preview</label>
                <div className='preview-box'>
                    {fields?.length > 0 &&
                        fields?.reverse()?.map((field)=>{
                            return (
                            <> 
                            {singleInput.includes(field?.type) ? 
                                field?.type=="multilineText" ?
                                
                                <>
                                    <label>{label}</label>
                                    <Input.TextArea rows={4} placeholder={field?.type[0].toLocaleUpperCase() + field?.type?.slice(1)} className='generic-input-control'/> 
                                    
                                </>

                                :
                                <>
                                    <label>{label}</label>
                                    <Input type={field?.type} placeholder={field?.type[0].toLocaleUpperCase() + field?.type?.slice(1)} className='generic-input-control'/> 
                                    
                                </>
                                :
                                field?.type=='select' &&
                                <>
                                    <label>{label}</label>
                                    <Select 
                                        mode={field?.group == "multiCheckbox" && "tags"}
                                        
                                    >
                                        {labelValue?.map((option)=>(<Option value={option.value}> {option.key} </Option>))}
                                    </Select>
                                    
                                </>
                            }
                            
                            </>
                            )
                        })
                    }
                </div>
            </Form.Item>
        </>
    )
}