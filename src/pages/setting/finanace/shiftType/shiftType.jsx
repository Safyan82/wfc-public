import React, { useContext, useEffect, useRef, useState } from 'react';
import { Tabs, Form, Input, Popconfirm, Table } from 'antd';
import TabPane from "antd/es/tabs/TabPane";
import { SummaryShiftTypeDrawer } from './summaryShiftType.drawer';
import { ShiftTypeDrawer } from './shiftType.drawer';


export const ShiftType = ({themeData})=>{

    const [shiftTypeModal, setShiftTypeModal] = useState(false);
    const [summaryShiftTypeModal, setSummartShiftTypeModal] = useState(false);

    return(
        <div className='setting-body'>
            <div className='setting-body-inner'>
                <div className="setting-body-inner">
                    <div className="setting-body-title">
                        <div className='setting-body-inner-title'>
                            Shift Type
                        </div>
                    </div>

                    <div className="text">
                        Pay and bill columns as well as Pay levels are settled in PayTable. 
                        <i> To make changes please review</i> <b>Pay & Bill Columns</b> or <b> Pay Level </b>
                    </div>


                    {/* body */}

                    <div className="propertyTab"></div>
                    <Tabs defaultActiveKey="1" >

                        <TabPane tab={`Shift Type`} key="1" >
                            <div>
                                
                                <div style={{display:'flex', justifyContent:'flex-end', width:'100%'}}>
                                    <button className="drawer-filled-btn" 
                                        onClick={()=>setShiftTypeModal(!shiftTypeModal)}
                                    >Add Shift Type</button>
                                </div>  

                                {/* subscription main body cards */}
                                <div className="propertyTab"></div>

                                <Table 
                                    columns={[
                                        {title:'name', dataIndex:'name'}, {title:'description', dataIndex:'description'},
                                        {title:'summary shift type', dataIndex:'summaryshifttype'}, 
                                        {title:'pay code', dataIndex:'paycode'}, {title:'pay column', dataIndex:'paycolumn'},
                                        {title:'pay method', dataIndex:'paymethod'},
                                        {title:'pay multiplier', dataIndex:'paymultiplier'}, 
                                        {title:'bill code', dataIndex:'billcode'}, {title:'bill column', dataIndex:'billcolumn'},
                                        {title:'bill method', dataIndex:'billmethod'},
                                        {title:'bill multiplier', dataIndex:'billmultiplier'}, 
                                    ]}
                                />

                                <ShiftTypeDrawer
                                    visible={shiftTypeModal}
                                    close={()=>setShiftTypeModal(!shiftTypeModal)}
                                />

                            </div>
                        </TabPane>

                        <TabPane tab={`Summary Shift Type`} key="2" >
                            <div>
                                
                                <div style={{display:'flex', justifyContent:'flex-end', width:'100%'}}>
                                    <button className="drawer-filled-btn" onClick={()=>setSummartShiftTypeModal(!summaryShiftTypeModal)}>
                                        Add Summary Shift Type
                                    </button>
                                </div>  

                                {/* subscription main body cards */}
                                <div className="propertyTab"></div>

                                <Table 
                                    columns={[
                                        {title:'Name', dataIndex:'name', key:'name'},
                                        {title:'Description', dataIndex: 'description', key:'description'},
                                        {title:'Reporting Hour', dataIndex:'reportinghour', key: 'reportinghour'},
                                    ]}
                                
                                />

                                <SummaryShiftTypeDrawer
                                    visible={summaryShiftTypeModal}
                                    close={()=>setSummartShiftTypeModal(!summaryShiftTypeModal)}
                                />

                            </div>
                        </TabPane>
                        
                        <TabPane tab={`Shift Type Mapping`} key="3" >
                            <div>

                                {/* subscription main body cards */}
                                <div className="propertyTab"></div>
                                <div className='h4'>Shift type mapping</div>

                            </div>
                        </TabPane>

                    </Tabs>


                </div> 

                             
            </div>
        </div>
        
    )
}