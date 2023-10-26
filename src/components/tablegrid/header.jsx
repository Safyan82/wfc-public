import React, { useEffect, useRef, useState } from 'react';
import { Button, Dropdown } from 'antd';
import {Link, useNavigate} from 'react-router-dom'
import { SelectDropdown } from '../select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { CreateFieldDrawer } from '../createFields';

export const GridHeader = ({title, record, createAction, editProperty})=>{
    const [isAction, setAction] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setAction(false);
        }
      };
  
      document.addEventListener('click', handleOutsideClick);
  
      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }, []);
    const navigate = useNavigate();
    const [fieldModal, setFieldModal] = useState(false);
    return(
        <>
            <div className='grid-head-section'>
                <div className='grid-title'>
                    {title}
                    <div className='grid-subtitle'>{record} records</div>
                </div>
                {/* right section */}
                <div className='grid-header-btn'>
                    
                    
                    <div class="dropdown" ref={containerRef}>
                    <Button className='grid-outlined-btn dropdown' onClick={()=>setAction(!isAction)}>Action <span className='private-dropdown__caret'></span></Button>
                        <div  class="dropdown-content" style={isAction ? {display:'block'}: {display:'none'}}>
                        <a href="" onClick={(e)=>{ e.preventDefault(); setFieldModal(true); }}
                        >Create properties</a>
                        {/* <Link to="/user/setting" target='_blank'
                        >Edit properties</Link> */}
                        <a href="" onClick={(e)=>{
                            e.preventDefault();
                            navigate('/branch/editform',{
                                state: {
                                title: 'Branch',
                                url:'/user/branch',
                                }
                            })}}>View Customization</a>
                        {/* <a href="#">Restore records</a> */}
                        </div>
                    </div>
                    <Button className='grid-outlined-btn'>Import</Button>
                    <Button className='grid-filed-btn' onClick={createAction}>Create Branch</Button>
                </div>
            </div>
            <div className='dragable-view'>
                {/* dragable tabs implementation */}
            </div>
            <CreateFieldDrawer 
                visible={fieldModal}  
                propertyListRefetch={()=>{}}
                onClose={()=>{setFieldModal(false);}}
            />
        </>
    )
}