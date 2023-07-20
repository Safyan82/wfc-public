import React, { useEffect } from "react";
import { Form, Input, Popover, Select, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { LoadingOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setBtnState } from "../../middleware/redux/reducers/editProperty.reducer";

export const BasicInfo = ({basicInfo, setBasicInfo, setWidth, groupList, groupLoading}) =>{
    useEffect(()=>{setWidth(false)},[]);
    const dispatch = useDispatch();

    return(
        <React.Fragment>

            <div className="editProperty-info-box">
                <div className="head">0 <span className="microText">&nbsp; (out of 5)</span></div>
                <span className="text">Number of branches with a value for this property</span>
            </div>
            
            <Form.Item style={{marginBottom:'16px'}}>
                <label>Group <sup>*</sup></label>
                <Select 
                    className="custom-select"
                    labelInValue
                    onChange={(e)=>{dispatch(setBtnState(false)) ;setBasicInfo({...basicInfo, groupId:e.value, groupName: e.label})}}
                    value={basicInfo?.groupId}
                    disabled={groupLoading}
                    suffixIcon={groupLoading ? <Spin indicator={<LoadingOutlined />} />: <span className="dropdowncaret"></span>}
                >
                    {!groupLoading && groupList?.groupList?.map((group, index)=>(
                        <Select.Option value={group.key} key={index}>{group.name}</Select.Option>
                    ))}
                </Select>
            </Form.Item>


            <Form.Item>
                <label>Description</label>
                <Input className="generic-input-control" 
                  value={basicInfo?.description}
                  onChange={(e)=>{dispatch(setBtnState(false)); setBasicInfo({...basicInfo, description:e.target.value})}} 
                />

            </Form.Item>
        </React.Fragment>
    );
}