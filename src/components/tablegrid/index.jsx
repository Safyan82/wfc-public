import './tablegrid.css';
import React, { useEffect, useRef, useState } from 'react';
import {DataTable} from '../table';
import { GridHeader } from './header';
import DraggableTabs from '../dragableTab';
import { GridFilter } from './gridFilter/gridFilter';
import { Button, Input, Popover } from 'antd';
import { AdvanceFilter } from '../advanceFilter/advanceFilter';

export const TableGrid=({createAction})=>{

    const [filterModal, setFilterModal] = useState(false);

    return (
        <div className="tablegrid">
            <GridHeader title={"Branch"} record={0} createAction={createAction} />
           
            <DraggableTabs  />

            <GridFilter
                openAdvanceFilter={()=>setFilterModal(true)}
            />
            <AdvanceFilter visible={filterModal} onClose={()=>setFilterModal(false)}/>

            <div className='tableView'>
                <DataTable/>
            </div>

            
        </div>
    )
}