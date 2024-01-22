import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Modal, Select, Button, notification, Spin, TreeSelect, DatePicker, TimePicker, Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import { LoadingOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { GET_BRANCHES } from '../../../util/query/branch.query';


export const EditPropertiesModal = ({ visible, onClose, record, dynamicColumn, handelBulkUpdateSave, clearSelection}) => {
  const [data, setData] = useState(null);
  const popoverRef = useRef(null);
  const inputRef = useRef(null);
  const { data: branchData, } = useQuery(GET_BRANCHES ,{
    fetchPolicy: 'cache-and-network',
    variables: {
        input: {
            filters: null
        }
    }
  });

  const [localGroup, setLocalGroup] = useState(branchData?.branches||[]);
  const [groupInput, setGroupInput] = useState();
  const [groupPopover, setGroupPopover] = useState(false);

  const [selectedProperty, setSelectedProperty] = useState(null);

  const [field, setField] = useState(null);
      
 


  useEffect(()=>{
    if(branchData?.branches?.length>0){
        setLocalGroup(branchData?.branches);
    }
  },[branchData?.branches]);

  
  const [parentWidth, setParentWidth] = useState(null);
  const parentRef = useRef(null);

  const [tags, setTags] = useState([]);
  
  

  useEffect(() => {

    const updateParentWidth = () => {
      if (parentRef.current) {
        const width = parentRef.current.offsetWidth;
        setParentWidth(width);
      }
    };

    // Call the update function on initial mount and window resize
    updateParentWidth();
    window.addEventListener('resize', updateParentWidth);
    inputRef?.current?.focus();

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', updateParentWidth);
    };

  }, [groupPopover, visible]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.group-wrapper')) {
        setGroupPopover(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // useEffect(()=>{
  //   if(tags?.length>0){
  //     console.log(tags, "dddd")
  //     setData({
  //       field:"branch",
  //       value: [...tags]
  //     });
  //   }
  // },[tags]);


  useEffect(()=>{
    if(groupInput && !tags?.find((tag)=>tag?.name==groupInput?.name) && groupInput?.id!="dumy"){
        setTags([...tags, groupInput]);
        const dataValue = tags?.map((tag)=>tag.id);
        console.log([...dataValue, groupInput?.id], "groupppId")
        setData({field: 'branch', value: [...dataValue, groupInput?.id]})
    }
  }, [groupInput]);


  useEffect(()=>{
    if(selectedProperty){
      // setData(null);
      // setField(null);
      const newField = getField(data, setData, branchData, selectedProperty, popoverRef, inputRef, parentRef, parentWidth, setParentWidth, tags, setTags, localGroup, setLocalGroup, groupInput, setGroupInput, groupPopover, setGroupPopover);
      setField(newField);
    }
  }, [selectedProperty, groupPopover, groupInput]);

  
  useEffect(()=>{
    if(selectedProperty){
      setData(null);
    }
  }, [selectedProperty]);

  useEffect(()=>{
    if(data){

      const newField = getField(data, setData, branchData, selectedProperty, popoverRef, inputRef, localGroup, parentRef, parentWidth, setParentWidth, tags, setTags, setLocalGroup, groupInput, setGroupInput, groupPopover, setGroupPopover);
      setField(newField);
    }
  }, [data, groupPopover, groupInput]);

  const [loading, setLoading] = useState(false);
  const handelUpdate = async ()=>{
    setLoading(true);
    const response = await handelBulkUpdateSave(data, record);
    if(response){
      clearSelection([]);
      setSelectedProperty(null);
      setData(null);
      setField(null);
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      width={500}
      footer={
        <div style={{padding:'26px 40px', textAlign:'left', display:'flex', columnGap:'16px', marginTop:'-25px' }}>
            <button  
              disabled={loading || data? false : true} 
              className={loading?'disabled-btn drawer-filled-btn' : data?'drawer-filled-btn':'disabled-btn drawer-filled-btn'} 
              onClick={handelUpdate}
            >
              {loading? <Spin indicator={<LoadingOutlined/>}/> : "Update"}
            </button>
            <button  disabled={loading} className={loading? 'disabled-btn drawer-outlined-btn':'drawer-outlined-btn'} onClick={onClose}>
              Cancel
            </button>
        </div>
      }
      closable={false}
    >
      
      <React.Fragment>
        <div className='modal-header-title'>
            <span>Bulk edit {record?.length} records</span>
            <span  onClick={onClose}><FontAwesomeIcon className='close' icon={faClose}/></span>
        </div>
        <div className='modal-body'>
         
          <form id="branchForm" className='form'>
            <Form.Item>
              <label>Property to update</label>
              <Select
                className='custom-select'  
                suffixIcon={<span className='dropdowncaret'></span>}
                placeholder="Select a property to edit"
                onChange={(e)=>setSelectedProperty(JSON.parse(e)?.originalObj)}
              >
                {dynamicColumn?.map((opt)=>(
                  <Select.Option value={JSON.stringify(opt)}>{opt.title}</Select.Option>
                ))}
              </Select>
            </Form.Item> 
            {field? field : null}    
          </form>
        </div>  
      </React.Fragment>  
    </Modal>
  );
};

const getField = (data, setData, branchData, property, popoverRef, inputRef, parentRef, parentWidth, setParentWidth, tags, setTags, localGroup, setLocalGroup, groupInput, setGroupInput, groupPopover, setGroupPopover)=>{
  
  console.log(property, "safyan propertyy");
  const name = property?.propertyDetail?.label.replaceAll(" ","").toLowerCase();
  const {Option} = Select;

  
  const onBlurDesign = (e) =>{
    e.style.borderColor="#cbd6e2";
    e.style.boxShadow="none";
  }

  const onFocusDesign = (e)=>{
    e.style.borderColor="rgba(0,208,228,.5)";
    e.style.boxShadow="0 0 4px 1px rgba(0,208,228,.3), 0 0 0 1px #00d0e4";
  }


  const handelChange=(e, propertyDetail)=>{
    handelRules(propertyDetail?.rules, e);
    handelDataValue(e);
  };

  const handelDataValue=(e)=>{
      setData({field:e.name, value: e.value});
  };

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

  

  return(
                    
    property?.propertyDetail?.fieldType==="singlelineText" || property?.propertyDetail?.fieldType==="password" || property?.propertyDetail?.fieldType==="email" ?
    
    <Form.Item>
      <label>{property?.propertyDetail?.label} <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
      <Input 
        className='generic-input-control' 
        onBlur={(e)=>onBlurDesign(e.target)} 
        onFocus={(e)=>onFocusDesign(e.target)}
        value={data?.value||""}
        onChange={(e)=>{; handelChange(e.target, property?.propertyDetail);}} 
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
      
      onChange={(e)=>{;handelChange(e.target, property?.propertyDetail);}} 
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
        
        onChange={(e)=>{handelDataValue({
          name: property?.propertyDetail?.label.replaceAll(" ","").toLowerCase(),
          value: e
        });}}
      >
          <Option value="yes">Yes</Option>
          <Option value="no">No</Option>
      </Select>
    </Form.Item>
    
    : property?.propertyDetail?.fieldType == 'selectDropdown' || property?.propertyDetail?.fieldType == 'radioDropdown' ?
    property?.propertyDetail?.label.toLowerCase()=="branch"?
      <Form.Item>
          <label>{property?.propertyDetail?.label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup> </label>
              
          {tags?.length>0?
            <>
                
                <div className="grouptabs" style={{marginBottom: '16px'}}>
                    {tags?.map((property)=>(
                        <Tag closable={true} onClose={()=>{setGroupInput({id:"dumy"}); setTags(tags?.filter((tag)=>tag.id!=property.id));  }} className='tag'>
                            {property.name}
                        </Tag>
                    ))}
                </div>
            </>
            : null
          }
          <div className="group-wrapper">
              <div
                  name="groupInput"
                  className='generic-input-control groupInput' 
                  style={{cursor:'pointer', padding:'0 0px'}}
                  onClick={()=>setGroupPopover(!groupPopover)}
              >
                  <div  style={{fontSize:'14px', fontWeight: 'normal', margin: '9px', display: 'flex'}}>
                      Select branch
                      <span onClick={()=>setGroupPopover(!groupPopover)} 
                          style={{
                              position: 'absolute',
                              right: '6px',
                          }} className='caret'></span>
                  </div>
              </div>

              <div ref={parentRef} className={groupPopover? 'show ': 'hide'}>
                  <div className="moveGroupData" style={{width: parentWidth-1.5}} >
                      <div className="popover-search" >
                          <Input type="text" 
                              ref={inputRef}
                              name='popoverSearch'
                              style={{ width: '-webkit-fill-available', backgroundColor: 'white'  }} 
                              className='generic-input-control' 
                              placeholder="Search..."
                              autoFocus={groupPopover}
                              autoComplete="off"
                              onChange={(e)=> setLocalGroup(branchData?.branches?.filter((group)=> (group.branchname)?.toLowerCase()?.includes(e.target.value?.toLowerCase())))}
                              suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
                          />
                      </div>

                      <div ref={popoverRef}>
                          {localGroup?.length ? localGroup?.map((gl)=>(
                              <div 
                                  className={"popoverdataitem"} 
                                  onClick={(e)=>{setGroupInput({name:gl.branchname, id:gl._id}); setGroupPopover(false)}}>
                                  {gl.branchname}
                              </div>
                          )):
                          
                          <div 
                              className={"popoverdataitem"} 
                              style={{cursor:'no-drop'}}
                              onClick={(e)=>{ setGroupPopover(false)}}>
                              No results found
                          </div>
                          }
                      </div>
                  </div>

              </div>
          
                  
                  
            
          </div>
          {/* <Select 
            className='custom-select'  
            suffixIcon={<span className='dropdowncaret'></span>}
            name={name}
            id={name}
            
            placeholder="Select Branch"
            onChange={(e)=>{handelDataValue({
              name,
              value: e
            });}}

          >
              {branchData?.branches?.map((option)=>(<Option value={option._id}> {option?.branchname} </Option>))}
          </Select> */}
      </Form.Item>  
      :
      <Form.Item>
          <label>{property?.propertyDetail?.label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup> </label>
              <Select 
                className='custom-select'  
                suffixIcon={<span className='dropdowncaret'></span>}
                name={name}
                id={name}
                

                onChange={(e)=>{handelDataValue({
                  name,
                  value: e
                });}}

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
          

          suffixIcon={<span className='dropdowncaret'></span>}
          onChange={(e)=>{handelDataValue({
            name,
            value:e
          });}}
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
        id={name}
        onChange={(e, dateString)=>{handelDataValue({
          name,
          value: dateString
      });}}

        className='generic-input-control'
        // disabledDate={
        //   (current)=>handelDateRule(property?.propertyDetail?.rules, current)
        // }
        suffixIcon={<FontAwesomeIcon style={{color:'rgb(0, 145, 174) !important'}} icon={faCalendarAlt} />}
      />
    </Form.Item>
    : property?.propertyDetail?.fieldType == 'time' ?
    <Form.Item>
      <label>{property?.propertyDetail?.label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
      <TimePicker
        id={name}
        className='generic-input-control'
        
        onChange={(e)=>{handelDataValue(e.target);}}
        suffixIcon={<FontAwesomeIcon style={{color:'rgb(0, 145, 174) !important'}} icon={faClock} />}
      />
    </Form.Item>
    :
    <Form.Item>
        <label>{property?.propertyDetail?.label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
        <Input 
          id={name}
          name={name} 
          
          onChange={(e)=>{handelDataValue(e.target);}}
          type={property?.propertyDetail?.fieldType} className='generic-input-control'
        /> 
        
    </Form.Item>
  
  )
}

