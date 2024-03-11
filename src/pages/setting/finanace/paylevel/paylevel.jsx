import { useState } from "react";
import { faArrowsSpin, faClose, faSearch, faTowerBroadcast } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input, Table, Tabs } from "antd"
import TabPane from "antd/es/tabs/TabPane"
import { NewPayLevelDrawer } from "./newPayLevel.drawer";
import { useMutation, useQuery } from "@apollo/client";
import { getPayLevelQuery } from "../../../../util/query/paylevel.query";
import { deletePayLevelMutation } from "../../../../util/mutation/paylevel.mutation";

export const PayLevel = ({themeData})=>{


    const [searchInput, setSearchInput] = useState("");
    const [newPayLevelModal, setNewPayLevelModal] = useState(false);
    const [editPayLevel, setEditPayLevel] = useState({});
    const [deletePayLevel, {loading}] = useMutation(deletePayLevelMutation);
    
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key:'name',
            width:'50%',
            
            ellipsis:true,
            render: (_, record) => {
              const showActions = hoveredRow === record.key;
              return (          
                  <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
                      {record?.name}
                      {showActions &&
                      <div style={{width:'auto', display:'flex', justifyContent:'flex-start' ,alignItems:'center', columnGap:'10px'}}>
                      
                          <button className={"grid-sm-btn"} type="link" onClick={() => { setEditPayLevel(record); setNewPayLevelModal(true);}}>
                              Edit
                          </button>
      
                          <button className={"grid-sm-btn"} type="link" onClick={async() => {  await deletePayLevel({variables:{deletePayLevelId:record?._id}}); await refetch(); }}>
                              Delete
                          </button>
                          
      
                      </div>
                      }
      
                  </div>
              );
            },
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code'
        }
    ];


    const {data: payLevel, loading: payLevelLoading, refetch} = useQuery(getPayLevelQuery,{
        fetchPolicy: 'network-only',
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
    

    return(
        <div className='setting-body'>
            <div className='setting-body-inner'>
                <div className="setting-body-inner">
                    <div className="setting-body-title">
                        <div className='setting-body-inner-title'>
                            Pay Level
                        </div>
                    </div>

                    <div className="text">
                        Define clear payment tiers within the pay level module, aligning compensation with roles and responsibilities for a transparent and equitable remuneration structure.
                    </div>


                    {/* body */}

                    <div className="propertyTab"></div>
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab={`Pay Level`} key="1" >
                            <div>
                                {/* search header */}
                                <div style={{display:'flex', justifyContent:'flex-end', alignItems:'center'}}>
                                        {/* <Input type="text" 
                                            style={{width:'250px'}} 
                                            className='generic-input-control' 
                                            placeholder="Search pay level"
                                            onChange={(e)=>setSearchInput(e.target.value)}
                                            value={searchInput}
                                            autoComplete="off"
                                            suffix={searchInput? 
                                            <FontAwesomeIcon style={{color:'#7c98b6', cursor:'pointer', fontSize: '20px'}} onClick={()=>{setSearchInput('');}} icon={faClose}/> : 
                                            <FontAwesomeIcon style={{color:'#0091ae'}} icon={faSearch}/> }
                                        /> */}
                                        <button className="drawer-filled-btn" onClick={()=>setNewPayLevelModal(!newPayLevelModal)}>Add Pay Level</button>
                                </div>

                                {/* subscription main body cards */}
                                <div className="propertyTab"></div>
                                <Table
                                    columns={columns}
                                    dataSource={payLevel?.getPayLevel?.response?.map((payLevel)=>({key:payLevel?._id, ...payLevel}))}
                                        
                                    onRow={(record) => ({
                                        onMouseEnter: () => handleRowMouseEnter(record),
                                        onMouseLeave: () => handleRowMouseLeave(),
                                    })}
                                    rowClassName={rowClassName}
                                />

                                {/* add new paylevel drawer */}
                                <NewPayLevelDrawer
                                    visible={newPayLevelModal}
                                    close={()=>setNewPayLevelModal(!newPayLevelModal)}
                                    refetch={refetch}
                                    editPayLevel={editPayLevel}
                                />

                            </div>
                        </TabPane>
                    </Tabs>


                </div> 

                             
            </div>
        </div>
        
    )
}