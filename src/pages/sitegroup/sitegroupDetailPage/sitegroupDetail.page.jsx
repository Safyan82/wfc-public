import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSiteGroup } from "../../../util/query/siteGroup.query";
import { useQuery } from "@apollo/client";
import { Col, Row } from "antd";
import { SiteGroupDetailPageLeftSideBar } from "./component/leftSidebar";
import { SiteGroupPostSection } from "./component/middleSection";
import { SiteGroupPayTable } from "../sitegroupPayTable/sitegroupPayTable";

export const SiteGroupDetailPage = ()=>{

    const navigate = useNavigate();

    const siteGrouptabs = {
        GENERAL: 'General',
        PAYTABLE: 'Pay Table',
        NOTIFICATIONS: 'Notifications',
        HOLIDAYS: 'Holidays',
        NOTES: 'Notes',
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
            const {sitegroupname, customer, branch, metadata, customerId, branchId} = siteGroupData?.siteGroup?.response;
            setSiteGroup({sitegroupname, customer, branch, customerId, branchId, ...metadata});
        }
    },[siteGroupData,siteGroupLoading]);

    const [isFieldChanged, setIsFieldChanged] = useState(false);
    const [saveUpdate, setSaveUpdate] = useState(false);

    return(
        <>
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
                                setIsFieldChanged={setIsFieldChanged}
                                saveUpdate={saveUpdate}
                                setSaveUpdate={setSaveUpdate}
                                refetch={refetch}
                            />
                        </Col>

                        <Col span={18}>
                            <SiteGroupPostSection/>
                        </Col>
                    </Row>
                    :
                    activeTab===siteGrouptabs?.PAYTABLE?
                    <Row>
                        <Col span={6}>
                            <SiteGroupDetailPageLeftSideBar
                                siteGroup={siteGroup}
                                loading={siteGroupLoading}
                                setIsFieldChanged={setIsFieldChanged}
                                saveUpdate={saveUpdate}
                                setSaveUpdate={setSaveUpdate}
                                refetch={refetch}


                            />
                        </Col>

                        <Col span={18}>
                            <SiteGroupPayTable/>
                        </Col>
                    </Row>
                    : null
                
                }
            </div>

        </div>
        {isFieldChanged>0 ?
            <div className='action-footer'>
                <button disabled={siteGroupLoading} className={siteGroupLoading? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} onClick={()=>setSaveUpdate(true)}>Save</button>
                <button disabled={siteGroupLoading} className={siteGroupLoading? 'disabled-btn drawer-outlined-btn' : 'drawer-outlined-btn'} onClick={async()=> await refetch()}>Cancel</button>
                {
                    <span className='text' style={{margin: 0}}>You've changed field value</span>
                }
            </div>
        : null}
        </>
    )
};