import { faCalendar, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Checkbox, DatePicker, Input, InputNumber, Popover, Radio, Tag, Typography, notification } from "antd"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { resetRules, setRules } from "../../middleware/redux/reducers/createField.reducer";
import { setBtnState } from "../../middleware/redux/reducers/editProperty.reducer";

export const Rules = ({basicInfo, setWidth})=>{

    const {propertyToBeEdit, rules, globalFieldType} = useSelector(state => state.createFieldReducer);

    const [minCharacter, setMinCharacter] = useState(propertyToBeEdit?.rules?.minimumCharacter || 1);
    const [maxCharacter, setMaxCharacter] = useState(propertyToBeEdit?.rules?.maxCharacter || 100);
    const [min, setMin] = useState(propertyToBeEdit?.rules?.minRange|| false);
    const [fieldType, setFieldType] = useState(sessionStorage.getItem("fieldType") || propertyToBeEdit?.fieldType );
    const [dateType, setDateType] = useState(propertyToBeEdit?.rules?.dateType || "anyDate");
    const [futureDateType, setfutureDateType] = useState(propertyToBeEdit?.rules?.futureDateType);
    const [api, contextHolder] = notification.useNotification();
    const [localRule, setLocalRules] = useState([]);
    const [restrictToNumericValue, setRestrictToNumericValue] = useState(propertyToBeEdit?.rules?.restrictToNumericValue || false);
    const [max, setMax] = useState(propertyToBeEdit?.rules?.maxRange|| false);
    const [dontAllowSpecialCharacter, setDontAllowSpecialCharacter] = useState(propertyToBeEdit?.rules?.dontAllowSpecialCharacter || false);
    const [allowEmailDomain, setAllowEmailDomain] = useState(propertyToBeEdit?.rules?.allowEmailDomain || false);
    
    const [alphaNumericnotAllow, setAlphaNumericnotAllow] = useState(propertyToBeEdit?.rules?.alphaNumericnotAllow || false);
    const [specialCharacternotAllowed, setSpecialCharacternotAllowed] = useState(propertyToBeEdit?.rules?.specialCharacternotAllowed || false);
    

   
    

    useEffect(()=>{
        if(globalFieldType){

            setFieldType(globalFieldType);
        }
    },[globalFieldType]);

    const dispatch = useDispatch();
  


    const handelFutureDateType=({target})=>{
        dispatch(setRules({futureDateType: target.value}));
        setfutureDateType(target.value)
    }

    const handelDateType=({target})=>{
        dispatch(setRules({dateType: target.value}));
        setDateType(target.value)
    }

    const [passwordCharacter, setPasswordCharacter]= useState(propertyToBeEdit?.rules?.passwordMandatoryCharacter || false);

    
    const [tags, setTags] = useState(propertyToBeEdit?.rules?.emailDomain||[]);
    const [inputValue, setInputValue] = useState('');


    useEffect(()=>{
        if(tags?.length>0){
            handelRuleChange(tags, 'emailDomain');
        }else{
            handelRuleChange(null, 'emailDomain');
        }
    },[tags])

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

  
   

    const handelRuleChange = (event,name) =>{
        dispatch(setBtnState(false)) ;
        if(!event?.target?.name && !name){
            return;
        }

        if(event?.target?.checked  && event?.target?.name){
            const isExist = localRule.find((lr)=>lr.name==event.target.name);
            if(isExist){
                setLocalRules(localRule.map((lr)=>{
                    if(lr?.name==event?.target.name){
                        return{
                            ...lr,
                            value: event?.target?.checked,
                        }
                    }else{
                        return lr;
                    }
                }));
            }else{
                setLocalRules([...localRule, 
                    {name: event?.target?.name, value: event?.target?.checked}
                ]);
            };
        }
        else if(event?.target?.value ){
            const isExist = localRule.find((lr)=>lr.name==event.target.name);
            if(isExist){

                setLocalRules(localRule.map((lr)=>{
                    if(lr?.name==event?.target.name){
                        return{
                            ...lr,
                            value: event?.target?.value,
                        }
                    }else{
                        return lr;
                    }
                }));

            }else{
                setLocalRules([...localRule, 
                    {name: event?.target?.name, value: event?.target?.value}
                ]);
            };

        }else{
            const isExist = localRule.find((lr)=>lr.name==name);

            if(isExist && name){

                setLocalRules(localRule.map((lr)=>{
                    if(lr?.name==name){
                        return{
                            ...lr,
                            value: event,
                        }
                    }else{
                        return lr;
                    }
                }));
            }else if(name){
                setLocalRules([...localRule, {name, value:event}])
            }

        }
       
        
    }   


    useEffect(()=>{console.log(localRule)},[localRule])



    useEffect(()=>{
        localRule.map((rule)=>{
            dispatch(setRules({[rule.name]:rule.value}))
        });
        dispatch(setBtnState(false)) ;
    },[localRule]);

    
    useEffect(()=>{
        if(propertyToBeEdit?.rules){

            Object.keys(propertyToBeEdit?.rules).map((rule)=>{
                dispatch(setRules({[rule]:propertyToBeEdit?.rules[rule]}))
            });
        }
        dispatch(setBtnState(false)) ;
    },[propertyToBeEdit?.rules]);

    
    const handelTag = (index)=>{
        setTags(tags.filter((tag, i)=> i !=index));
        console.log(tags);
    }

    return(
        <React.Fragment>
            {contextHolder}
            <Typography className='rule-heading' style={{marginTop: '-30px', marginBottom:'-10px'}}>
                <Typography.Title level={5}>Select property rules</Typography.Title>
            </Typography>
            {fieldType=="date" &&
            <div className="dateValidation">
                <div className="dateValidationTitle">
                    These rules are based on your account's time zone.
                </div>
                <div className="mainRadioGroup">
                    <div>What dates are allowed for this property?</div>
                   
                        <Radio.Group name="dateType" className="group" value={dateType} onChange={(e)=>{handelDateType(e)}} >
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
                    
                            <Radio.Group value={futureDateType}  onChange={(e) => {handelFutureDateType(e);} } name="futureDateType" className="group" >
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
                                name="bufferTime"
                                defaultValue={propertyToBeEdit?.rules?.bufferTime || minCharacter}                          
                                upHandler={<FontAwesomeIcon style={{color:'#0091ae'}} icon={faChevronUp} />}
                                downHandler={<FontAwesomeIcon  style={minCharacter > 1 && {color:'#0091ae'}} icon={faChevronDown} />}
                                className="generic-input-control"
                                onChange={(e)=>{setMinCharacter(e);handelRuleChange(e, 'bufferTime')}}
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
                                name="rollingDate"
                                defaultValue={propertyToBeEdit?.rules?.rollingDate || 14}                      
                                upHandler={<FontAwesomeIcon style={{color:'#0091ae'}} icon={faChevronUp} />}
                                downHandler={<FontAwesomeIcon  style={{color:'#0091ae'}} icon={faChevronDown} />}
                                className="generic-input-control"
                                onChange={(e)=>{setMinCharacter(e); handelRuleChange(e, 'rollingDate');}}
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
                                name="dateRange"
                                onChange={(value, dateString)=>handelRuleChange(dateString, "customDate")}
                                className="generic-input-control"
                                suffixIcon={<FontAwesomeIcon icon={faCalendar}/>}
                            />
                        </div>
                    </div>
                }

                <div>
                    <div className="allowedDays">Days allowed</div>

                    <Checkbox 
                        onChange={handelRuleChange}
                        name="mondayFriday"
                        defaultChecked={propertyToBeEdit?.rules?.mondayFriday}
                        className="genericCheckbox"
                    >Allow Monday through Friday only</Checkbox>
                </div>
            </div>
            }

            {/* generic */}
            <div className="propertyCheckbox">
                <div style={{color: 'black',marginTop:'5%', marginBottom: '2%'}} >Property visibility</div>
                <Checkbox name="propertyVisibility" defaultChecked={propertyToBeEdit?.rules?.propertyVisibility || rules?.propertyVisibility} 
                onChange={(e)=>dispatch(setRules({'propertyVisibility':e.target.checked}))} style={{fontWeight:'300'}} >Show in forms, pop-up forms, and bots</Checkbox>
            </div>


            {/* single field validation */}
            {(fieldType=="singlelineText" || fieldType=="multilineText" || fieldType=="password") &&
            <div className="validationRules">
                <div className="validationRules-title">Validation rules</div>
                <div className="validationRules-subTitle">Set rules that apply when a user is creating, editing, or importing records.</div>
                
                <div className="validationCheckboxGroup">

                    

                    <div>

                        <Checkbox checked={min} onChange={(e)=>{setMin(e.target.checked);dispatch(setRules({'minRange':e.target.checked}))}}>
                            Set min character limit
                        </Checkbox>
                        {min &&
                            <div className="numberInput">
                                <InputNumber
                                    min={1}
                                    name="minimumCharacter"                                    
                                    defaultValue={propertyToBeEdit?.rules?.minimumCharacter || minCharacter}                          
                                    upHandler={<FontAwesomeIcon style={{color:'#0091ae'}} icon={faChevronUp} />}
                                    downHandler={<FontAwesomeIcon  style={minCharacter > 1 && {color:'#0091ae'}} icon={faChevronDown} />}
                                    className="generic-input-control"
                                    onChange={(e)=>{setMinCharacter(e); handelRuleChange(e, 'minimumCharacter');}}
                                />
                            </div>
                        }

                    </div>


                    <div>
                        <Checkbox 
                        
                        checked={max}
                        onChange={(e)=>{setMax(e.target.checked);dispatch(setRules({'maxRange':e.target.checked}))}}>
                            Set max character limit
                        </Checkbox>
                        {max &&
                        <div className="numberInput">
                            <InputNumber
                                min={100}
                                name="maximumCharacter"
                                defaultValue={propertyToBeEdit?.rules?.maximumCharacter || maxCharacter}                          
                                upHandler={<FontAwesomeIcon style={{color:'#0091ae'}} icon={faChevronUp} />}
                                downHandler={<FontAwesomeIcon  style={{color:'#0091ae'}} icon={faChevronDown} />}
                                className="generic-input-control"
                                onChange={(e)=>{setMaxCharacter(e);handelRuleChange(e, 'maximumCharacter');}}
                            />
                        </div>
                        }

                    </div>

                    {fieldType=="password" &&
                        <div>

                            <Checkbox 
                                onChange={(e)=>{dispatch(setRules({passwordMandatoryCharacter: e.target.checked}));
                                setPasswordCharacter(e.target.checked)}}      
                                checked={passwordCharacter}
                            >
                                Mandatory character in password
                            </Checkbox>
                            {passwordCharacter &&
                                <div className="numberInput">
                                    <Input                        
                                        className="generic-input-control"
                                        placeholder="@$%"
                                        name="passwordMandatoryCharacter"
                                        onChange={handelRuleChange}
                                        defaultValue={propertyToBeEdit?.rules?.passwordMandatoryCharacter}
                                    />
                                </div>
                            }

                        </div>
                    }

                    <Checkbox 
                        name="restrictToNumericValue"
                        onChange={(e) => {
                                setRestrictToNumericValue(e.target.checked);
                                dispatch(setRules({'restrictToNumericValue':e.target.checked}))
                            }
                        }
                        checked={restrictToNumericValue}

                    >
                        Restrict to numeric values 
                        {/* <div className="small-text">Don't allow alpha or special characters like a, @, or $ for this property</div> */}
                    </Checkbox>
                    <Checkbox
                        name="dontAllowSpecialCharacter"
                        onChange={(e) => {
                            setDontAllowSpecialCharacter(e.target.checked);
                            dispatch(setRules({'dontAllowSpecialCharacter':e.target.checked}))
                            }
                        }
                        checked={dontAllowSpecialCharacter}
                    >
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

                        <Checkbox checked={min} onChange={(e)=>{setMin(e.target.checked);dispatch(setRules({'minRange':e.target.checked}));} }>
                            Set min number limit
                        </Checkbox>
                        {min &&
                            <div className="numberInput">
                                <InputNumber 
                                    min={1}
                                    defaultValue={propertyToBeEdit?.rules?.minimumCharacter || minCharacter}                          
                                    upHandler={<FontAwesomeIcon style={{color:'#0091ae'}} icon={faChevronUp} />}
                                    downHandler={<FontAwesomeIcon  style={minCharacter > 1 && {color:'#0091ae'}} icon={faChevronDown} />}
                                    className="generic-input-control"
                                    onChange={(e)=>{setMinCharacter(e);handelRuleChange(e, "minNumberLimit");} }
                                />
                            </div>
                        }

                    </div>

                    <div>
                        <Checkbox checked={max} onChange={(e)=>{setMax(e.target.checked);dispatch(setRules({'maxRange':e.target.checked}))}}>
                            Set max number limit
                        </Checkbox>
                        {max &&
                        <div className="numberInput">
                            <InputNumber 
                                min={100}
                                defaultValue={propertyToBeEdit?.rules?.maximumCharacter || maxCharacter}                          
                                upHandler={<FontAwesomeIcon style={{color:'#0091ae'}} icon={faChevronUp} />}
                                downHandler={<FontAwesomeIcon  style={{color:'#0091ae'}} icon={faChevronDown} />}
                                className="generic-input-control"
                                onChange={(e)=>{setMaxCharacter(e); handelRuleChange(e, "maxNumberLimit")}}
                            />
                        </div>
                        }

                    </div>

                    <Checkbox name="alphaNumericnotAllow" 
                        onChange={(e)=>{
                            setAlphaNumericnotAllow(e.target.value);
                            dispatch(setRules({'alphaNumericnotAllow':e.target.checked}))
                        }} 
                        checked={alphaNumericnotAllow}
                    >
                        Don't allow alpha numeric values 
                        <div className="small-text">Don't allow alpha numeric characters like 1ag, g5c for this property</div>
                    </Checkbox>
                    <Checkbox name="specialCharacternotAllowed"
                        onChange={(e)=>{
                            setSpecialCharacternotAllowed(e.target.value);
                            dispatch(setRules({'specialCharacternotAllowed':e.target.checked}))
                        }}
                        checked={specialCharacternotAllowed}
                     >
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

                        <Checkbox checked={allowEmailDomain} 
                        onChange={(e)=>{
                            setAllowEmailDomain(e.target.checked);
                            dispatch(setRules({allowEmailDomain: e.target.checked}))
                        }}>
                            Allow only specific domain email address
                        </Checkbox>
                        {allowEmailDomain &&
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
                                        onChange={(e) => {setInputValue(e.target.value);}}
                                        onPressEnter={handleInputKeyPress}
                                    />
                                </Popover>
                                <div style={{ marginTop: '8px' }}>
                                    {tags.map((tag, index) => (
                                    <Tag key={index} closable onClose={()=>handelTag(index)} style={{marginTop:'4%'}}>{tag}</Tag>
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