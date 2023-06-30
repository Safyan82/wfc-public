
import './setting.css';
import '../../components/createFields/createFieldDrawer.css';
import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Col, Input, Popover, Row, Select, Tabs, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faLock, faSearch } from '@fortawesome/free-solid-svg-icons';

export const Filter = ()=>{
    
    const [group, setGroupInput] = useState();
    const [groupPopover, setGroupPopover] = useState(false);
    const [fieldType, setFieldType] = useState();
    const [fieldTypePopover, setfieldTypePopover] = useState(false);
    const [user, setUser] = useState();
    const [userPopover, setuserPopover] = useState(false);

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
        <div className="filter">
                                <div className="filter-inner">

                                    <div className='left-filter-inner'>
                                        <div className="">Filter by:</div>
                                        
                                        <div className='filter-item'>
                                            <Popover
                                                visible={groupPopover}
                                                content={
                                                    <div>
                                                        <div className="popover-search">
                                                            <Input type="text" 
                                                                style={{ width: '-webkit-fill-available' }} 
                                                                className='generic-input-control' 
                                                                placeholder="Search..."
                                                                autoFocus
                                                                suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
                                                            />
                                                        </div>

                                                        <div className="popover-data">
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
                                                <span  onClick={()=>setGroupPopover(!groupPopover)}>{group? group :"All groups"}
                                                <span className='caret'></span>
                                                </span>
                                            </Popover>
                                        </div>

                                        
                                        <div className='filter-item'>
                                            <Popover
                                                visible={fieldTypePopover}
                                                content={
                                                    <div>
                                                        <div className="popover-search">
                                                            <Input type="text" 
                                                                style={{ width: '-webkit-fill-available' }} 
                                                                className='generic-input-control' 
                                                                placeholder="Search..."
                                                                autoFocus
                                                                suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
                                                            />
                                                        </div>

                                                        <div className="popover-data">
                                                            <div className="popoverdataitem" onClick={(e)=>{setFieldType(e.target.innerText); setfieldTypePopover(false)}}>
                                                                All field type
                                                            </div>
                                                        </div>

                                                    </div>
                                                }
                                                trigger="click"
                                                placement='bottom'
                                            >
                                                <span  onClick={()=>setfieldTypePopover(!fieldTypePopover)}>{fieldType? fieldType :"All field types"}
                                                <span className='caret'></span>
                                                </span>
                                            </Popover>
                                        </div>
                                        
                                        <div className='filter-item'>
                                            <Popover
                                                visible={userPopover}
                                                content={
                                                    <div>
                                                        <div className="popover-search">
                                                            <Input type="text" 
                                                                style={{ width: '-webkit-fill-available' }} 
                                                                className='generic-input-control' 
                                                                placeholder="Search..."
                                                                autoFocus
                                                                suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
                                                            />
                                                        </div>

                                                        <div className="popover-data">
                                                            <div className="popoverdataitem" >
                                                                <Checkbox onClick={(e)=>{setUser(e.target.checked); }}>Wfc</Checkbox>
                                                            </div>
                                                        </div>

                                                    </div>
                                                }
                                                trigger="click"
                                                placement='bottom'
                                            >
                                                <span  onClick={()=>setuserPopover(!userPopover)}>{user? "1 user" :"All users"}
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
                                        <Button className='grid-filed-btn' style={{height:'40px'}}> <b>Create Property</b> </Button>
                                    </div>
                                </div>
                            </div>
    )
}