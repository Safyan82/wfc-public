
import './setting.css';
import '../../components/createFields/createFieldDrawer.css';
import React, { useEffect, useState, useRef } from 'react';
import { Button, Checkbox, Col, Input, Popover, Row, Select, Tabs, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faLock, faSearch } from '@fortawesome/free-solid-svg-icons';

export const Filter = ({editProperty})=>{
    
    const [group, setGroupInput] = useState();
    const [groupPopover, setGroupPopover] = useState(false);
    const [fieldType, setFieldType] = useState();
    const [fieldTypePopover, setfieldTypePopover] = useState(false);
    const [user, setUser] = useState();
    const [userPopover, setuserPopover] = useState(false);
    
    const popoverRef = useRef(null);

    useEffect(() => {
        console.log("component mount");
        // Function to handle clicks outside the box
        const handleClickOutside = (event) => {
            console.log(event.target)
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
    },[groupPopover])

    useEffect(()=>{
        if(fieldTypePopover){setGroupPopover(false);setuserPopover(false);setfieldTypePopover(true);}
        else{
            setfieldTypePopover(false)
        }
    },[fieldTypePopover])

    useEffect(()=>{
        if(userPopover){setuserPopover(true);setGroupPopover(false);setfieldTypePopover(false);}
        else{
            setuserPopover(false)
        }
    },[userPopover])

    return(
        <div className="filter"  >
                                <div className="filter-inner">

                                    <div className='left-filter-inner'>
                                        <div className="">Filter by:</div>
                                        
                                        <div className='filter-item' ref={popoverRef}>
                                            <Popover
                                                visible={groupPopover}
                                                overlayClassName='settingCustomPopover'
                                                content={
                                                    <div ref={popoverRef}>
                                                        <div className="popover-search"  ref={popoverRef}>
                                                            <Input type="text" 
                                                                name="popoverSearch"
                                                                style={{ width: '-webkit-fill-available', backgroundColor: 'white'  }} 
                                                                className='generic-input-control' 
                                                                placeholder="Search..."
                                                                autoFocus
                                                                suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
                                                            />
                                                        </div>

                                                        <div className="popover-data"  ref={popoverRef}>
                                                            <div className="popoverdataitem" onClick={(e)=>{setGroupInput(e.target.innerText); setGroupPopover(false)}}>
                                                                Branch
                                                            </div>
                                                            <div className="popoverdataitem" onClick={(e)=>{setGroupInput(e.target.innerText); setGroupPopover(false)}}>
                                                                Other
                                                            </div>
                                                        </div>

                                                    </div>
                                                }
                                                trigger="click"
                                                placement='bottom'
                                            >
                                                <span ref={popoverRef} onClick={()=>setGroupPopover(!groupPopover)}>{group? group :"All groups"}
                                                <span className='caret'></span>
                                                </span>
                                            </Popover>
                                        </div>

                                        
                                        <div className='filter-item' ref={popoverRef}>
                                            <Popover
                                                visible={fieldTypePopover}
                                                overlayClassName='settingCustomPopover'
                                                content={
                                                    <div ref={popoverRef}>
                                                        <div className="popover-search">
                                                            <Input type="text" 
                                                                name="popoverSearch"
                                                                style={{ width: '-webkit-fill-available', backgroundColor: 'white'  }} 
                                                                className='generic-input-control' 
                                                                placeholder="Search..."
                                                                autoFocus
                                                                suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
                                                            />
                                                        </div>

                                                        <div className="popover-data" ref={popoverRef} >
                                                            <div className="popoverdataitem" ref={popoverRef} onClick={(e)=>{setFieldType(e.target.innerText); setfieldTypePopover(false)}}>
                                                                All field type
                                                            </div>
                                                        </div>

                                                    </div>
                                                }
                                                trigger="click"
                                                placement='bottom'
                                            >
                                                <span ref={popoverRef} onClick={()=>setfieldTypePopover(!fieldTypePopover)}>{fieldType? fieldType :"All field types"}
                                                <span className='caret'></span>
                                                </span>
                                            </Popover>
                                        </div>
                                        
                                        <div className='filter-item' ref={popoverRef}>
                                            <Popover
                                                visible={userPopover}
                                                overlayClassName='settingCustomPopover'
                                                content={
                                                    <div>
                                                        <div className="popover-search">
                                                            <Input type="text" 
                                                                name="popoverSearch"
                                                                style={{ width: '-webkit-fill-available', backgroundColor: 'white' }} 
                                                                className='generic-input-control' 
                                                                placeholder="Search..."
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
                                                <span ref={popoverRef} onClick={()=>setuserPopover(!userPopover)}>{user? "1 user" :"All users"}
                                                <span className='caret'></span>
                                                </span>
                                            </Popover>
                                        </div>


                                    </div>

                                    <div className="right-filter-inner">
                                        <Input type="text" 
                                            style={{width:'250px'}} 
                                            className='generic-input-control' 
                                            placeholder="Search..."
                                            
                                            suffix={<FontAwesomeIcon style={{color:'#0091ae'}} icon={faSearch}/>}
                                        />
                                        <button className='drawer-filled-btn' onClick={editProperty} style={{height:'40px'}}> Create Property </button>
                                    </div>
                                </div>
                            </div>
    )
}