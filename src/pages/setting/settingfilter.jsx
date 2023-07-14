
import './setting.css';
import '../../components/createFields/createFieldDrawer.css';
import React, { useEffect, useState, useRef } from 'react';
import { Button, Checkbox, Col, Input, Popover, Row, Select, Tabs, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faClose, faLock, faSearch } from '@fortawesome/free-solid-svg-icons';

const localfieldTypes = [
    {
        id:1,
        header: true,
        label: 'Meta Field',
    },
    { 
        parent:1,
        label: 'Email',
        value: 'email'
    }, 
    {
        parent:1,
        label: 'Password',
        value: 'password'
    },
    {
        id: 2,
        header: true,
        label: 'Text Field'
    },
    { 
        parent:2, label: 'Single-line text', value:'single line text'},
    { 
        parent:2, label: 'Multi-line text', value:'multi line text'},
    { header: true, label: 'Number'},
    { label: 'Number', value:'number'},
    { header: true, label: 'Date & Time'},
    { label: 'Date picker', value:'date picker'},
    { label: 'Time picker', value:'time picer'},
    { label: 'Date & Time picker', value:'date time/ date & time/ date & time picker'},


]

export const Filter = ({
    editProperty, group, groupPopover,fieldType, fieldTypePopover,
    user, userPopover, setGroupPopover, setGroupInput,
    setFieldType, setfieldTypePopover, setUser, setuserPopover, propertyList, setPropertyList,
    groupList
})=>{
   

    const popoverRef = useRef(null);
    const inputRef = useRef(null);
    const [fieldTypeList, setfieldTypeList] = useState([...localfieldTypes]);
    const [groupSearch, setGroupSearch] = useState();
    const [userSearch, setUserSearch] = useState();
    const [fieldSearch, setFieldSearch] = useState();


    useEffect(()=>{
        if(fieldSearch?.length==0){
            setfieldTypeList([...localfieldTypes]);
        }
    },[fieldSearch]);

    useEffect(() => {
        // Function to handle clicks outside the box
        const handleClickOutside = (event) => {
          if(event.target.name==="popoverSearch" || event.target.name==="popoverCheckboxes"){ return; }
          if (popoverRef.current && !popoverRef.current.contains(event.target)) {
            // Perform your desired action here
            setGroupPopover(false);
            setuserPopover(false);
            setfieldTypePopover(false);
          }
        };
    
        // Attach the event listener when the component mounts
        document.addEventListener('click', handleClickOutside);
    
        // Clean up the event listener when the component unmounts
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
      }, []);
    

    useEffect(()=>{
        if(groupPopover){setGroupPopover(true);setuserPopover(false);setfieldTypePopover(false);}
        else{
            setGroupPopover(false)
        }
        setGroupSearch('');
    },[groupPopover])

    useEffect(()=>{
        if(fieldTypePopover){setGroupPopover(false);setuserPopover(false);setfieldTypePopover(true);}
        else{
            setfieldTypePopover(false)
        }
        setFieldSearch('');
    },[fieldTypePopover])

    useEffect(()=>{
        if(userPopover){setuserPopover(true);setGroupPopover(false);setfieldTypePopover(false);}
        else{
            setuserPopover(false)
        }
        setUserSearch('');
    },[userPopover])

    const[searchInput, setSearchInput]=useState('');

    const handelSearch = (keyword)=>{
        setSearchInput(keyword);
        setPropertyList(propertyList.filter((property)=> property.label.toLowerCase().includes(keyword.toLowerCase())));
    };

    const [localGroup, setLocalGroup] = useState(groupList);

    useEffect(()=>{
        setLocalGroup(groupList);
    },[groupList]);


    return(
        <div className="filter"  >
                                <div className="filter-inner">

                                    <div className='left-filter-inner'>
                                        <div className="">Filter by:</div>
                                        
                                        <div className='filter-item' ref={popoverRef}>
                                            <Popover
                                                open={groupPopover}
                                                overlayClassName='settingCustomPopover'
                                                afterOpenChange={()=>{inputRef.current.focus();}}
                                                content={
                                                    <div ref={popoverRef}>
                                                        <div className="popover-search" ref={popoverRef}>
                                                            <Input type="text" 
                                                                ref={inputRef}
                                                                id="inputSearch"
                                                                name='popoverSearch'
                                                                style={{ width: '-webkit-fill-available', backgroundColor: 'white'  }} 
                                                                className='generic-input-control' 
                                                                placeholder="Search..."
                                                                autoFocus={groupPopover}
                                                                autoComplete="off"
                                                                value={groupSearch}
                                                                onChange={(e)=> {
                                                                    setLocalGroup(groupList?.filter((group)=> (group.name)?.toLowerCase()?.includes(e.target.value?.toLowerCase())))
                                                                    setGroupSearch(e.target.value);
                                                                }}
                                                                suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
                                                            />
                                                        </div>

                                                        <div className="popover-data"  ref={popoverRef}>
                                                            {localGroup?.length ?
                                                            <div 
                                                                className={group=="All groups"? "popoverdataitem popoverdataitem-active": "popoverdataitem"} 
                                                                onClick={(e)=>{setGroupInput(e.target.innerText); setGroupPopover(false)}}>
                                                                {"All groups"}
                                                            </div>
                                                            :
                                                            
                                                            <div 
                                                                className={group=="All groups"? "popoverdataitem popoverdataitem-active": "popoverdataitem"} 
                                                                onClick={(e)=>{setGroupPopover(false)}}>
                                                                {"No group found"}
                                                            </div>
                                                            }
                                                            {localGroup && localGroup?.map((gl)=>(

                                                                <div 
                                                                    className={group==gl.name? "popoverdataitem popoverdataitem-active": "popoverdataitem"} 
                                                                    onClick={(e)=>{setGroupInput(e.target.innerText); setGroupPopover(false)}}>
                                                                    {gl.name}
                                                                </div>
                                                            ))}
                                                        </div>

                                                    </div>
                                                }
                                                trigger="click"
                                                placement='bottom'
                                            >
                                                <span ref={popoverRef} className='truncated-text' onClick={()=>setGroupPopover(!groupPopover)}>{group? group :"All groups"}
                                                <span className='caret'></span>
                                                </span>
                                            </Popover>
                                        </div>

                                        
                                        <div className='filter-item' ref={popoverRef}>
                                            <Popover
                                                open={fieldTypePopover}
                                                afterOpenChange={()=>{inputRef.current.focus()}}
                                                overlayClassName='settingCustomPopover'
                                                content={
                                                    <div ref={popoverRef}>
                                                        <div className="popover-search">
                                                            <Input type="text" 
                                                                name="popoverSearch"
                                                                ref={inputRef}
                                                                style={{ width: '-webkit-fill-available', backgroundColor: 'white'  }} 
                                                                className='generic-input-control' 
                                                                placeholder="Search..."
                                                                autoFocus
                                                                value={fieldSearch}
                                                                onChange={(e)=>{setFieldSearch(e.target.value); setfieldTypeList(localfieldTypes.filter((field)=> field?.value?.includes(e.target.value)))}}
                                                                autoComplete="off"
                                                                suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
                                                            />
                                                        </div>

                                                        <div className="popover-data" ref={popoverRef} style={{
                                                            height:'170px',
                                                            overflowY:'scroll',
                                                        }}>
                                                            {fieldSearch?.length<1 &&
                                                            <div className="default-option" onClick={(e)=>{setFieldType(e.target.innerText); setfieldTypePopover(false)}}>
                                                                All field types
                                                            </div>
                                                            }
                                                            
                                                            {fieldTypeList?.map((field)=>{
                                                                if(field?.header){
                                                                    return(<div className='custom-dropdown-label'> {field.label} </div>)
                                                                }else{
                                                                    return <div className="custom-dropdown-option"  onClick={(e)=>{setFieldType(e.target.innerText); setfieldTypePopover(false)}}>{field?.label}</div>
                                                                }
                                                            })}
                                                           
                                                        </div>

                                                    </div>
                                                }
                                                trigger="click"
                                                placement='bottom'
                                            >
                                                <span ref={popoverRef} className='truncated-text' onClick={()=>setfieldTypePopover(!fieldTypePopover)}>{fieldType? fieldType :"All field types"}
                                                <span className='caret'></span>
                                                </span>
                                            </Popover>
                                        </div>
                                        
                                        <div className='filter-item' ref={popoverRef}>
                                            <Popover
                                                open={userPopover}
                                                afterOpenChange={()=>{inputRef.current.focus()}}
                                                overlayClassName='settingCustomPopover'
                                                content={
                                                    <div>
                                                        <div className="popover-search">
                                                            <Input type="text" 
                                                                ref={inputRef}
                                                                name="popoverSearch"
                                                                style={{ width: '-webkit-fill-available', backgroundColor: 'white' }} 
                                                                className='generic-input-control' 
                                                                placeholder="Search..."
                                                                autoComplete="off"
                                                                value={userSearch}
                                                                onChange={(e)=>setUserSearch(e.target.value)}
                                                                autoFocus
                                                                suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
                                                            />
                                                        </div>

                                                        <div className="popover-data">
                                                            <div className="popoverdataitem" >
                                                                <Checkbox name="popoverCheckboxes" onClick={(e)=>{setUser(e.target.checked); }}>Wfc</Checkbox>
                                                            </div>
                                                        </div>

                                                    </div>
                                                }
                                                trigger="click"
                                                placement='bottom'
                                            >
                                                <span ref={popoverRef}  className='truncated-text'  onClick={()=>setuserPopover(!userPopover)}>{user? "1 user" :"All users"}
                                                <span className='caret'></span>
                                                </span>
                                            </Popover>
                                        </div>


                                    </div>

                                    <div className="right-filter-inner">
                                        <Input type="text" 
                                            style={{width:'250px'}} 
                                            className='generic-input-control' 
                                            placeholder="Search properties"
                                            onChange={(e)=>handelSearch(e.target.value)}
                                            value={searchInput}
                                            autoComplete="off"
                                            suffix={searchInput? 
                                            <FontAwesomeIcon style={{color:'#7c98b6', cursor:'pointer', fontSize: '20px'}} onClick={()=>{setSearchInput('');handelSearch('');}} icon={faClose}/> : 
                                            <FontAwesomeIcon style={{color:'#0091ae'}} icon={faSearch}/> }
                                        />
                                        <button className='drawer-filled-btn' onClick={editProperty} style={{height:'40px'}}> Create Property </button>
                                    </div>
                                </div>
                            </div>
    )
}