import "dayjs/locale/en-gb";
import dayjs from "dayjs";
import { faCalendarAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image, DatePicker, Form, Input, Select, TimePicker, TreeSelect } from "antd";
import { getCustomerQuery } from '@src/util/query/customer.query';
import { useQuery } from "@apollo/client";
import { GET_BRANCHES } from "@src/util/query/branch.query";
import { useEffect, useState } from "react";

// import weekday from '@dayjs/plugin/weekday';

dayjs.locale('en-gb');

// value and image base is just in use to edit employee personal skill
export const GenerateFields = ({label, name, fieldType, handelDataValue, property, value="", imgbas64=""})=>{
        
        const {Option} = Select;

        console.log(fieldType, "fielddd", label)
        const {data: customerData, loading: customerLoading} = useQuery(getCustomerQuery,{
          variables: {
              input: {
                  filters: null
              }
          },
          fetchPolicy:'network-only'
        });
        
        const { data: branchData, } = useQuery(GET_BRANCHES ,{
          fetchPolicy: 'cache-and-network',
          variables: {
              input: {
                  filters: null
              }
          }
        });
        
        const [localGroup, setLocalGroup] = useState(branchData?.branches||[]);
        useEffect(()=>{
          if(branchData?.branches){
            setLocalGroup(branchData?.branches)
          }
        }, [branchData?.branches]);

        return(
          
          fieldType==="singlelineText" || fieldType==="password" || fieldType==="email" ?
          
          <div className="fieldView">
            <label>{label} <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
            
            <Input 
              className='auto-input-control'
              value={value}
              onChange={(e)=>{ handelDataValue(e.target,label);}} 
              type={fieldType==="password"? "password" : "text"}
              name={name} 
              id={name} 
            />
          </div>  
          
          : fieldType==="multilineText"?

          <div className="fieldView">
          <label>{label} <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
          <Input.TextArea rows={1} 
            className='auto-input-control' 
            style={{maxWidth:'80%'}}
            value={value}
            onChange={(e)=>{handelDataValue(e.target);}} 
            name={name} 
            id={name} 
            />
          </div>  

          : fieldType=="singleCheckbox" ?
          
          <Form.Item>
            <label>{label} <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
            <Select
              
              name={name}
              id={name}
              value={value}
              onChange={(e)=>{
                handelDataValue({
                    name: label.replaceAll(" ","").toLowerCase(),
                    value: e
                    },label);
                }}
            >
                <Option value="yes">Yes</Option>
                <Option value="no">No</Option>
            </Select>
          </Form.Item>
          
          : fieldType == 'selectDropdown' || fieldType == 'radioDropdown' ?
            name=="branch"?
            <div className="fieldView">
                <label>{'Branch'} <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup> </label>
                <div className="auto-custom-select">
                  <Select
                      
                      name={name}
                      id={name}
                      placeholder="Select Branch"
                      value={value}
                      style={{width:'100%'}}
                      suffixIcon={<span  className='dropdowncaret'></span>}
                      
                      onChange={(e)=>{handelDataValue({
                          name,
                          value: e
                      });}}
                  >
                      {
                      localGroup?.length && localGroup?.map((gl)=>(
                          <Option value={gl._id} label={gl.branchname}>{gl.branchname}</Option>
                      ))
                      }
                  </Select>
                </div>

            </div>
            :
            name=="customer"?
              
              <div className="fieldView">
                <label>{label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup> </label>
                <div className="auto-custom-select">
                  
                  <Select  
                    suffixIcon={<span className='dropdowncaret'></span>}
                    name={name}
                    id={name}
                    value={value}
                    style={{width:'100%'}}
                    placeholder="Select Customer"
                    onChange={(e)=>{handelDataValue({
                      name,
                      value: e
                    });}}

                  >
                      {customerData?.customers?.map((option)=>(<Option value={option._id} label={option?.customername}> {option?.customername} </Option>))}
                  </Select>

                </div>
              </div> 
            :

            <Form.Item>
                <label>{label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup> </label>
                    <Select 
                      // showSearch
                      className='custom-select'  
                      suffixIcon={<span className='dropdowncaret'></span>}
                      name={name}
                      id={name}
                      value={value}

                      onChange={(e)=>{handelDataValue({
                        name,
                        value: e
                      },label);}}

                    >
                        {property?.options?.map((option)=>(<Option value={option.value}> {option.key} </Option>))}
                    </Select>
            </Form.Item>  
          
          : fieldType == 'multiCheckbox' ?
          <Form.Item>
              <label>{label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup> </label>
            <TreeSelect 
                multiple
                treeCheckable
                className='custom-select'   
                name={name}
                id={name}
                value={value}

                suffixIcon={<span className='dropdowncaret'></span>}
                onChange={(e)=>{handelDataValue({
                  name,
                  value:e
                },label);}}
            >
                {property?.options?.map((option)=>(
                    option?.value?.length > 0 && option?.showFormIn && <TreeSelect.TreeNode value={option.value} title={option.key}/>
                ))}
            </TreeSelect>
        
          </Form.Item>  
          : fieldType == 'date' || fieldType == 'datetime-local'?
          <Form.Item>
            <label>{label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
            {/* <ConfigProvider locale={locale}> */}
              <DatePicker
                showTime={fieldType == "datetime-local"}
                name={name}
                value={value && dayjs(value)}
                id={name}
                onChange={(e, dateString)=>{handelDataValue({
                  name,
                  value: dateString
              },label);}}

                className='generic-input-control'
              //   disabledDate={
              //     (current)=>handelDateRule(property?.propertyDetail?.rules, current)
              //   }
                suffixIcon={<FontAwesomeIcon style={{color:'rgb(0, 145, 174) !important'}} icon={faCalendarAlt} />}
              />
            {/* </ConfigProvider> */}
          </Form.Item>
          : fieldType == 'time' ?
          <Form.Item>
            <label>{label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
            <TimePicker
              id={name}
              className='generic-input-control'
              value={value}
              onChange={(e)=>{handelDataValue(e.target,label);}}
              suffixIcon={<FontAwesomeIcon style={{color:'rgb(0, 145, 174) !important'}} icon={faClock} />}
            />
          </Form.Item>
          :
          fieldType=="file"?
          <Form.Item>
              <label>{label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>

              {<Image style={imgbas64?.name || imgbas64==""?{display:'none'}:{}} src={imgbas64} width={50} height={30} />}
              
              <Input 
                id={name}
                name={name} 
                // value={typeof(imgbas64)==="string"?"":value}
                onChange={(e)=>{handelDataValue(e.target,label,fieldType);}}
                type={fieldType} className='generic-input-control'
              /> 
              
              
          </Form.Item>
          :
          <Form.Item>
              <label>{label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
              <Input 
                id={name}
                name={name} 
                value={value}
                onChange={(e)=>{handelDataValue(e.target,label,fieldType);}}
                type={fieldType} className='generic-input-control'
              /> 
              
          </Form.Item>
        
        )
}