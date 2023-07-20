import React, { useEffect, useState } from "react";
import { Form, Input, Popover, Select, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { LoadingOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import { GROUPLIST } from "../../util/query/group.query";
import Spinner from "../spinner";

export const BasicInfo = ({basicInfo, setBasicInfo, setWidth,}) =>{
    
    const [isGroupFocused, setisGroupFocused] = useState(null);
    const { loading:groupLoading, error:groupError, data:groupList , refetch:groupRefetch } = useQuery(GROUPLIST,{
        fetchPolicy: 'network-only',
        skip: !isGroupFocused
    });

    useEffect(()=>{
        if(basicInfo?.groupId){
            setisGroupFocused(true);
        }
    },[basicInfo?.groupId]);
    

    return(
        <React.Fragment>

            <Form.Item>
                <label>Object type <sup>*</sup></label>
                <Select 
                    className="custom-select"
                    onChange={(e)=>setBasicInfo({...basicInfo, objectType:e})}
                    value={basicInfo?.objectType}
                    placeholder="Select a object"
                    // defaultValue={"branches"}
                    suffixIcon={<span className="dropdowncaret"></span>}
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
                    labelInValue
                    placeholder="Select a group"
                    onFocus={()=>setisGroupFocused(true)}
                    onChange={(e)=>{
                        if(!groupLoading){

                            setBasicInfo({...basicInfo, groupId:e.value, groupName: e.label});
                        }
                        
                    }}
                    value={groupLoading ? null : basicInfo?.groupId}
                    suffixIcon={groupLoading ? <Spin indicator={<LoadingOutlined />} />: <span className="dropdowncaret"></span>}
                >
                    {!groupLoading ? groupList?.groupList?.map((group, index)=>(
                        <Select.Option value={group.key} key={index}>{group.name}</Select.Option>
                    )):
                        <Select.Option hidden disabled>Loading ...</Select.Option>
                    }
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