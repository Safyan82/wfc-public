import { useQuery } from "@apollo/client";
import { Col, Row } from "antd";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AgencyDetailPageLeftSideBar } from "./component/leftSidebar";
import { SiteGroupPostSection } from "./component/middleSection";
import { getSingleAgency } from "../../../util/query/agency.query";
import { AgencyPayTable } from "../agencypayTable/agencyPayTable";

export const AgencyDetailPage = ()=>{

    const navigate = useNavigate();

    const agencytabs = {
        GENERAL: 'General',
        PAYTABLE: 'Pay Table',
        NOTES: 'Notes',
    };

    const [activeTab, setActiveTab] = useState(agencytabs.GENERAL);
    const param = useParams();

    // site group details
    const {data: singleAgency, loading: singleAgencyLoading, refetch} = useQuery(getSingleAgency,{fetchPolicy: 'cache-and-network',
        variables: {
            id: param?.id
        }
    });


    const [agency, setAgency] = useState({});

    useEffect(()=>{
        if(!singleAgencyLoading){
            const {agencyname, metadata} = singleAgency?.agency;
            setAgency({agencyname, ...metadata});
        }
    },[singleAgency,singleAgencyLoading]);

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
                        {singleAgency?.agencyname}
                    </div>
                </div>

                {/* navigation tabs */}
                <div style={{display:'flex', alignItems:'center', gap:'50px', justifyContent:'center', width:'100%'}}>
                    {Object.values(agencytabs)?.map((tab)=>(
                        <div className={activeTab==tab? 'emp-menubar emp-menubar-active': 'emp-menubar'} onClick={()=>setActiveTab(tab)}>{tab}</div>
                    ))}
                </div>

                <div style={{width:'50%'}}></div>

            </div>

            <div style={{padding:'50px 5px 5px 5px'}}>
                {
                    activeTab==agencytabs?.GENERAL?
                    <Row>
                        <Col span={6}>
                            <AgencyDetailPageLeftSideBar
                                agency={agency}
                                loading={singleAgencyLoading}
                            />
                        </Col>

                        <Col span={18}>
                            <SiteGroupPostSection/>
                        </Col>
                    </Row>
                    :
                    activeTab==agencytabs?.PAYTABLE?
                    <Row>
                        <Col span={6}>
                            <AgencyDetailPageLeftSideBar
                                agency={agency}
                                loading={singleAgencyLoading}
                            />
                        </Col>

                        <Col span={18}>
                            <AgencyPayTable id={param?.id}/>
                        </Col>
                    </Row>
                    :null
                
                }
            </div>

        </div>
    )
};