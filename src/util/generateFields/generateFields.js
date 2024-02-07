import { faCalendarAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatePicker, Form, Input, Select, TimePicker, TreeSelect } from "antd";
import dayjs from "dayjs";

export const GenerateFields = (label, name, fieldType, handelDataValue, property, value="")=>{
        
        const {Option} = Select;

        return(
          
            fieldType==="singlelineText" || fieldType==="password" || fieldType==="email" ?
          
          <Form.Item>
            <label>{label} <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
            <Input 
              className='generic-input-control'
              value={value}
              onChange={(e)=>{ handelDataValue(e.target);}} 
              type={fieldType==="password"? "password" : "text"}
              name={name} 
              id={name} 
            />
          </Form.Item>  
          
          : fieldType==="multilineText"?

          <Form.Item>
          <label>{label} <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
          <Input.TextArea rows={4} 
            className='generic-input-control' 
            value={value}
            onChange={(e)=>{handelDataValue(e.target);}} 
            name={name} 
            id={name} 
            />
          </Form.Item>  

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
                    });
                }}
            >
                <Option value="yes">Yes</Option>
                <Option value="no">No</Option>
            </Select>
          </Form.Item>
          
          : fieldType == 'selectDropdown' || fieldType == 'radioDropdown' ?
        //   label.toLowerCase()=="branch"?
            

        //       <Form.Item>
        //           <label>{tags?.length>1? 'Branches': 'Branch'} <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup> </label>
                
        //           {tags?.length>0?
        //           <>
                      
        //               <div className="grouptabs" style={{marginBottom: '16px'}}>
        //                   {tags?.map((property)=>(
        //                       <Tag closable={true} onClose={()=>{setBtn(true); setGroupInput({id:"dumy"}); setTags(tags?.filter((tag)=>tag.id!=property.id));  }} className='tag'>
        //                           {property.name}
        //                       </Tag>
        //                   ))}
        //               </div>
        //           </>
        //           : null
        //           }
        //           <div className="group-wrapper">
        //               <div
        //                   name="groupInput"
        //                   className='generic-input-control groupInput' 
        //                   style={{cursor:'pointer', padding:'0 0px'}}
        //                   onClick={()=>setGroupPopover(!groupPopover)}
        //               >
        //                   <div  style={{fontSize:'14px', fontWeight: 'normal', margin: '9px', display: 'flex'}}>
        //                       Select branch
        //                       <span onClick={()=>setGroupPopover(!groupPopover)} 
        //                           style={{
        //                               position: 'absolute',
        //                               right: '6px',
        //                           }} className='caret'></span>
        //                   </div>
        //               </div>

        //               <div ref={parentRef} id="branch-selector" className={groupPopover? 'show ': 'hide'}>
        //                   <div className="moveGroupData" style={{width: parentWidth-1.5}} >
        //                       <div className="popover-search" >
        //                           <Input type="text" 
        //                               ref={inputRef}
        //                               name='popoverSearch'
        //                               style={{ width: '-webkit-fill-available', backgroundColor: 'white'  }} 
        //                               className='generic-input-control' 
        //                               placeholder="Search..."
        //                               autoFocus={groupPopover}
        //                               autoComplete="off"
        //                               onChange={(e)=> setLocalGroup(branchData?.branches?.filter((group)=> (group.branchname)?.toLowerCase()?.includes(e.target.value?.toLowerCase())))}
        //                               suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
        //                           />
        //                       </div>

        //                       <div ref={popoverRef}>
        //                           {localGroup?.length ? localGroup?.map((gl)=>(
        //                               <div 
        //                                   className={"popoverdataitem"} 
        //                                   onClick={(e)=>{setGroupInput({name:gl.branchname, id:gl._id}); setBtn(true); setGroupPopover(false)}}>
        //                                   {gl.branchname}
        //                               </div>
        //                           )):
                                  
        //                           <div 
        //                               className={"popoverdataitem"} 
        //                               style={{cursor:'no-drop'}}
        //                               onClick={(e)=>{ setGroupPopover(false)}}>
        //                               No results found
        //                           </div>
        //                           }
        //                       </div>
        //                   </div>

        //               </div>
                  
                          
                          
                    
        //           </div>
        //       </Form.Item>

            
        //     :
            <Form.Item>
                <label>{label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup> </label>
                    <Select 
                      showSearch
                      className='custom-select'  
                      suffixIcon={<span className='dropdowncaret'></span>}
                      name={name}
                      id={name}
                      value={value}

                      onChange={(e)=>{handelDataValue({
                        name,
                        value: e
                      });}}

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
                });}}
            >
                {property?.options?.map((option)=>(
                    option?.value?.length > 0 && option?.showFormIn && <TreeSelect.TreeNode value={option.value} title={option.key}/>
                ))}
            </TreeSelect>
        
          </Form.Item>  
          : fieldType == 'date' || fieldType == 'datetime-local'?
          <Form.Item>
            <label>{label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
            <DatePicker
              showTime={fieldType == "datetime-local"}
              name={name}
              value={value && dayjs(value)}
              id={name}
              onChange={(e, dateString)=>{handelDataValue({
                name,
                value: dateString
            });}}

              className='generic-input-control'
            //   disabledDate={
            //     (current)=>handelDateRule(property?.propertyDetail?.rules, current)
            //   }
              suffixIcon={<FontAwesomeIcon style={{color:'rgb(0, 145, 174) !important'}} icon={faCalendarAlt} />}
            />
          </Form.Item>
          : fieldType == 'time' ?
          <Form.Item>
            <label>{label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
            <TimePicker
              id={name}
              className='generic-input-control'
              value={value}
              onChange={(e)=>{handelDataValue(e.target);}}
              suffixIcon={<FontAwesomeIcon style={{color:'rgb(0, 145, 174) !important'}} icon={faClock} />}
            />
          </Form.Item>
          :
          <Form.Item>
              <label>{label}  <sup className='mandatory'>{property?.isMandatory? '*' : null}</sup></label>
              <Input 
                id={name}
                name={name} 
                value={value}
                onChange={(e)=>{handelDataValue(e.target);}}
                type={fieldType} className='generic-input-control'
              /> 
              
          </Form.Item>
        
        )
}