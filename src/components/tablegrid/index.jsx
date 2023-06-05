import { Button, Popover  } from 'antd';
import React from 'react';
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableTabs from '../dragableTab';
import {DndProvider} from 'react-dnd';
import { CaretDownFilled, SlidersOutlined, SaveFilled } from '@ant-design/icons';

import { SelectDropdown } from '../select';
import DataTable from '../table';

export const TableGrid=()=>{

    const [createdDate, setCreatedDate] = React.useState(false);
    const [assignedEmployee, setAssignedEmployee] = React.useState(false);
    const [lastActivityDate, setLastActivityDate] = React.useState(false);

    return (
        <div>
            <div className='grid-head-section'>
                <div className='grid-title'>
                    Employee
                    <div className='grid-subtitle'>0 records</div>
                </div>
                {/* right section */}
                <div className='grid-header-btn'>
                    <Button className='grid-outlined-btn'>Action</Button>
                    <Button className='grid-outlined-btn'>Import</Button>
                    <Button className='grid-filed-btn'>Create Employee</Button>
                </div>
            </div>
            <div className='dragable-view'>
                {/* dragable tabs implementation */}
            </div>
            <div className='grid-head-section'>
                <div className='grid-head-left-btn-section'>

                    <Popover 
                        visible={assignedEmployee} 
                        content={<SelectDropdown />} 
                        placement='bottom'
                    >
                        <Button type='text' className='grid-text-btn'  onClick={()=>setAssignedEmployee(!assignedEmployee)}>Assigned Employee <CaretDownFilled/> </Button>
                    </Popover>


                    <Popover 
                        visible={createdDate} 
                        content={<SelectDropdown />} 
                        placement='bottom'
                    >
                        <Button type='text' className='grid-text-btn'  onClick={()=>setCreatedDate(!createdDate)}>Created Date <CaretDownFilled/> </Button>
                    </Popover>


                    <Popover 
                        visible={lastActivityDate} 
                        content={<SelectDropdown />} 
                        placement='bottom'
                    >
                        <Button type='text' className='grid-text-btn'  onClick={()=>setLastActivityDate(!lastActivityDate)}>Last Activity Date <CaretDownFilled/> </Button>
                    </Popover>



                    <Popover 
                        visible={lastActivityDate} 
                        content={<SelectDropdown />} 
                        placement='bottom'
                    >
                        <Button type='text' className='grid-text-btn'  onClick={()=>setLastActivityDate(!lastActivityDate)}>Status <CaretDownFilled/></Button>
                    </Popover>

                    <Button type='text' className='grid-text-btn'> <SlidersOutlined />   Advance Filter</Button>



                </div>
                <Button className='grid-head-right-btn'>
                    <SaveFilled /> Save view
                </Button>
            </div>
            <div className='tableView'>
                <DataTable/>
            </div>
        </div>
    )
}