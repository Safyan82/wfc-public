import React, {useEffect, useState} from 'react';
import { Form, Input, Select, Typography } from 'antd';
import { CreateField } from './dynamicField';
import {
    SearchOutlined,
  } from '@ant-design/icons';
import { resetRules, setGlobalFieldType } from '../../middleware/redux/reducers/createField.reducer';
import { useDispatch } from 'react-redux';
import { setBtnState } from '../../middleware/redux/reducers/editProperty.reducer';


const multi=[
    'multiCheckbox',
    'selectDropdown',
    'radioDropdown',
];

export const FieldType = ({basicInfo, setWidth, fieldType, setFieldType})=>{
    const {Option, OptGroup} = Select;
    const [sortType, setSortType] = useState('custom');
    const [search, setSearchKeyword] = useState(null);
    const [fieldTypeFocused, setFieldTypeFocused] = useState(false);

    useEffect(()=>{
        sessionStorage.setItem('fieldType', fieldType);
        if(multi.includes(fieldType)){
            setWidth(true);
        }else{
            setWidth(false);
        }
    },[fieldType]);
    
    useEffect(()=>{
        return()=>{
          document.getElementById("nextBtn")?.classList?.remove("disabled-btn");
        }
      },[]);

    const dispatch = useDispatch();

    return(
        <React.Fragment>
            <Form.Item>
                <label>Field type</label>
                <Select 
                    className={multi.includes(fieldType) ? "custom-select step2" : "custom-select"}
                    suffixIcon={<span className="dropdowncaret"></span>}
                    onChange={(e)=>{
                        setFieldType(e);
                        dispatch(setBtnState(false));
                        if(fieldTypeFocused){

                            dispatch(setGlobalFieldType(e));
                            dispatch(resetRules());
                        }
                    }}
                    placeholder="Select field type"
                    style={{marginBottom:'26px'}}
                    value={fieldType}
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

            {multi.includes(fieldType) && 
            <Form.Item className='multiFieldSection'>
                <div style={{width:'100%'}}>
                    <label>Sort</label>
                    <Select
                        className="custom-select"
                        suffixIcon={<span className="dropdowncaret"></span>}
                        onChange={(e)=>{dispatch(setBtnState(false)) ;setSortType(e)}}
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
            
            {fieldType &&
                <CreateField
                    search={search}
                    sortType={sortType} 
                    fieldType={fieldType} 
                    label={basicInfo?.label} 
                />
            }
        
        </React.Fragment>
    )
}