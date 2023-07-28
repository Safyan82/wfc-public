import React,{ useEffect, useState } from 'react';
import { Form, Input, Drawer, Button, notification, Spin, Select, TreeSelect, DatePicker, TimePicker } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClose, faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_BRACNH } from '../../util/mutation/branch.mutation';

import './drawer.css';
import Spinner from '../../components/spinner';
import { GetBranchObject } from '../../util/query/branch.query';
import { useDispatch } from 'react-redux';
import { setBranchSchema } from '../../middleware/redux/reducers/branch.reducer';
import { setNotification } from '../../middleware/redux/reducers/notification.reducer';
import { faCalendarAlt, faClock } from '@fortawesome/free-regular-svg-icons';
import dayjs from 'dayjs';

export const FormDrawer = ({ branchObjectLoading, branchObjectData, visible, onClose, refetch }) => {
    const [drawerVisible, setDrawerVisible] = useState(false);
      const navigate = useNavigate();
      
      const branchOrder = JSON.parse(localStorage.getItem("branchOrder"));
      const [createBranch, { loading, error }] = useMutation(CREATE_BRACNH);
      const [api, contextHolder] = notification.useNotification();
      const [isoverlay, setIsOverlay] = useState(true);

      
  
    
      const [branchProperties, setBranchProperties] = useState([]);

      const dispatch = useDispatch();

      useEffect(()=>{
        setBranchProperties(branchObjectData?.getBranchProperty?.response);
      },[branchObjectData]);
    
    
      const handelSubmit=async ()=>{
        const branchForm = document.getElementById("branchForm");
        const inputs = (branchForm.querySelectorAll("input"));
        let i = [];
        inputs.forEach((input)=>{
          i.push(input);
          if(input.value.length<2 && input.name=="BranchName" || input.name=="postCode"){
            input.style.borderColor="red";
            input.style.boxShadow="0 0 4px 1px red, 0 0 0 1px red";
            return
          }else{
            
            input.style.borderColor="#cbd6e2";
            input.style.boxShadow="none";
            return
          }
        });
    
        const isValidatedata = i?.some((input) => input.value.length>1)
        if(isValidatedata){
          const rawData = i?.map((d)=>({[d.name]:d.value}));
          let data = {};
          for(let i=2;i<rawData.length;i++){
            Object.assign(data,rawData[i]);
          }
    
          const branch = {
            ...rawData[0],
            ...rawData[1],
            metadata:data,
          }
          // handel mutation
          await branchMutation(branch)
        }
    
      }
    
      const branchMutation=async (branch)=>{
        try{
          const {message} = await createBranch({variables: {input: branch}});
          dispatch(setNotification({
            notificationState:true, 
            message: "Branch was added successfully",
            error: false,
          }))
          onClose();
          await refetch();
          
    
        }
        catch(err){
          const openNotification = (description) => {
            api.warning({
              message: error,
              description,
              placement:"topCenter",
            });
          };
          openNotification(err);
        }
      }
    
      const [isBtnEnable, setBtn] = useState(true);

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

      const handelChange=(e, propertyDetail)=>{
        handelRules(propertyDetail?.rules, e);
        if(e.value.length>0){
            if(e.name=="branchname"){
                setIsOverlay(false);
            }
        }else{
            if(e.name=="branchname"){
                setIsOverlay(true);
                
              }
              Array.from(document.getElementsByClassName("errorMsg")).map((ele)=>ele.remove());
              e.style.borderColor="rgba(0,208,228,.5)";
              e.style.boxShadow="0 0 4px 1px rgba(0,208,228,.3), 0 0 0 1px #00d0e4";
        }
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

      const {Option} = Select;
      return (
        <div>
          <Drawer
            title="Create Branch "
            placement="right"
            closable={true}
            onClose={onClose}
            closeIcon={<FontAwesomeIcon icon={faClose} onClick={onClose} className='close-icon'/>}
            visible={visible}
            width={600}
            
            maskClosable={false}
            mask={true}
            footer={
              <div className='drawer-footer'>
                  <button disabled={isBtnEnable || loading} className={isBtnEnable || loading ? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} onClick={handelSubmit}>
                   {loading? <Spinner color={"#ff7a53"}/> : 'Create'} 
                  </button>
                  <button disabled={isBtnEnable || loading} className={isBtnEnable || loading ? 'disabled-btn drawer-outlined-btn' : 'drawer-outlined-btn'} >
                    Create and add another
                  </button>
                  <button disabled={loading} className='drawer-outlined-btn' onClick={onClose}>Cancel</button>
              </div>
            }
          >
            <div className='title' 
                style={branchObjectLoading?{opacity:0.4}:{opacity:1}}
                onClick={()=>navigate('/editform',{
                    state: {
                    title: 'Branch',
                    url:'/user/branch',
                    }
                })}
            ><FontAwesomeIcon icon={faExternalLink} style={{ marginLeft: 4 }} /> Edit this form </div>
          
            <form id="branchForm" className='form' >
                <div className={isoverlay? 'overlay' : 'overlay hidden'}>
                    <div className='overlay-text'>Start by entering the Branch's name</div>
                </div>
                {branchProperties?.map((property)=>{
                  return(
                    
                    property?.propertyDetail?.fieldType==="singlelineText" || property?.propertyDetail?.fieldType==="password" || property?.propertyDetail?.fieldType==="email" ?
                    
                    <Form.Item>
                      <label>{property?.propertyDetail?.label} <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
                      <Input 
                        className='generic-input-control' 
                        onBlur={(e)=>onBlurDesign(e.target)} 
                        onFocus={(e)=>onFocusDesign(e.target)}
                        onChange={(e)=>handelChange(e.target, property?.propertyDetail)} 
                        type={property?.propertyDetail?.fieldType==="password"? "password" : "text"}
                        name={property?.propertyDetail?.label.replaceAll(" ","").toLowerCase()} />
                    </Form.Item>  
                    
                    : property?.propertyDetail?.fieldType==="multilineText"?

                    <Form.Item>
                    <label>{property?.propertyDetail?.label} <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
                    <Input.TextArea rows={4} 
                      className='generic-input-control' 
                      onBlur={(e)=>onBlurDesign(e.target)} 
                      onFocus={(e)=>onFocusDesign(e.target)}
                      onChange={(e)=>handelChange(e.target, property?.propertyDetail)} 
                      name={property?.propertyDetail?.label.replaceAll(" ","").toLowerCase()} />
                    </Form.Item>  

                    : property?.propertyDetail?.fieldType=="singleCheckbox" ?
                    
                    <Form.Item>
                      <label>{property?.propertyDetail?.label} <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
                      <Select
                        name={property?.propertyDetail?.label.replaceAll(" ","").toLowerCase()}
                      >
                          <Option value="yes">Yes</Option>
                          <Option value="no">No</Option>
                      </Select>
                    </Form.Item>
                    
                    : property?.propertyDetail?.fieldType == 'selectDropdown' || property?.propertyDetail?.fieldType == 'radioDropdown' ?
                    
                    <Form.Item>
                        <label>{property?.propertyDetail?.label}</label>
                            <Select 
                              className='custom-select'  
                              suffixIcon={<span className='dropdowncaret'></span>}
                              name={property?.propertyDetail?.label.replaceAll(" ","").toLowerCase()}
                            >
                                {property?.propertyDetail?.options?.map((option)=>(<Option value={option.value}> {option.key} </Option>))}
                            </Select>
                    </Form.Item>  
                    
                    : property?.propertyDetail?.fieldType == 'multiCheckbox' ?
                    <Form.Item>
                        <label>{property?.propertyDetail?.label}</label>
                      <TreeSelect 
                          multiple
                          treeCheckable
                          className='custom-select'   
                          name={property?.propertyDetail?.label.replaceAll(" ","").toLowerCase()}
                          suffixIcon={<span className='dropdowncaret'></span>}
                      >
                          {property?.propertyDetail?.options?.map((option)=>(
                              option?.value?.length > 0 && option?.showFormIn && <TreeSelect.TreeNode value={option.value} title={option.key}/>
                          ))}
                      </TreeSelect>
                  
                    </Form.Item>  
                    : property?.propertyDetail?.fieldType == 'date' || property?.propertyDetail?.fieldType == 'datetime-local'?
                    <Form.Item>
                      <label>{property?.propertyDetail?.label}</label>
                      <DatePicker
                        showTime={property?.propertyDetail?.fieldType == "datetime-local"}
                        className='generic-input-control'
                        disabledDate={
                          (current)=>handelDateRule(property?.propertyDetail?.rules, current)
                        }
                        suffixIcon={<FontAwesomeIcon style={{color:'rgb(0, 145, 174) !important'}} icon={faCalendarAlt} />}
                      />
                    </Form.Item>
                    : property?.propertyDetail?.fieldType == 'time' ?
                    <Form.Item>
                      <label>{property?.propertyDetail?.label}</label>
                      <TimePicker
                        className='generic-input-control'
                        suffixIcon={<FontAwesomeIcon style={{color:'rgb(0, 145, 174) !important'}} icon={faClock} />}
                      />
                    </Form.Item>
                    :
                    <Form.Item>
                        <label>{property?.propertyDetail?.label}</label>
                        <Input 
                          name={property?.propertyDetail?.label.replaceAll(" ","").toLowerCase()} 
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