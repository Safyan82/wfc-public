import React, {useEffect, useState} from 'react';
import { Form, Input, Select, Typography } from 'antd';
import { CreateField } from './dynamicField';
import CheckboxTable from './table';


const multi=[
    'singleCheckbox',
    'multiCheckbox',
    'selectDropdown',
    'radioDropdown',
];

export const FieldType = ({basicInfo})=>{
    const {Option, OptGroup} = Select;
    console.log(basicInfo, "basicInfo");
    const [fieldType, setFieldType] = useState(null);

    return(
        <React.Fragment>
            <Typography className='label'>
                <Typography.Title level={4}>{basicInfo?.label}</Typography.Title>
            </Typography>
            <Form.Item>
                <label>Field type</label>
                <Select 
                    className="custom-select"
                    suffixIcon={<span className="dropdowncaret"></span>}
                    onChange={(e)=>setFieldType(e)}
                    placeholder="Select field type"
                    style={{marginBottom:'26px'}}
                >
                    <OptGroup label="Meta Field">
                        <Option value="email">Email</Option>
                        <Option value="password">Password</Option>
                        <Option value="date">Date picker</Option>
                        <Option value="time">Time picker</Option>
                        <Option value="datetime-local">Date & Time picker</Option>
                        {/* <Option value="phone">Phone</Option> */}
                    </OptGroup>
                    <OptGroup label="Text Field">
                        <Option value="singlelineText">Single-line text</Option>
                        <Option value="multilineText">Multi-line text</Option>
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
                        onChange={(e)=>setFieldType(e)}
                        value="custom">
                            <Option value="custom" selected>Custom</Option>
                            <Option value="alphabetical">Alphabetical</Option>
                    </Select>
                </div>
                <div style={{width:'100%'}}>
                    <label>Search</label>
                    <Input className="generic-input-control" placeholder="Search" />
                </div>
            </Form.Item>
            }
            
            {fieldType &&
                <CreateField fieldType={fieldType} label={basicInfo?.label} />
            }
        
        </React.Fragment>
    )
}