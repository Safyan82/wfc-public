import "./billingService.css";
import { useState } from "react";
import { faArrowsSpin, faClose, faSearch, faTowerBroadcast } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input, Tabs } from "antd"
import TabPane from "antd/es/tabs/TabPane"

export const BillingServices = ({themeData})=>{


    const [searchInput, setSearchInput] = useState("");


    return(
        <div className='setting-body'>
            <div className='setting-body-inner'>
                <div className="setting-body-inner">
                    <div className="setting-body-title">
                        <div className='setting-body-inner-title'>
                            Services
                        </div>
                    </div>

                    <div className="text">
                        Enhance your experience with our premium add-on services, tailored to elevate and optimize your service package.
                    </div>


                    {/* body */}

                    <div className="propertyTab"></div>
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab={`Subscriptions`} key="1" >
                            <div>
                                {/* search header */}
                                <div style={{display:'flex', justifyContent:'flex-end'}}>
                                        <Input type="text" 
                                            style={{width:'250px'}} 
                                            className='generic-input-control' 
                                            placeholder="Search subscriptions"
                                            onChange={(e)=>setSearchInput(e.target.value)}
                                            value={searchInput}
                                            autoComplete="off"
                                            suffix={searchInput? 
                                            <FontAwesomeIcon style={{color:'#7c98b6', cursor:'pointer', fontSize: '20px'}} onClick={()=>{setSearchInput('');}} icon={faClose}/> : 
                                            <FontAwesomeIcon style={{color:'#0091ae'}} icon={faSearch}/> }
                                        />
                                </div>

                                {/* subscription main body cards */}

                                <div className="services">

                                        <div className="service-card">
                                            
                                            <div className="service-card-icon">
                                                <FontAwesomeIcon style={{color: localStorage.getItem("color") || themeData?.getThemeByUserId?.color}} icon={faTowerBroadcast} />
                                            </div>

                                        </div>
                                </div>


                            </div>
                        </TabPane>
                    </Tabs>


                </div> 

                             
            </div>
        </div>
        
    )
}