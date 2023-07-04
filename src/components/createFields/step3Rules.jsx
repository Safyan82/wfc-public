import { faCalendar, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Checkbox, DatePicker, Input, InputNumber, Popover, Radio, Tag, Typography, notification } from "antd"
import React, { useEffect, useState } from "react"

export const Rules = ({basicInfo, setWidth})=>{
    const [minCharacter, setMinCharacter] = useState(1);
    const [maxCharacter, setMaxCharacter] = useState(100);
    const [min, setMin] = useState(false);
    const [max, setMax] = useState(false);
    const [fieldType, setFieldType] = useState(sessionStorage.getItem("fieldType"));
    const [dateType, setDateType] = useState("anyDate");
    const [futureDateType, setfutureDateType] = useState();
    const [api, contextHolder] = notification.useNotification();
    
    useEffect(()=>{
        setWidth(false);
        setFieldType(sessionStorage.getItem("fieldType"));
        console.log(fieldType);
    },[]);

    const handelFutureDateType=({target})=>{
        setfutureDateType(target.value)
    }

    const handelDateType=({target})=>{
        setDateType(target.value)
    }

    const [passwordCharacter, setPasswordCharacter]= useState(false);

    
    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleInputKeyPress = (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '' && !tags.includes(inputValue) && inputValue.includes('@')) {
          setTags([...tags, inputValue.trim()]);
          setInputValue('');
        }
        else if(!inputValue.includes('@')){
            
            api.warning({
                message: "Domain should start with @",
                placement:"topLeft",
                className: 'notification-without-close',
            });
        }
        else{
            api.error({
                message: "Domain already exist",
                placement:"topLeft",
                className: 'notification-without-close',
            });
        }
    };

    return(
        <React.Fragment>
            {contextHolder}
            <Typography className='label'>
                <Typography.Title level={4}>{basicInfo?.label}</Typography.Title>
            </Typography>

            <Typography className='rule-heading'>
                <Typography.Title level={5}>Select property rules</Typography.Title>
            </Typography>
            {fieldType=="date" &&
            <div className="dateValidation">
                <div className="dateValidationTitle">
                    These rules are based on your account's time zone.
                </div>
                <div className="mainRadioGroup">
                    <div>What dates are allowed for this property?</div>
                   
                        <Radio.Group className="group" onChange={handelDateType} defaultValue={dateType}>
                            <Radio value={"anyDate"} >Any date</Radio>
                            <Radio value={"futureDate"}>Future dates only</Radio>
                            <Radio value={"pastDate"}>Past dates only</Radio>
                            <Radio value={"customDate"}>Specific date range</Radio>
                        </Radio.Group>
                </div>

                {/* future date box */}

                {dateType=="futureDate" &&
                <>
                    <div className="mainRadioGroup">
                        <div>What future dates are allowed?</div>
                    
                            <Radio.Group className="group" onChange={handelFutureDateType}>
                                <Radio value={"anyFutureDate"} >
                                Any future date
                                <div className="small-text">Users can choose any date after the current date.</div>
                                </Radio>
                                <Radio value={"bufferTime"}>
                                    Any date after buffer time
                                    <div className="small-text">Users can choose any date after a specific number of days.</div>
                                </Radio>
                                <Radio value={"rollingDate"}>
                                    Any date in a rolling date range
                                    <div className="small-text">Any date in a rolling date range.</div>
                                </Radio>
                            </Radio.Group>
                    </div>
                    {futureDateType=="bufferTime" &&
                    <div className="bufferTime">
                        <div>Required buffer time</div>
                        
                        <div className="datenumberInput">
                            <InputNumber 
                                min={1}
                                defaultValue={minCharacter}                          
                                upHandler={<FontAwesomeIcon style={{color:'#0091ae'}} icon={faChevronUp} />}
                                downHandler={<FontAwesomeIcon  style={minCharacter > 1 && {color:'#0091ae'}} icon={faChevronDown} />}
                                className="generic-input-control"
                                onChange={(e)=>setMinCharacter(e)}
                            />
                            <span style={{lineHeight:'42px'}}>
                                day(s)
                            </span>
                        </div>
                    </div>
                    }
                    
                    {futureDateType=="rollingDate" &&
                    <div className="bufferTime">
                        <div>Date must be within next</div>
                        
                        <div className="datenumberInput">
                            <InputNumber 
                                min={14}   
                                defaultValue={14}                      
                                upHandler={<FontAwesomeIcon style={{color:'#0091ae'}} icon={faChevronUp} />}
                                downHandler={<FontAwesomeIcon  style={{color:'#0091ae'}} icon={faChevronDown} />}
                                className="generic-input-control"
                                onChange={(e)=>setMinCharacter(e)}
                            />
                            <span style={{lineHeight:'42px'}}>
                                day(s)
                            </span>
                        </div>
                    </div>
                    }
                </>
                }

                {/* specific date box */}

                {dateType=="customDate" &&
                    <div className="mainRadioGroup">
                        <div style={{marginBottom:'16px'}}>Specific date range?</div>
                    
                        <div>
                            <DatePicker.RangePicker
                                className="generic-input-control"
                                suffixIcon={<FontAwesomeIcon icon={faCalendar}/>}
                            />
                        </div>
                    </div>
                }

                <div>
                    <div className="allowedDays">Days allowed</div>

                    <Checkbox className="genericCheckbox">Allow Monday through Friday only</Checkbox>
                </div>
            </div>
            }

            {/* generic */}
            <div className="propertyCheckbox">
                <div style={{color: 'black',marginTop:'5%', marginBottom: '2%'}} >Property visibility</div>
                <Checkbox style={{fontWeight:'300'}} defaultChecked>Show in forms, pop-up forms, and bots</Checkbox>
            </div>

            

            {/* single field validation */}
            {(fieldType=="singlelineText" || fieldType=="multilineText" || fieldType=="password") &&
            <div className="validationRules">
                <div className="validationRules-title">Validation rules</div>
                <div className="validationRules-subTitle">Set rules that apply when a user is creating, editing, or importing records.</div>
                
                <div className="validationCheckboxGroup">

                    

                    <div>

                        <Checkbox onChange={(e)=>setMin(e.target.checked)}>
                            Set min character limit
                        </Checkbox>
                        {min &&
                            <div className="numberInput">
                                <InputNumber 
                                    min={1}
                                    defaultValue={minCharacter}                          
                                    upHandler={<FontAwesomeIcon style={{color:'#0091ae'}} icon={faChevronUp} />}
                                    downHandler={<FontAwesomeIcon  style={minCharacter > 1 && {color:'#0091ae'}} icon={faChevronDown} />}
                                    className="generic-input-control"
                                    onChange={(e)=>setMinCharacter(e)}
                                />
                            </div>
                        }

                    </div>


                    <div>
                        <Checkbox onChange={(e)=>setMax(e.target.checked)}>
                            Set max character limit
                        </Checkbox>
                        {max &&
                        <div className="numberInput">
                            <InputNumber 
                                min={100}
                                defaultValue={maxCharacter}                          
                                upHandler={<FontAwesomeIcon style={{color:'#0091ae'}} icon={faChevronUp} />}
                                downHandler={<FontAwesomeIcon  style={{color:'#0091ae'}} icon={faChevronDown} />}
                                className="generic-input-control"
                                onChange={(e)=>setMaxCharacter(e)}
                            />
                        </div>
                        }

                    </div>

                    
                    <div>

                        <Checkbox onChange={(e)=>setPasswordCharacter(e.target.checked)}>
                            Mandatory character in password
                        </Checkbox>
                        {passwordCharacter &&
                            <div className="numberInput">
                                <Input                        
                                    className="generic-input-control"
                                    placeholder="@$%"
                                />
                            </div>
                        }

                    </div>

                    <Checkbox>
                        Restrict to numeric values 
                        {/* <div className="small-text">Don't allow alpha or special characters like a, @, or $ for this property</div> */}
                    </Checkbox>
                    <Checkbox>
                        Don't allow special characters
                        <div className="small-text">Don't allow special characters like @, #, or & for this property</div>
                    </Checkbox>
                </div>

            </div>}

            

            {/* single numerix field validation */}
            {(fieldType=="number") &&
            <div className="validationRules">
                <div className="validationRules-title">Validation rules</div>
                <div className="validationRules-subTitle">Set rules that apply when a user is creating, editing, or importing records.</div>
                
                <div className="validationCheckboxGroup">
                    <div>

                        <Checkbox onChange={(e)=>setMin(e.target.checked)}>
                            Set min number limit
                        </Checkbox>
                        {min &&
                            <div className="numberInput">
                                <InputNumber 
                                    min={1}
                                    defaultValue={minCharacter}                          
                                    upHandler={<FontAwesomeIcon style={{color:'#0091ae'}} icon={faChevronUp} />}
                                    downHandler={<FontAwesomeIcon  style={minCharacter > 1 && {color:'#0091ae'}} icon={faChevronDown} />}
                                    className="generic-input-control"
                                    onChange={(e)=>setMinCharacter(e)}
                                />
                            </div>
                        }

                    </div>

                    <div>
                        <Checkbox onChange={(e)=>setMax(e.target.checked)}>
                            Set max number limit
                        </Checkbox>
                        {max &&
                        <div className="numberInput">
                            <InputNumber 
                                min={100}
                                defaultValue={maxCharacter}                          
                                upHandler={<FontAwesomeIcon style={{color:'#0091ae'}} icon={faChevronUp} />}
                                downHandler={<FontAwesomeIcon  style={{color:'#0091ae'}} icon={faChevronDown} />}
                                className="generic-input-control"
                                onChange={(e)=>setMaxCharacter(e)}
                            />
                        </div>
                        }

                    </div>

                    <Checkbox>
                        Don't allow alpha numeric values 
                        <div className="small-text">Don't allow alpha numeric characters like 1ag, g5c for this property</div>
                    </Checkbox>
                    <Checkbox>
                        Don't allow special characters
                        <div className="small-text">Don't allow special characters like @, #, or & for this property</div>
                    </Checkbox>
                </div>

            </div>}



            
            {/* email numerix field validation */}
            {(fieldType=="email") &&
            <div className="validationRules">
                <div className="validationRules-title">Validation rules</div>
                <div className="validationRules-subTitle">Set rules that apply when a user is creating, editing, or importing records.</div>
                
                <div className="validationCheckboxGroup">
                    <div>

                        <Checkbox onChange={(e)=>setMin(e.target.checked)}>
                            Allow only specific domain email address
                        </Checkbox>
                        {min &&
                            <div className="numberInput">
                                <Popover
                                    content='Press " ENTER " to add domain'
                                    placement="right"
                                    trigger={"click"}
                                >

                                    <Input                        
                                        className="generic-input-control"
                                        placeholder="@wfc.co.uk"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onPressEnter={handleInputKeyPress}
                                    />
                                </Popover>
                                <div style={{ marginTop: '8px' }}>
                                    {tags.map((tag, index) => (
                                    <Tag key={index} closable style={{marginTop:'4%'}}>{tag}</Tag>
                                    ))}
                                </div>
                            </div>
                            
                        }

                    </div>
                </div>

            </div>}


            
            
            

        </React.Fragment>
    )
}