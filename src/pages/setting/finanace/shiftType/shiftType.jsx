import React, { useContext, useEffect, useRef, useState } from 'react';
import { Tabs, Form, Input, Popconfirm, Table } from 'antd';
import TabPane from "antd/es/tabs/TabPane";
import { SummaryShiftTypeDrawer } from './summaryShiftType.drawer';
import { ShiftTypeDrawer } from './shiftType.drawer';
import { useMutation, useQuery } from '@apollo/client';
import { getSummaryShiftTypeQuery } from '../../../../util/query/summaryShiftType.query';
import { deleteSummaryShiftTypeMutation } from '../../../../util/mutation/summaryshiftType.mutation';
import { deleteShiftTypeMutation } from '../../../../util/mutation/shiftType.mutation';
import { shiftTypeQuery } from '../../../../util/query/shiftType.query';


export const ShiftType = ({themeData})=>{

    const [shiftTypeModal, setShiftTypeModal] = useState(false);
    const [summaryShiftTypeModal, setSummaryShiftTypeModal] = useState(false);
    const {data: summaryShiftType, loading: summaryShiftTypeLoading, refetch: refetchSummaryShiftType} = useQuery(getSummaryShiftTypeQuery,{
        fetchPolicy: 'network-only'
    });


    const [hoveredRow, setHoveredRow] = useState("");

    const rowClassName = (record) => {
        return record.key === hoveredRow ? 'hovered-row' : '';
    };
      
    const handleRowMouseEnter = (record) => {
        setHoveredRow(record.key);
        console.log(record.key);
    };


    const handleRowMouseLeave = () => {
        setHoveredRow(null);
    };
    
    const [summaryShiftTypeEdit, setSummaryShiftTypeEdit] = useState();
    const [deleteSummaryShiftType, {loading: deleteSummaryShiftTypeLoading}] = useMutation(deleteSummaryShiftTypeMutation);

    const [deleteShiftType, {loading: deleteShiftTypeLoading}] = useMutation(deleteShiftTypeMutation);
    const [shiftTypeEdit, setShiftTypeEdit] = useState({});

    const {data: shiftTypeData, loading: shiftTypeDataLoading, refetch: refetchShiftType} = useQuery(shiftTypeQuery);
    console.log(shiftTypeData?.getShiftType?.response, "refetchShiftType");

    return(
        <div className='setting-body'>
            <div className='setting-body-inner'>
                <div className="setting-body-inner">
                    <div className="setting-body-title">
                        <div className='setting-body-inner-title'>
                            Hour Type
                        </div>
                    </div>

                    <div className="text">
                        Pay and bill columns as well as Pay levels are settled in PayTable. 
                        <i> To make changes please review</i> <b>Pay & Bill Columns</b> or <b> Pay Level </b>
                    </div>


                    {/* body */}

                    <div className="propertyTab"></div>
                    <Tabs defaultActiveKey="1" >

                        <TabPane tab={`Hour Type`} key="1" >
                            <div>
                                
                                <div style={{display:'flex', justifyContent:'flex-end', width:'100%'}}>
                                    <button className="drawer-filled-btn" 
                                        onClick={()=>setShiftTypeModal(!shiftTypeModal)}
                                    >Add Hour Type</button>
                                </div>  

                                {/* subscription main body cards */}
                                <div className="propertyTab"></div>

                                <Table 
                                    columns={[
                                        {title:'name', dataIndex:'name',                                           
                                            ellipsis:true,
                                            width:'350px',
                                            render: (_, record) => {
                                          const showActions = hoveredRow === record.key;
                                          return (          
                                              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                                                  <div style={{width:'100px', overflow:'ellipsis'}}>
                                                    {record?.name}
                                                  </div>
                                                  {showActions &&
                                                  <div style={{width:'auto', display:'flex' ,alignItems:'center', columnGap:'10px'}}>
                                                  
                                                      <button className={"grid-sm-btn"} type="link" onClick={() => { setShiftTypeEdit(record); setShiftTypeModal(true);}}>
                                                          Edit
                                                      </button>
                                  
                                                      <button className={"grid-sm-btn"} type="link" onClick={async() => {  await deleteShiftType({variables:{input:{_id:record?._id}}}); await refetchShiftType(); }}>
                                                          Delete
                                                      </button>
                                                      
                                  
                                                  </div>
                                                  }
                                  
                                              </div>
                                          );
                                            } 
                                        }, 
                                        {title:'description', dataIndex:'description'},
                                        {title:'summary hour type', dataIndex:'summaryShiftType', width:'10%'}, 
                                        {title:'pay code', dataIndex:'payCode'}, {title:'pay column', dataIndex:'paycolumn'},
                                        {title:'pay method', dataIndex:'payMethod'},
                                        {title:'pay multiplier', dataIndex:'payMultiplier'}, 
                                        {title:'bill code', dataIndex:'billCode'}, {title:'bill column', dataIndex:'billcolumn'},
                                        {title:'bill method', dataIndex:'billMethod'},
                                        {title:'bill multiplier', dataIndex:'billMultiplier'}, 
                                    ]}

                                    dataSource={shiftTypeData?.getShiftType?.response?.map((shiftType)=>({
                                        ...shiftType,
                                        paycolumn: shiftType?.payColumnDetail[0]?.columnName,
                                        biillcolumn: shiftType?.billColumnDetail[0]?.columnName,
                                        summaryShiftType: shiftType?.summaryShiftType[0]?.name,
                                        key: shiftType?._id

                                    }))}
                                    
                                    onRow={(record) => ({
                                        onMouseEnter: () => handleRowMouseEnter(record),
                                        onMouseLeave: () => handleRowMouseLeave(),
                                    })}
                                    rowClassName={rowClassName}
                                />

                                {shiftTypeModal &&
                                    <ShiftTypeDrawer
                                        visible={shiftTypeModal}
                                        close={()=>{setShiftTypeModal(!shiftTypeModal); setShiftTypeEdit({});}}
                                        summaryShiftType = {summaryShiftType?.getSummaryShiftType?.response}
                                        shiftTyprefetch={refetchShiftType}
                                        shiftTypeEdit={shiftTypeEdit}
                                    />
                                }

                            </div>
                        </TabPane>

                        <TabPane tab={`Summary Hour Type`} key="2" >
                            <div>
                                
                                <div style={{display:'flex', justifyContent:'flex-end', width:'100%'}}>
                                    <button className="drawer-filled-btn" onClick={()=>setSummaryShiftTypeModal(!summaryShiftTypeModal)}>
                                        Add Summary Hour Type
                                    </button>
                                </div>  

                                {/* subscription main body cards */}
                                <div className="propertyTab"></div>

                                <Table 
                                    columns={[
                                        {title:'Name', dataIndex:'name', key:'name',
                                        width:'50%',
            
                                        ellipsis:true,
                                        render: (_, record) => {
                                          const showActions = hoveredRow === record.key;
                                          return (          
                                              <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
                                                  {record?.name}
                                                  {showActions &&
                                                  <div style={{width:'auto', display:'flex', justifyContent:'flex-start' ,alignItems:'center', columnGap:'10px'}}>
                                                  
                                                      <button className={"grid-sm-btn"} type="link" onClick={() => { setSummaryShiftTypeEdit(record); setSummaryShiftTypeModal(true);}}>
                                                          Edit
                                                      </button>
                                  
                                                      <button className={"grid-sm-btn"} type="link" onClick={async() => {  await deleteSummaryShiftType({variables:{input:{_id:record?._id}}}); await refetchSummaryShiftType(); }}>
                                                          Delete
                                                      </button>
                                                      
                                  
                                                  </div>
                                                  }
                                  
                                              </div>
                                          );
                                        }
                                        },
                                        {title:'Description', dataIndex: 'description', key:'description'},
                                        {title:'Reporting Hour', dataIndex:'reporthour', key: 'reportinghour'},
                                    ]}
                                    dataSource={summaryShiftType?.getSummaryShiftType?.response?.map((summaryShift)=> ({...summaryShift, key: summaryShift?._id}))}
                                        
                                    onRow={(record) => ({
                                        onMouseEnter: () => handleRowMouseEnter(record),
                                        onMouseLeave: () => handleRowMouseLeave(),
                                    })}
                                    rowClassName={rowClassName}
                                />
                                {summaryShiftTypeModal &&
                                    <SummaryShiftTypeDrawer
                                        visible={summaryShiftTypeModal}
                                        close={()=>{setSummaryShiftTypeModal(!summaryShiftTypeModal); setSummaryShiftTypeEdit({})}}
                                        refetchSummaryShiftType={refetchSummaryShiftType}
                                        summaryShiftTypeEdit={summaryShiftTypeEdit}
                                    />
                                }

                            </div>
                        </TabPane>
                        
                        <TabPane tab={`Hour Type Mapping`} key="3" >
                            <div>

                                {/* subscription main body cards */}
                                <div className="propertyTab"></div>
                                <div className='h4'>Hour type mapping</div>

                            </div>
                        </TabPane>

                    </Tabs>


                </div> 

                             
            </div>
        </div>
        
    )
}