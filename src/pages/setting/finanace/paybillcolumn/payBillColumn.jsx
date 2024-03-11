import { useState } from "react";
import { Table, Tabs } from "antd"
import TabPane from "antd/es/tabs/TabPane"
import { NewPayBillColumnDrawer } from "./newPayBillColumn.drawer";
import { useMutation, useQuery } from "@apollo/client";
import { getPayandBillColumnQuery } from "@src/util/query/payandbillColumn.query";
import { deletePayandBillColumnMutation } from "@src/util/mutation/payandbillColumn.mutation";
import Spinner from "@src/components/spinner";

export const PayBillColumn = ({themeData})=>{


    const [editColumn, setEditColumn] = useState({});
    const [deletePayandBillColumn, {loading: deletePayandBillColumnLoading}] = useMutation(deletePayandBillColumnMutation);
    
    const columns = [
        {
            title: 'Name',
            dataIndex: 'columnName',
            key:'name',
            width:'50%',
            
      ellipsis:true,
      render: (_, record) => {
        const showActions = hoveredRow === record.key;
        return (          
            <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
                {record?.columnName}
                {showActions &&
                <div style={{width:'auto', display:'flex', justifyContent:'flex-start' ,alignItems:'center', columnGap:'10px'}}>
                
                    <button className={"grid-sm-btn"} type="link" onClick={() => { setEditColumn(record); setNewPayLevelModal(true);}}>
                        Edit
                    </button>

                    <button className={"grid-sm-btn"} type="link" onClick={async() => {  await deletePayandBillColumn({variables:{deletePayandBillCoulmnId:record?._id}}); await refetch(); }}>
                        Delete
                    </button>
                    

                </div>
                }

            </div>
        );
      },
        },
        {
            title: 'Column ORDER',
            dataIndex: 'columnOrder',
            key: 'columnOrder'
        }
    ];

    const [newPayLevelModal, setNewPayLevelModal] = useState(false);

    const {data, loading:getPayandBillColumnLoading, refetch} = useQuery(getPayandBillColumnQuery);

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
    


    return(
        <div className='setting-body'>
            <div className='setting-body-inner'>
                <div className="setting-body-inner">
                    <div className="setting-body-title">
                        <div className='setting-body-inner-title'>
                            Pay and Bill Column
                        </div>
                    </div>

                    <div className="text">
                        Pay and Bill columns will be settle in shift type and pay table.
                    </div>


                    {/* body */}

                    <div className="propertyTab"></div>
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab={`Pay & Bill Columns`} key="1" >
                            <div>
                                {/* search header */}
                                <div style={{display:'flex', justifyContent:'flex-end', alignItems:'center'}}>
                                        <button className="drawer-filled-btn" onClick={()=>{ setNewPayLevelModal(!newPayLevelModal); setEditColumn({}); }}>Add</button>
                                </div>

                                {/* subscription main body cards */}
                                <div className="propertyTab"></div>
                                {
                                    deletePayandBillColumnLoading?
                                    <Spinner />

                                    :
                                    
                                    <Table
                                        columns={columns}
                                        dataSource={data?.getPayandBillColumn?.response?.map((data)=>({key:data?._id, ...data}))}
                                        
                                        onRow={(record) => ({
                                            onMouseEnter: () => handleRowMouseEnter(record),
                                            onMouseLeave: () => handleRowMouseLeave(),
                                        })}
                                        rowClassName={rowClassName}
                                    />
                                }

                                {/* add new paylevel drawer */}
                                <NewPayBillColumnDrawer
                                    visible={newPayLevelModal}
                                    close={()=>setNewPayLevelModal(!newPayLevelModal)}
                                    refetch={refetch}
                                    editColumn={editColumn}
                                    setEditColumn={setEditColumn}
                                    
                                />

                            </div>
                        </TabPane>
                    </Tabs>


                </div> 

                             
            </div>
        </div>
        
    )
}