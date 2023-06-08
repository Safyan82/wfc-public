import React from 'react';
import { Button } from 'antd';

import { SelectDropdown } from '../select';

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
                    <Button className='grid-outlined-btn'>Action</Button>
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