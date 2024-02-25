import React, {useEffect, useState} from 'react';
import { Form, Input, Select, Typography } from 'antd';
import {
    SearchOutlined,
  } from '@ant-design/icons';
import { resetFieldState, setGlobalFieldType } from '../../../../middleware/redux/reducers/createField.reducer';
import { useDispatch } from 'react-redux';
import { CreateField } from '../../../../components/createFields/dynamicField';


const multi=[
    'multiCheckbox',
    'selectDropdown',
    'radioDropdown',
];

export const SkillFieldType = ({width, setWidth, field, setFields, index, allFields})=>{
    const {Option, OptGroup} = Select;
    const [sortType, setSortType] = useState('custom');
    const [search, setSearchKeyword] = useState(null);
    const [fieldTypeFocused, setFieldTypeFocused] = useState(false);

    const dispatch = useDispatch();

    useEffect(()=>{
        if(multi.includes(field?.fieldType)){
            setWidth(true);
        }else{
            setWidth(false);
        }
    },[field]);
    
    useEffect(()=>{
        return()=>{
          document.getElementById("nextBtn")?.classList?.remove("disabled-btn");
        }
      },[]);


    const handelChanges = (prop, value)=>{

        if(prop=="label"){
            setFields(allFields?.map((af)=>{
                if(af.id==field?.id){
                    return {
                        ...af,
                        [prop]:value,
                        isExist:0
                    }
                }else{
                    return af
                }
            }))

        }
        else{

            setFields(allFields?.map((af)=>{
                if(af.id==field?.id){
                    return {
                        ...af,
                        [prop]:value
                    }
                }else{
                    return af
                }
            }))
        }
    }
    
    return(
        <React.Fragment>

            {
                <Form.Item
                    style={{marginTop:'32px'}}
                >
                    <label>Label {field?.fieldType? "Of "+field?.fieldType +" field Type" : null}</label>
                    <Input 
                        className='generic-input-control'
                        placeholder='Set Field Label'
                        onChange={(e)=>handelChanges("label", e.target.value)}
                        value={field?.label}
                    />
                </Form.Item>
            }

            {
            field?.isExist==0?
                <>
                <Form.Item className={width?"maxWidthSkillFieldType":'skillFieldType'}>
                    <label>Field type</label>
                    <Select 
                        showSearch
                        className={multi.includes(field?.fieldType) ? "custom-select step2" : "custom-select"}
                        suffixIcon={<span className="dropdowncaret"></span>}
                        onChange={(e)=>{
                            handelChanges("fieldType",e);
                            if(fieldTypeFocused){
                                dispatch(setGlobalFieldType(e));
                            }
                        }}
                        placeholder="Select field type"
                        value={field?.fieldType}
                        style={{marginBottom:'32px'}}
                        onFocus={()=>setFieldTypeFocused(true)}
                        onBlur={()=>setFieldTypeFocused(false)}
                    >
                        <OptGroup label="Meta Field">
                            <Option value="email">Email</Option>
                            <Option value="password">Password</Option>
                            {/* <Option value="phone">Phone</Option> */}
                        </OptGroup>
                        <OptGroup label="Text Field">
                            <Option value="singlelineText">Single-line text</Option>
                            <Option value="multilineText">Multi-line text</Option>
                        </OptGroup>
                        <OptGroup label="Number">
                            <Option value="number">Number</Option>
                        </OptGroup>
                        <OptGroup label="Date & Time">
                            <Option value="date">Date picker</Option>
                            <Option value="time">Time picker</Option>
                            <Option value="datetime-local">Date & Time picker</Option>
                        </OptGroup>
                    
                        <OptGroup label="Choosing options">
                            <Option value="singleCheckbox">Single checkbox</Option>
                            <Option value="multiCheckbox">Multiple checkboxes</Option>
                            <Option value="selectDropdown">Dropdown select</Option>
                            <Option value="radioDropdown">Radio select</Option>
                        </OptGroup>
                        <OptGroup label="Other">
                            <Option value="file">File</Option>
                            <Option value="richText">Rich text</Option>
                        </OptGroup>
                    </Select>
                </Form.Item>



                {multi.includes(field?.fieldType) && 
                <Form.Item className='multiFieldSection'>
                    <div style={{width:'100%'}}>
                        <label>Sort</label>
                        <Select
                            className="custom-select"
                            suffixIcon={<span className="dropdowncaret"></span>}
                            onChange={(e)=>setSortType(e)}
                            defaultValue="custom">
                                <Option value="custom">Custom</Option>
                                <Option value="alphabetical">Alphabetical</Option>
                        </Select>
                    </div>
                    <div style={{width:'100%'}} className='drawer-custom-search'>
                        <label>Search</label>
                        <Input className="generic-input-control"  suffix={<SearchOutlined/>} onChange={(e)=>setSearchKeyword(e.target.value)} placeholder="Search" />
                    </div>
                </Form.Item>
                }
                
                {field?.fieldType &&
                    <CreateField
                        preview={false}
                        search={search}
                        sortType={sortType} 
                        fieldType={field?.fieldType} 
                        label={""} 
                    />
                }

                <div style={{width:'100%', display:'flex', justifyContent:'space-around'}}>
                    <button onClick={()=>{field?.label?.length>0 && field?.fieldType?.length>0 ? handelChanges("isExist", 1): console.warn("opertion denied")}} className={field?.label?.length>0 && field?.fieldType?.length>0 ?'drawer-outlined-btn': 'disabled-btn drawer-outlined-btn'}>Add</button>
                    <button className='drawer-filled-btn' onClick={()=>setFields(allFields?.filter((f)=>f?.id!==field?.id))}>Cancel</button>
                </div>
                </>

            : null
            }
        
        </React.Fragment>
    )
}