import { useState } from "react";
import { faArrowsSpin, faClose, faSearch, faTowerBroadcast } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input, Table, Tabs } from "antd"
import TabPane from "antd/es/tabs/TabPane"
import { NewPayBillColumnDrawer } from "./newPayBillColumn.drawer";

export const PayBillColumn = ({themeData})=>{


    const [searchInput, setSearchInput] = useState("");
    
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key:'name',
            width:'50%'
        },
        {
            title: 'Column ORDER',
            dataIndex: 'columnOrder',
            key: 'columnOrder'
        }
    ];

    const [newPayLevelModal, setNewPayLevelModal] = useState(false);


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
                                        <button className="drawer-filled-btn" onClick={()=>setNewPayLevelModal(!newPayLevelModal)}>Add</button>
                                </div>

                                {/* subscription main body cards */}
                                <div className="propertyTab"></div>
                                <Table
                                    columns={columns}
                                    dataSource={[{name:'Test', columnOrder: '1'},]}
                                />

                                {/* add new paylevel drawer */}
                                <NewPayBillColumnDrawer
                                    visible={newPayLevelModal}
                                    close={()=>setNewPayLevelModal(!newPayLevelModal)}
                                />

                            </div>
                        </TabPane>
                    </Tabs>


                </div> 

                             
            </div>
        </div>
        
    )
}