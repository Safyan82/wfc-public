import React, { useState, useEffect } from 'react';
import { Select, Input, Button, Modal, Radio, Checkbox } from 'antd';
const { Option } = Select;




export function CreateField(){

    const [fields, setFields] = useState([]);
    const [singleInput, setSingleInput] = useState(['text','password','number','email','date','time','datetime-local']);
    const [multiInput, setMutiInput] = useState(['select', 'checkbox', 'radio']);

    const [labelValue, setLabelValue] = useState([{id:0}]);
    const [selectedId, setSelectedId] = useState();
    const [visible, setVisible] = useState(false);
    const [inputTypeDefaultValue, setinputTypeDefaultValue] = useState("none");
    useEffect(()=>{
        console.log(fields);
    },[fields])

    useEffect(()=>{
        console.log(labelValue);
    },[labelValue])

    const handelChange=(e)=>{
        
        const id= new Date().getMilliseconds();
        switch(e){
            case 'text':
                setFields([...fields, {id: new Date().getMilliseconds(), type: 'text'}]);
                break;
            case 'password':
                setFields([...fields, {id: new Date().getMilliseconds(), type: 'password'}]);
                
                break;
            case 'number':
                setFields([...fields, {id: new Date().getMilliseconds(), type: 'number'}]);
                
                break;
            case 'date':
                setFields([...fields, {id: new Date().getMilliseconds(), type: 'date'}]);
                
                break;
            case 'time':
                setFields([...fields, {id: new Date().getMilliseconds(), type: 'time'}]);
                
                break;
            case 'datetime-local':
                setFields([...fields, {id: new Date().getMilliseconds(), type: 'datetime-local'}]);
                
                break;

            case 'checkbox':
                setFields([...fields, {id, type: 'checkbox'}]);
                setSelectedId(id)
                setVisible(true);
                break;

            case 'select':
                setFields([...fields, {id, type: 'select'}]);
                setSelectedId(id)
                setVisible(true);
                break;

            case 'radio':
                setFields([...fields, {id, type: 'radio'}]);
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

    return(
        <div>
            <Select defaultValue={inputTypeDefaultValue} value={inputTypeDefaultValue} onChange={(e)=>handelChange(e)} className='addFields'>
                <Option value="none" Selected hidden>Select Field Type</Option>
                <Option value="text">Text Field</Option>
                <Option value="password">Password Field</Option>
                <Option value="radio">Radio Button</Option>
                <Option value="checkbox">CheckBoxes</Option>
                <Option value="select">Dropdown</Option>
                <Option value="number">Number Field</Option>
                <Option value="date">date</Option>
                <Option value="time">time</Option>
                <Option value="datetime-local">datetime</Option>
            </Select>
            <div>
                {fields?.length > 0 ?
                    fields?.reverse()?.map((field)=>{

                        return (
                        <> 
                        {singleInput.includes(field?.type) ? 
                            <>
                                <Input type={field?.type} placeholder={field?.type[0].toLocaleUpperCase() + field?.type?.slice(1)+" Field"} className='createdField'/> 
                                <Button type="primary" danger ghost onClick={()=>setFields(fields.filter((ff)=>ff?.id !==field?.id))}>-</Button>
                                <br/>
                            </>
                            :
                            field?.type=='select' ? 
                            <>
                                <Select className='createdField'>
                                    {field.options?.map((option)=>(<Option value={option.value}>{option.key}</Option>))}
                                </Select>
                                <Button type="primary" danger ghost onClick={()=>setFields(fields.filter((ff)=>ff.id !==field.id))}>-</Button>
                                <br/>
                            </>
                            :
                            field?.type=='checkbox' ? 
                            <>
                                {field?.options?.map((option)=>(
                                    <Checkbox className='createdField'>
                                        {option.key}
                                    </Checkbox>
                                ))}
                                <Button type="primary" danger ghost onClick={()=>setFields(fields.filter((ff)=>ff.id !==field.id))}>-</Button>
                                <br/>
                            </>
                            :
                            field?.type=='radio' && 
                            <div style={{ }}>
                                <Radio.Group className='createdField'>
                                    {field.options?.map((option)=>(
                                        <Radio type={field.type} value={option.value} >{option.key}</Radio>
                                    ))}
                                    <Button type="primary" danger ghost onClick={()=>setFields(fields.filter((ff)=>ff.id !==field.id))}>-</Button>
                                    

                                </Radio.Group>
                            </div>
                        }
                        
                        </>
                        )
                    })
                :null}
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
            
        </div>

    )
}