// import './tablegrid.css';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Popover } from 'antd';
import { GridHeader } from '../../../components/tablegrid/header';
import { DataTable } from '../../../components/table';
// import DraggableTabs from '../dragableTab';
// import { GridFilter } from './gridFilter/gridFilter';
// import { AdvanceFilter } from '../advanceFilter/advanceFilter';

export const Grid=({createAction, data, title})=>{

    const [filterModal, setFilterModal] = useState(false);

    return (
        <div className="tablegrid">
            <GridHeader title={title} record={data?.branches?.length} createAction={createAction} />
           
            {/* <DraggableTabs  />

            <GridFilter
                openAdvanceFilter={()=>setFilterModal(true)}
            />

            <AdvanceFilter visible={filterModal} onClose={()=>setFilterModal(false)}/>

        */}
            <div className='tableView'>
                <DataTable data={data}  header={true}/>
            </div> 

            
        </div>
    )
}