import './tablegrid.css';
import React, { useEffect, useRef, useState } from 'react';
import {DataTable} from '../table';
import { GridHeader } from './header';
import DraggableTabs from '../dragableTab';
import { GridFilter } from './gridFilter/gridFilter';
import { Button, Input, Popover } from 'antd';
import { AdvanceFilter } from '../advanceFilter/advanceFilter';

export const TableGrid=({
    data, 
    setDynamicColumn, 
    dynamicColumn, 
    loading, viewRefetch, view, objectData
})=>{


    return (
        
            <div className='tableView'>
                <DataTable
                 data={data}  
                 header={true}
                 setDynamicColumn={setDynamicColumn}
                 dynamicColumn={dynamicColumn}
                 loading={loading}
                 viewRefetch={viewRefetch}
                 view={view}
                 objectData={objectData}
                />
            </div>

            
    )
}