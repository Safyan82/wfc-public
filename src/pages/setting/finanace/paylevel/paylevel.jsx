import { useState } from "react";
import { faArrowsSpin, faClose, faSearch, faTowerBroadcast } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input, Table, Tabs } from "antd"
import TabPane from "antd/es/tabs/TabPane"
import { NewPayLevelDrawer } from "./newPayLevel.drawer";

export const PayLevel = ({themeData})=>{


    const [searchInput, setSearchInput] = useState("");
    
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key:'name'
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code'
        }
    ];

    const [newPayLevelModal, setNewPayLevelModal] = useState(false);


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
                                    dataSource={[{name:'Test', code: 't'},]}
                                />

                                {/* add new paylevel drawer */}
                                <NewPayLevelDrawer
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