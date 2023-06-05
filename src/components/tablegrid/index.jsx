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
                        content={<SelectDropdown />} 
                        placement='bottom'
                        trigger="click"
                        onClick={(visible)=>console.log(visible)}
                        overlayInnerStyle={{height:'200px'}}
                    >
                        <Button type='text' className='grid-text-btn'>Assigned Employee <CaretDownFilled/> </Button>
                    </Popover>


                    <Popover 
                        content={<SelectDropdown />} 
                        placement='bottom'
                        trigger="click"
                        overlayInnerStyle={{height:'200px'}}
                    >
                        <Button type='text' className='grid-text-btn'>Created Date <CaretDownFilled/> </Button>
                    </Popover>


                    <Popover 
                        content={<SelectDropdown />} 
                        placement='bottom'
                        trigger="click"
                        overlayInnerStyle={{height:'200px'}}
                    >
                        <Button type='text' className='grid-text-btn'>Last Activity Date <CaretDownFilled/> </Button>
                    </Popover>



                    <Popover 
                        content={<SelectDropdown />} 
                        placement='bottom'
                        trigger="click"
                        overlayInnerStyle={{height:'200px'}}
                    >
                        <Button type='text' className='grid-text-btn' >Status <CaretDownFilled/></Button>
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