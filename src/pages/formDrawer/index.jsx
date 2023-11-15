import './drawer.css';
import Spinner from '../../components/spinner';
import React,{ useEffect, useState } from 'react';
import { Form, Input, Drawer, Select, TreeSelect, DatePicker, TimePicker } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClose, faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import { faCalendarAlt, faClock } from '@fortawesome/free-regular-svg-icons';
import dayjs from 'dayjs';

export const FormDrawer = ({ objectLoading, 
  objectData, 
  visible, 
  onClose, 
  refetch, //Refetch the schema object 
  loading, // loading param while create the actual data for the provided schema
  data, // data to pass param for the creation of actual process
  setData, // state define in parent to set param data
  setBtn, // set btn toggle to handel the loading req
  isBtnEnable,
  isoverlay,
  setIsOverlay, // overlay on the additional fields
  handelSubmit, // submit the actual form
  title,
 }) => {
      const navigate = useNavigate();
        
    
      const [schemaProperties, setSchemaProperties] = useState([]);
      const [mandatoryProperties, setMandatoryProperties] = useState([]);

      useEffect(()=>{
        if(!objectLoading){
          
          const preFields = objectData?.filter((object)=>object?.order == undefined) || [];
          const orderedFields = objectData?.filter((object)=>object?.order !==undefined).sort((a,b)=>a.order-b.order) || [];
          const mandatoryFields = objectData?.filter((object)=>object?.isMandatory) || [];
          setSchemaProperties([...preFields, ...orderedFields]);
          setMandatoryProperties([...mandatoryFields]);
          console.log(mandatoryFields, "mandatoryFieldsmandatoryFields");
        }
      },[objectData, visible]);

      
      useEffect(()=>{
        checkMandatoryField();
      },[data]);
    
      useEffect(()=>{
        setBtn(true);
      }, []);     
    
         

      const handelRules = (rules, e) =>{
        const {value} = e;
        

        const alphanumericRegex = /^[a-zA-Z0-9 ]+$/;
        const noNumbersRegex = /^[^\d]+$/;

        
        if(e.value==""){
          console.log(Array.from(document.getElementsByClassName("errorMsg")), "dasdlod");
          return;
        }

        if(rules?.dontAllowSpecialCharacter && !alphanumericRegex.test(value)){
          
          e.style.borderColor="red";
          e.style.boxShadow="0 0 4px 1px red, 0 0 0 1px red";
          
          Array.from(document.getElementsByClassName("errorMsg"))[0]?.remove();

          let msgSpan = document.getElementById(e.name+"scMsg");
          if(!msgSpan){
            msgSpan = document.createElement("span");
            msgSpan.id=e.name+"scMsg";
            msgSpan.classList.add("errorMsg");
            msgSpan.classList.add("text");
            msgSpan.style.color="red";

          }
          
          msgSpan.innerHTML="Special characters not allowed";
          e.insertAdjacentElement("afterend", msgSpan);
          return;
        }else{
          
          e.style.borderColor="rgba(0,208,228,.5)";
          e.style.boxShadow="0 0 4px 1px rgba(0,208,228,.3), 0 0 0 1px #00d0e4";
          let msgSpan = document.getElementById(e.name+"scMsg");
          if(msgSpan){
            msgSpan.remove();
          }
        }
                
        if(rules?.maximumCharacter && value?.length>rules?.maximumCharacter){
          Array.from(document.getElementsByClassName("errorMsg"))[0]?.remove();
    
          e.style.borderColor="red";
          e.style.boxShadow="0 0 4px 1px red, 0 0 0 1px red";
          let msgSpan = document.getElementById(e.name+"maxMsg");
          if(!msgSpan){
            msgSpan = document.createElement("span");
            msgSpan.id=e.name+"maxMsg";
            msgSpan.classList.add("errorMsg");
            msgSpan.classList.add("text");
            msgSpan.style.color="red";
          }
          msgSpan.innerHTML=`It must be ${rules?.maximumCharacter} characters long`;
          e.insertAdjacentElement("afterend", msgSpan);
          return;

        }else{
          
          e.style.borderColor="rgba(0,208,228,.5)";
          e.style.boxShadow="0 0 4px 1px rgba(0,208,228,.3), 0 0 0 1px #00d0e4";
          let msgSpan = document.getElementById(e.name+"maxMsg");
          if(msgSpan){
            msgSpan.remove();
          }
        }

        if(rules?.minimumCharacter && value?.length<rules?.minimumCharacter){
          Array.from(document.getElementsByClassName("errorMsg"))[0]?.remove();
    
          e.style.borderColor="red";
          e.style.boxShadow="0 0 4px 1px red, 0 0 0 1px red";
          let msgSpan = document.getElementById(e.name+"miniMsg");
          if(!msgSpan){
            msgSpan = document.createElement("span");
            msgSpan.id=e.name+"miniMsg";
            msgSpan.classList.add("errorMsg");
            msgSpan.classList.add("text");
            msgSpan.style.color="red";
          }
          msgSpan.innerHTML=`It should be minimum ${rules?.minimumCharacter} characters long`;
          e.insertAdjacentElement("afterend", msgSpan);
          return;

        }else{
          
          e.style.borderColor="rgba(0,208,228,.5)";
          e.style.boxShadow="0 0 4px 1px rgba(0,208,228,.3), 0 0 0 1px #00d0e4";
          let msgSpan = document.getElementById(e.name+"miniMsg");
          if(msgSpan){
            msgSpan.remove();
          }
        }

        if(rules?.restrictToNumericValue && !noNumbersRegex.test(value)){
          
          e.style.borderColor="red";
          e.style.boxShadow="0 0 4px 1px red, 0 0 0 1px red";
          Array.from(document.getElementsByClassName("errorMsg"))[0]?.remove();
          let msgSpan = document.getElementById(e.name+"numMsg");
          if(!msgSpan){
            msgSpan = document.createElement("span");
            msgSpan.id=e.name+"numMsg";
            msgSpan.classList.add("errorMsg");
            msgSpan.classList.add("text");
            msgSpan.style.color="red";

          }
          msgSpan.innerHTML=`Numbers are not allowed`;
          e.insertAdjacentElement("afterend", msgSpan);
          return;

        }
        else{
          
          e.style.borderColor="rgba(0,208,228,.5)";
          e.style.boxShadow="0 0 4px 1px rgba(0,208,228,.3), 0 0 0 1px #00d0e4";
          let msgSpan = document.getElementById(e.name+"numMsg");
          if(msgSpan){
            msgSpan.remove();
          }
        }

        if(rules?.passwordMandatoryCharacter && !value.includes(rules?.passwordMandatoryCharacter)){
          
          e.style.borderColor="red";
          e.style.boxShadow="0 0 4px 1px red, 0 0 0 1px red";
          Array.from(document.getElementsByClassName("errorMsg"))[0]?.remove();
          let msgSpan = document.getElementById(e.name+"passwordMsg");
          if(!msgSpan){
            msgSpan = document.createElement("span");
            msgSpan.id=e.name+"passwordMsg";
            msgSpan.classList.add("errorMsg");
            msgSpan.classList.add("text");
            msgSpan.style.color="red";

          }
          msgSpan.innerHTML=`Password should contain ${rules?.passwordMandatoryCharacter}`;
          e.insertAdjacentElement("afterend", msgSpan);
          return;

        }
        else{
          
          e.style.borderColor="rgba(0,208,228,.5)";
          e.style.boxShadow="0 0 4px 1px rgba(0,208,228,.3), 0 0 0 1px #00d0e4";
          let msgSpan = document.getElementById(e.name+"passwordMsg");
          if(msgSpan){
            msgSpan.remove();
          }
        }

        
        if(rules?.allowEmailDomain && !rules?.emailDomain.includes(("@"+value.split("@")[1]))){
          
          e.style.borderColor="red";
          e.style.boxShadow="0 0 4px 1px red, 0 0 0 1px red";
          Array.from(document.getElementsByClassName("errorMsg"))[0]?.remove();
          let msgSpan = document.getElementById(e.name+"emailMsg");
          if(!msgSpan){
            msgSpan = document.createElement("span");
            msgSpan.id=e.name+"emailMsg";
            msgSpan.classList.add("errorMsg");
            msgSpan.classList.add("text");
            msgSpan.style.color="red";

          }
          msgSpan.innerHTML=`Email must be from these domains (${rules?.emailDomain.join(" ")})`;
          e.insertAdjacentElement("afterend", msgSpan);
          return;

        }
        else{
          
          e.style.borderColor="rgba(0,208,228,.5)";
          e.style.boxShadow="0 0 4px 1px rgba(0,208,228,.3), 0 0 0 1px #00d0e4";
          let msgSpan = document.getElementById(e.name+"emailMsg");
          if(msgSpan){
            msgSpan.remove();
          }
        }
        
        
        

      }


      const handelDataValue=(e)=>{
        console.log(e)
        const isExist = data?.find((d)=>Object.keys(d)[0]==e.name);
        
          setData(isExist? data?.map((d)=>{
            if(Object.keys(d)[0]==e.name){
              return {
                [e.name]: e.value,
              }
            }else{
              return d;
            }
          }): [...data, {[e.name]: e.value}]);
      }

      const handelChange=(e, propertyDetail)=>{
        handelRules(propertyDetail?.rules, e);
        handelDataValue(e);       

        const checkMandatory = mandatoryProperties?.length>0 ? mandatoryProperties[0]?.propertyDetail?.label.toLowerCase().replaceAll(" ","") : "";
        console.log(checkMandatory, "check mandatory");
        
        if(e.value.length>0){
            if(e.name==checkMandatory){
                setIsOverlay(false);
            }
        }else{
            if(e.name==checkMandatory){
                setIsOverlay(true);
                
              }
              Array.from(document.getElementsByClassName("errorMsg")).map((ele)=>ele.remove());
              e.style.borderColor="rgba(0,208,228,.5)";
              e.style.boxShadow="0 0 4px 1px rgba(0,208,228,.3), 0 0 0 1px #00d0e4";
        }

        checkMandatoryField();
      }

      const onBlurDesign = (e) =>{
        e.style.borderColor="#cbd6e2";
        e.style.boxShadow="none";
      }

      const onFocusDesign = (e)=>{
        e.style.borderColor="rgba(0,208,228,.5)";
        e.style.boxShadow="0 0 4px 1px rgba(0,208,228,.3), 0 0 0 1px #00d0e4";
      }
    
      const disabledMondayToFridayDate = (current) => {
        // Disable all dates that are Saturday (day number 6) or Sunday (day number 0)
        return current && (current.day() === 6 || current.day() === 0);
      }
    
      const customDate = (current, weekday, customDate) => {
        if(weekday){
          if (current && current < dayjs(customDate[0])) {
            return true;
          }
        
          // Disable all dates after the custom end date
          if (current && current > dayjs(customDate[1]).add(1, 'day')) {
            return true;
          }

          return current && (current.day() === 6 || current.day() === 0);
        }else{
          if (current && current < dayjs(customDate[0])) {
            return true;
          }
        
          // Disable all dates after the custom end date
          if (current && current > dayjs(customDate[1]).add(1, 'day')) {
            return true;
          }
        
          // Enable all other dates within the custom range
          return false;
        }
      }

      const futureDate = (current, weekday) => {
        if(weekday){

          if (current && current < dayjs().subtract(1, 'day')) {
            return true;
          }
          
          // Disable weekends (Saturday and Sunday)
          const dayOfWeek = current && current.day();
          return dayOfWeek === 0 || dayOfWeek === 6;
        }else{
          return current && current < dayjs().subtract(1, 'day');
        }
      }

      const pastDate = (current, weekday) => {
        
        if(weekday){

          if (current && current > dayjs().subtract(1,'day')) {
            return true;
          }
          
          // Disable weekends (Saturday and Sunday)
          const dayOfWeek = current && current.day();
          return dayOfWeek === 0 || dayOfWeek === 6;
        }else{
          return current && current > dayjs().subtract(1,'day');
        }
      }

      const bufferTime = (current, bufferTime, weekday) => {
        if(weekday){

          if (current && current < dayjs().add(bufferTime, 'day')) {
            return true;
          }
          
          // Disable weekends (Saturday and Sunday)
          const dayOfWeek = current && current.day();
          return dayOfWeek === 0 || dayOfWeek === 6;
        }else{
          return current && current < dayjs().add(bufferTime, 'day')
        }
          
      }

      
      const rollingDate = (current, rolling, weekday) => {
        if(weekday){

          if (current && current < new Date()) {
            return true;
          }
        
          // Allow dates between the next 12 future days (excluding weekends)
          const today = new Date();
          const twelveDaysFromNow = new Date(today);
          twelveDaysFromNow.setDate(today.getDate() + rolling);
        
          return current && (current > twelveDaysFromNow || current.day() === 0 || current.day() === 6);
        
        }else{
          if (current && current < new Date()) {
            return true;
          }
        
          // Allow dates between the next 12 future days (excluding weekends)
          const today = new Date();
          const twelveDaysFromNow = new Date(today);
          twelveDaysFromNow.setDate(today.getDate() + rolling);
        
          return current && (current > twelveDaysFromNow)
        }
          
      }


      const handelDateRule = (rules, date) =>{
        if(rules?.dateType=="futureDate"){
          if(rules?.futureDateType=="anyFutureDate"){
            return futureDate(date, rules?.mondayFriday);
          }
          if(rules?.futureDateType=="bufferTime"){
            return bufferTime(date, rules?.bufferTime||1, rules?.mondayFriday)
          }
          if(rules?.futureDateType=="rollingDate"){
            return rollingDate(date, rules?.rollingDate||14, rules?.mondayFriday)
          }
        }
        if(rules?.dateType=="pastDate"){
          return pastDate(date, rules?.mondayFriday)
        }
        if(rules?.dateType=="customDate"){
          return customDate(date, rules?.mondayFriday, rules?.customDate);
        }
        if(rules?.dateType=="anyDate" && rules?.mondayFriday){
          return disabledMondayToFridayDate(date);
        }
        if(!rules?.dateType && rules?.mondayFriday){
          return disabledMondayToFridayDate(date);
        }
      }

      const checkMandatoryField = ()=>{
        const isMandatoryFieldFilled = mandatoryProperties?.every((field)=>data?.find(d=>Object.keys(d)[0]==field?.propertyDetail?.label.replaceAll(" ","").toLowerCase()));
        const isErrorExist = Array.from(document.getElementsByClassName("errorMsg"));
        // console.log(isErrorExist);
        if(isMandatoryFieldFilled && isErrorExist?.length==0){
          // console.log("pass");
          setBtn(false);
        }else{
          setBtn(true);
          // checkMandatoryField();
        }
      }

      const close = ()=>{
        onClose(); setData([]);
        setIsOverlay(true);
      };

      const {Option} = Select;
      return (
        <div>
          <Drawer
            title={"Add " + title}
            placement="right"
            closable={true}
            onClose={onClose}
            closeIcon={<FontAwesomeIcon icon={faClose} onClick={()=>{close();setTimeout(()=>setSchemaProperties([]),100)}} className='close-icon'/>}
            visible={visible}
            width={600}
            
            maskClosable={false}
            mask={true}
            footer={
              <div className='drawer-footer'>
                  <button disabled={isBtnEnable || loading} className={isBtnEnable || loading ? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} onClick={()=>handelSubmit(true)}>
                   {loading? <Spinner color={"#ff7a53"}/> : 'Create'} 
                  </button>
                  <button  onClick={()=>handelSubmit(false)} disabled={isBtnEnable || loading} className={isBtnEnable || loading ? 'disabled-btn drawer-outlined-btn' : 'drawer-outlined-btn'} >
                    {loading? <Spinner color={"#ff7a53"}/> : 'Create and add another'} 
                  </button>
                  <button disabled={loading} className='drawer-outlined-btn' onClick={()=>{close();setTimeout(()=>setSchemaProperties([]),100)}}>Cancel</button>
              </div>
            }
          >
            <div className='title' 
                style={objectLoading?{opacity:0.4}:{opacity:1}}
                onClick={()=>navigate('/branch/editform',{
                    state: {
                    title: 'Branch',
                    url:'/user/branch',
                    }
                })}
            ><FontAwesomeIcon icon={faExternalLink} style={{ marginLeft: 4 }} /> Edit this form </div>
          
            <form id="branchForm" className='form'>
                <div className={isoverlay? 'overlay' : 'overlay hidden'}>
                    <div className='overlay-text'>Start by entering the {title}'s name</div>
                </div>
                {schemaProperties?.map((property)=>{
                  const name = property?.propertyDetail?.label.replaceAll(" ","").toLowerCase();
                  const localValue = data?.find((d)=>Object.keys(d)[0] == name);
                  const value = localValue && localValue[name];

                  return(
                    
                    property?.propertyDetail?.fieldType==="singlelineText" || property?.propertyDetail?.fieldType==="password" || property?.propertyDetail?.fieldType==="email" ?
                    
                    <Form.Item>
                      <label>{property?.propertyDetail?.label} <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
                      <Input 
                        className='generic-input-control' 
                        onBlur={(e)=>onBlurDesign(e.target)} 
                        onFocus={(e)=>onFocusDesign(e.target)}
                        value={value}
                        onChange={(e)=>{checkMandatoryField(); handelChange(e.target, property?.propertyDetail);}} 
                        type={property?.propertyDetail?.fieldType==="password"? "password" : "text"}
                        name={name} 
                        id={name} 
                      />
                    </Form.Item>  
                    
                    : property?.propertyDetail?.fieldType==="multilineText"?

                    <Form.Item>
                    <label>{property?.propertyDetail?.label} <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
                    <Input.TextArea rows={4} 
                      className='generic-input-control' 
                      onBlur={(e)=>onBlurDesign(e.target)} 
                      onFocus={(e)=>onFocusDesign(e.target)}
                      value={value}
                      onChange={(e)=>{checkMandatoryField();handelChange(e.target, property?.propertyDetail);}} 
                      name={name} 
                      id={name} 
                      />
                    </Form.Item>  

                    : property?.propertyDetail?.fieldType=="singleCheckbox" ?
                    
                    <Form.Item>
                      <label>{property?.propertyDetail?.label} <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
                      <Select
                        name={name}
                        id={name}
                        value={value}
                        onChange={(e)=>{handelDataValue({
                          name: property?.propertyDetail?.label.replaceAll(" ","").toLowerCase(),
                          value: e
                        });checkMandatoryField()}}
                      >
                          <Option value="yes">Yes</Option>
                          <Option value="no">No</Option>
                      </Select>
                    </Form.Item>
                    
                    : property?.propertyDetail?.fieldType == 'selectDropdown' || property?.propertyDetail?.fieldType == 'radioDropdown' ?
                    
                    <Form.Item>
                        <label>{property?.propertyDetail?.label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup> </label>
                            <Select 
                              className='custom-select'  
                              suffixIcon={<span className='dropdowncaret'></span>}
                              name={name}
                              id={name}
                              value={value}

                              onChange={(e)=>{handelDataValue({
                                name,
                                value: e
                              });checkMandatoryField()}}

                            >
                                {property?.propertyDetail?.options?.map((option)=>(<Option value={option.value}> {option.key} </Option>))}
                            </Select>
                    </Form.Item>  
                    
                    : property?.propertyDetail?.fieldType == 'multiCheckbox' ?
                    <Form.Item>
                        <label>{property?.propertyDetail?.label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup> </label>
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
                          });checkMandatoryField()}}
                      >
                          {property?.propertyDetail?.options?.map((option)=>(
                              option?.value?.length > 0 && option?.showFormIn && <TreeSelect.TreeNode value={option.value} title={option.key}/>
                          ))}
                      </TreeSelect>
                  
                    </Form.Item>  
                    : property?.propertyDetail?.fieldType == 'date' || property?.propertyDetail?.fieldType == 'datetime-local'?
                    <Form.Item>
                      <label>{property?.propertyDetail?.label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
                      <DatePicker
                        showTime={property?.propertyDetail?.fieldType == "datetime-local"}
                        name={name}
                        value={value && dayjs(value)}
                        id={name}
                        onChange={(e, dateString)=>{handelDataValue({
                          name,
                          value: dateString
                      });checkMandatoryField()}}

                        className='generic-input-control'
                        disabledDate={
                          (current)=>handelDateRule(property?.propertyDetail?.rules, current)
                        }
                        suffixIcon={<FontAwesomeIcon style={{color:'rgb(0, 145, 174) !important'}} icon={faCalendarAlt} />}
                      />
                    </Form.Item>
                    : property?.propertyDetail?.fieldType == 'time' ?
                    <Form.Item>
                      <label>{property?.propertyDetail?.label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
                      <TimePicker
                        id={name}
                        className='generic-input-control'
                        value={value}
                        onChange={(e)=>{handelDataValue(e.target);checkMandatoryField()}}
                        suffixIcon={<FontAwesomeIcon style={{color:'rgb(0, 145, 174) !important'}} icon={faClock} />}
                      />
                    </Form.Item>
                    :
                    <Form.Item>
                        <label>{property?.propertyDetail?.label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
                        <Input 
                          id={name}
                          name={name} 
                          value={value}
                          onChange={(e)=>{handelDataValue(e.target);checkMandatoryField()}}
                          type={property?.propertyDetail?.fieldType} className='generic-input-control'
                        /> 
                        
                    </Form.Item>
                  
                  )
                })}
            </form>
            
        </Drawer>
        </div>
      );
      
}