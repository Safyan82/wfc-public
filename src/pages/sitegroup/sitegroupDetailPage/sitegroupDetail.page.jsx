import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSiteGroup } from "../../../util/query/siteGroup.query";
import { useQuery } from "@apollo/client";
import { Col, Row } from "antd";
import { SiteGroupDetailPageLeftSideBar } from "./component/leftSidebar";
import { SiteGroupPostSection } from "./component/middleSection";

export const SiteGroupDetailPage = ()=>{

    const navigate = useNavigate();

    const siteGrouptabs = {
        GENERAL: 'General',
        PAYTABLE: 'Pay Table',
        NOTIFICATIONS: 'Notifications',
        HOLIDAYS: 'Holidays',
        SHIFTTYPEMAPPING: 'Shift Type Mapping'
    };

    const [activeTab, setActiveTab] = useState(siteGrouptabs.GENERAL);
    const param = useParams();

    // site group details
    const {data: siteGroupData, loading: siteGroupLoading, refetch} = useQuery(getSiteGroup,{fetchPolicy: 'cache-and-network',
        variables: {
            id: param?.id
        }
    });

    const [siteGroup, setSiteGroup] = useState({});

    useEffect(()=>{
        if(!siteGroupLoading){
            const {sitegroupname, metadata} = siteGroupData?.siteGroup;
            setSiteGroup({sitegroupname, ...metadata});
            console.log(siteGroupData?.siteGroup, "siteeee")
        }
    },[siteGroupData,siteGroupLoading]);

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
                        {siteGroup?.sitegroupname}
                    </div>
                </div>

                {/* navigation tabs */}
                <div style={{display:'flex', alignItems:'center', gap:'50px', justifyContent:'center', width:'100%'}}>
                    {Object.values(siteGrouptabs)?.map((tab)=>(
                        <div className={activeTab==tab? 'emp-menubar emp-menubar-active': 'emp-menubar'} onClick={()=>setActiveTab(tab)}>{tab}</div>
                    ))}
                </div>

                <div style={{width:'50%'}}></div>

            </div>

            <div style={{padding:'50px 5px 5px 5px'}}>
                {
                    activeTab==siteGrouptabs?.GENERAL?
                    <Row>
                        <Col span={6}>
                            <SiteGroupDetailPageLeftSideBar
                                siteGroup={siteGroup}
                                loading={siteGroupLoading}
                            />
                        </Col>

                        <Col span={18}>
                            <SiteGroupPostSection/>
                        </Col>
                    </Row>
                    :null
                
                }
            </div>

        </div>
    )
};