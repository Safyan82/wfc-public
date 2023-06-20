import React, { useState, useEffect } from 'react';
import { Select, Input, Button, Modal, Radio, Checkbox, Form, Switch } from 'antd';
import CheckboxTable from './table';
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
    const [multiInput, setMutiInput] = useState(['select', 'checkbox', 'radio']);

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

            case 'checkbox':
                setFields([{id, type: 'checkbox', label}]);
                setSelectedId(id)
                setVisible(true);
                break;

            case 'select':
                setFields([{id, type: 'select', label}]);
                setSelectedId(id)
                setVisible(true);
                break;

            case 'radio':
                setFields([{id, type: 'radio', label}]);
                setSelectedId(id)
                setVisible(true);
                break;
                
        }
        setinputTypeDefaultValue("none");
    }
 
  
    const handleOk = () => {
      setFields(fields.map((field)=>{
        if(field.id===selectedId){
            return {
                ...field,
                options:labelValue,
            };
        }else{
            return field;
        }
      }));
      setSelectedId(null);
      setLabelValue([{id:0}])
      setVisible(false);
    };
  
    const handleCancel = () => {
      setVisible(false);
    };

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
                label: <Input id={"key"+i} className='generic-input-control' placeholder='Key' name="key" onKeyUp={(e) => handelValue(e, i)} />,
                value: <Input className='generic-input-control'  placeholder='Value' name="value" onKeyUp={(e) => handelValue(e, i)} />,
                toggle: <Switch/>
            } 
        )));
    },[labelValue]);

    return(

        <>
            
            {multi.includes(fieldType) && 
                <CheckboxTable tableData={tableData} />
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
                                field?.type=='select' ? 
                                <>
                                    <Select className='createdField'>
                                        {field.options?.map((option)=>(<Option value={option.value}>{option.key}</Option>))}
                                    </Select>
                                    
                                </>
                                :
                                field?.type=='checkbox' ? 
                                <>
                                    {field?.options?.map((option)=>(
                                        <Checkbox className='createdField'>
                                            {option.key}
                                        </Checkbox>
                                    ))}
                                </>
                                :
                                field?.type=='radio' && 
                                <div style={{ }}>
                                    <Radio.Group className='createdField'>
                                        {field.options?.map((option)=>(
                                            <Radio type={field.type} value={option.value} >{option.key}</Radio>
                                        ))}

                                    </Radio.Group>
                                </div>
                            }
                            
                            </>
                            )
                        })
                    }
                </div>
                <Modal
                    title="Set Values"
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                        {labelValue?.map((lv, i)=>(
                            <div style={{display:'flex', columnGap:'10px', marginTop:'3%'}}>
                            <>
                                <Input placeholder='Key' name="key" onKeyUp={(e) => handelValue(e, i)} />
                                <Input placeholder='Value' name="value" onKeyUp={(e) => handelValue(e, i)} />
                            </>
                            </div>
                        ))}
                </Modal>
                
            </Form.Item>
        </>
    )
}