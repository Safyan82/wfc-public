import React from 'react';
import { Button, Dropdown } from 'antd';

import { SelectDropdown } from '../select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export const GridHeader = ({title, record, createAction})=>{
    return(
        <>
            <div className='grid-head-section'>
                <div className='grid-title'>
                    {title}
                    <div className='grid-subtitle'>{record} records</div>
                </div>
                {/* right section */}
                <div className='grid-header-btn'>
                    
                    
                    <div class="dropdown">
                    <Button className='grid-outlined-btn dropdown'>Action <span className='private-dropdown__caret'></span></Button>
                        <div class="dropdown-content">
                        <a href="#">Edit properties</a>
                        <a href="#">View Customization</a>
                        <a href="#">Restore records</a>
                        </div>
                    </div>
                    <Button className='grid-outlined-btn'>Import</Button>
                    <Button className='grid-filed-btn' onClick={createAction}>Create {title}</Button>
                </div>
            </div>
            <div className='dragable-view'>
                {/* dragable tabs implementation */}
            </div>
        </>
    )
}