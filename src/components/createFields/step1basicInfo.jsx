import React from "react";
import { Form, Input, Popover, Select } from "antd";
import { SelectDropdown } from "../select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";

export const BasicInfo = ({basicInfo, setBasicInfo}) =>{
    return(
        <React.Fragment>

            <Form.Item>
                <label>Object type <sup>*</sup></label>
                <Select 
                    className="custom-select"
                    suffixIcon={<span className="dropdowncaret"></span>}
                    onChange={(e)=>setBasicInfo({...basicInfo, objectType:e})}
                    value={basicInfo?.objectType}
                >
                    <Select.Option value="branches">Branches</Select.Option>
                    <Select.Option value="sites">Sites</Select.Option>
                    <Select.Option value="customers">Customer</Select.Option>
                </Select>
            </Form.Item>

            
            <Form.Item>
                <label>Group <sup>*</sup></label>
                <Select 
                    className="custom-select"
                    suffixIcon={<span className="dropdowncaret"></span>}
                    onChange={(e)=>setBasicInfo({...basicInfo, group:e})}
                    value={basicInfo?.group}
                >
                    <Select.Option value="other">Other</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <label>Label <sup>*</sup></label>
                <div style={{display:'flex', columnGap:'16px'}}>
                    <Input className="generic-input-control"  
                    value={basicInfo?.label}
                    onChange={(e)=>setBasicInfo({...basicInfo, label:e.target.value})} />
                    <Popover 
                          overlayClassName="custom-popover"
                          content={<div>If you are using this property <br/> for an integration, you can <br/> access its internal name here.</div>} 
                          placement='left'
                        >
                        <FontAwesomeIcon icon={faCode}
                            style={{    
                                marginTop: '13px',
                                fontSize: '20px',
                                color: '#0091ae',
                                cursor: 'pointer',
                            }}
                        />
                    </Popover>
                </div>
            </Form.Item>

            <Form.Item>
                <label>Description</label>
                <Input className="generic-input-control" 
                  value={basicInfo?.description}
                  onChange={(e)=>setBasicInfo({...basicInfo, description:e.target.value})} 
                />

            </Form.Item>
        </React.Fragment>
    );
}