import React, { useEffect, useRef, useState } from 'react';
import { Button, Dropdown } from 'antd';

import { SelectDropdown } from '../select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

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
                        <a href="#" onClick={()=>{setAction(!isAction);editProperty();}}>Edit properties</a>
                        <a href="#">View Customization</a>
                        <a href="#">Restore records</a>
                        </div>
                    </div>
                    <Button className='grid-outlined-btn'>Import</Button>
                    <Button className='grid-filed-btn' onClick={createAction}>Create Branch</Button>
                </div>
            </div>
            <div className='dragable-view'>
                {/* dragable tabs implementation */}
            </div>
        </>
    )
}