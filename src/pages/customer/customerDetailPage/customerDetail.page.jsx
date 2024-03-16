import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSiteGroup } from "../../../util/query/siteGroup.query";
import { useQuery } from "@apollo/client";
import { Col, Row } from "antd";
import { CustomerDetailPageLeftSideBar, SiteGroupDetailPageLeftSideBar } from "./component/leftSidebar";
import { SiteGroupPostSection } from "./component/middleSection";
import { getSingleCustomerQuery } from "../../../util/query/customer.query";
import { CustomerPayTable } from "../customerpayTable/customerPayTable";

export const CustomerDetailPage = ()=>{

    const navigate = useNavigate();

    const customertabs = {
        GENERAL: 'General',
        PAYTABLE: 'Pay Table',
        NOTES: 'Notes',
    };

    const [activeTab, setActiveTab] = useState(customertabs.GENERAL);
    const param = useParams();

    // site group details
    const {data: singleCustomer, loading: singleCustomerLoading, refetch} = useQuery(getSingleCustomerQuery,{fetchPolicy: 'cache-and-network',
        variables: {
            id: param?.id
        }
    });

    const [customer, setCustomer] = useState({});

    useEffect(()=>{
        if(!singleCustomerLoading){
            const {customername, metadata} = singleCustomer?.customer;
            setCustomer({customername, ...metadata});
        }
    },[singleCustomer,singleCustomerLoading]);

    return(
        <div>
            {/* site group tabs */}

            <div style={{background: 'rgb(245, 248, 250)', padding: '15px 45px 7px 15px', display:'flex', gap:50, alignItems: 'center', position: 'fixed',  width: '100%', zIndex: '996'}}>
                
                {/* back + user name btn */}
                <div style={{display:'flex', alignItems:'center', gap:'25px', paddingBottom:'8px', width:'50%'}}>

                    <div onClick={()=>navigate(-1)} >
                        <FontAwesomeIcon className='left-chevron-icon' icon={faChevronLeft}/> <span className='text-deco' style={{left: '5%', position: 'relative', fontSize:'14px'}}>Back</span> 
                    </div>

                    <div style={{fontSize:'14px'}}>
                        {singleCustomer?.customername}
                    </div>
                </div>

                {/* navigation tabs */}
                <div style={{display:'flex', alignItems:'center', gap:'50px', justifyContent:'center', width:'100%'}}>
                    {Object.values(customertabs)?.map((tab)=>(
                        <div className={activeTab==tab? 'emp-menubar emp-menubar-active': 'emp-menubar'} onClick={()=>setActiveTab(tab)}>{tab}</div>
                    ))}
                </div>

                <div style={{width:'50%'}}></div>

            </div>

            <div style={{padding:'50px 5px 5px 5px'}}>
                {
                    activeTab==customertabs?.GENERAL?
                    <Row>
                        <Col span={6}>
                            <CustomerDetailPageLeftSideBar
                                customer={customer}
                                loading={singleCustomerLoading}
                            />
                        </Col>

                        <Col span={18}>
                            <SiteGroupPostSection/>
                        </Col>
                    </Row>
                    :
                    activeTab==customertabs?.PAYTABLE?
                    <Row>
                        <Col span={6}>
                            <CustomerDetailPageLeftSideBar
                                customer={customer}
                                loading={singleCustomerLoading}
                            />
                        </Col>

                        <Col span={18}>
                            <CustomerPayTable />
                        </Col>
                    </Row>
                    :null
                
                }
            </div>

        </div>
    )
};