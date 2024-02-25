
import '../setting.css';
import '../../../components/createFields/createFieldDrawer.css';
import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Col, Input, Popover, Row, Select, Tabs, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faLock, faSearch } from '@fortawesome/free-solid-svg-icons';

export const GroupFilter = ({setGroupModal})=>{
    
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
                                        
                                    </div>

                                    <div className="right-filter-inner">
                                        
                                        <button onClick={
                                            setGroupModal
                                        } className='drawer-filled-btn' style={{height:'40px'}}> Create group </button>
                                    </div>
                                </div>
                            </div>
    )
}