import './leftsidebar.css';
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered, faCalendarDay, faCheck, faChevronLeft, faClose, faCross, faDesktop, faEllipsis, faHandHolding, faHandHoldingHand, faList, faList12, faListDots, faPaw, faPen, faPencil, faPhone, faTasks, faTasksAlt } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Popover, Collapse, Panel, Form, Input, Select, Badge, Checkbox, Skeleton } from 'antd';
import { faBuilding, faCalendar, faCalendarAlt, faCalendarDays, faCopy, faEnvelope, faMeh, faNoteSticky, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import {    EditOutlined, CopyOutlined, CopyTwoTone, PhoneOutlined, EllipsisOutlined, CalendarOutlined, MediumWorkmarkOutlined, TableOutlined, TagsOutlined, ContainerOutlined, RedEnvelopeOutlined, MailOutlined, FormOutlined } from '@ant-design/icons';
import { GetBranchObject, getSingleBranch } from '../../../util/query/branch.query';
import { useQuery } from '@apollo/client';
import PhoneInput from 'react-phone-input-2';
import { useNavigate } from 'react-router-dom';
import { BranchViewForSpecificUser } from '../../../util/query/branchView.query';
import { useDispatch } from 'react-redux';
import { resetDataFieldForNewView } from '../../../middleware/redux/reducers/branchData.reducer';
import Spinner from '../../../components/spinner';
import { PropertyDetailDrawer } from '../../allProperties/propertyDetail.drawer';
import { getUserEmployeeDetailView } from '../../../util/query/employeeDetailView.query';
import { getEmployeePropHistoryQuery } from '../../../util/query/employee.query';

export const DetailPageLeftSideBar = ({employeeObject, singleEmployee, loading, handelInputChange})=>{
  
    const [phoneNumber, setPhoneNumber] = useState();

    const phoneInputRef = useRef(null);

    const [isAction, setAction] = useState(false);
    const containerRef = useRef(null);

    const {data: employeeDetailViewData, loading: employeeDetailViewLoading, refetch: employeeDetailViewRefetch} = useQuery(getUserEmployeeDetailView,{
        variables:{
            createdBy: "M Safyan",
            createdFor: singleEmployee?._id,
        },
        fetchPolicy: 'network-only'
    });

    const [viewProperties, setViewProperties] = useState([]);
    useEffect(()=>{
        if(employeeDetailViewData?.getUserEmployeeDetailView?.response){
            
            const view = employeeDetailViewData?.getUserEmployeeDetailView?.response?.properties?.filter((prop)=>(
                employeeObject?.find(prp => prp.propertyId== prop)));
                
                setViewProperties(view?.map((prop)=>{
                const property = employeeObject?.find(prp => prp.propertyId == prop)
                return {
                    _id: property?.propertyId,
                    ...property
                }
            }));

            console.log(employeeObject, "employeeObject", view);


        }
    },[employeeDetailViewData?.getUserEmployeeDetailView?.response, employeeObject]);

    
    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setAction(false);
        }
      };
  
      document.addEventListener('click', handleOutsideClick);
  
      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }, []);

    const navigate = useNavigate();

    const [propertyDetailDrawer, setPropertyDetailDrawer] = useState(false);

    const [selectedProp, setSelectedProp] = useState();
    
    const {data: employeeProp, loading: employeePropLoading, error} = useQuery(getEmployeePropHistoryQuery,{
        variables:{
            input: {
                propertyId: selectedProp?.propertyId,
                employeeId: singleEmployee?._id
            }
        },
        skip: !selectedProp?.propertyId || !singleEmployee?._id,
        fetchPolicy: 'network-only'
    });

    return(
        <div className='sidebar-wrapper'>
            <div className='leftsidebar'>

                <div className="header-navigator">
                    <div onClick={()=>navigate(-1)}>
                        <FontAwesomeIcon className='left-chevron-icon' icon={faChevronLeft}/> <span className='text-deco' style={{left: '5%', position: 'relative'}}>Employee</span> 
                    </div>

                    <div className="dropdown" ref={containerRef}>

                        <span className='text-deco' onClick={()=>setAction(!isAction)}>Actions<span className='caret'></span></span> 
                        
                        <div  className="dropdown-content dropdown-content-prev" style={isAction ? {display:'block'}: {display:'none'}}>
                            <a href="" onClick={(e)=>{ e.preventDefault(); }}>
                                Edit view
                            </a>
                            <a href="" onClick={(e)=>{ e.preventDefault(); navigate("/user/employee-detail-view/"+singleEmployee?._id)}}>
                                Edit data fields
                            </a>
                            <a href="" onClick={(e)=>{ e.preventDefault(); navigate(`/user/employee-prop-history/`+singleEmployee?._id)}}>
                                Audit log
                            </a>
                            <a href="" onClick={(e)=>{ e.preventDefault(); }}>
                                Generate report
                            </a>
                        </div>
                    </div>
                </div>

                <div className='side-intro'>
                    {singleEmployee?
                    <>
                    <div style={{height:'70px', width: '70px'}}>
                        <Avatar size={69} style={{ background: 'rgb(81, 111, 144, 0.15)' }}>
                            <FontAwesomeIcon 
                                icon={faBuilding} 
                                />
                        </Avatar>
                    </div>
                    
                    <div className='text-head'>
                        <span className='text-title'>{singleEmployee?.firstname+" "+singleEmployee?.lastname}</span>

                        <span className='text-subtitle'>

                            <span style={{textTransform:'lowercase', fontSize:'1em'}}>{singleEmployee?.metadata?.email} </span>   
                            <Popover
                                content={"Copy to clipboard"}
                            >
                                <CopyOutlined
                                    className='iconHover copy-icon'
                                    style={{    
                                        marginLeft: '10%',
                                        cursor: 'pointer',
                                    }}
                                /> 
                            </Popover>

                        </span>
                    </div>
                    </>
                    : 
                    <div className='skeleton-custom'>

                    <Skeleton.Avatar active size={69} />
                    <Skeleton className='text-head' active/>
                    </div>
                    }
                </div>

                <div className="activity-btn-grp">
                    <Popover
                        content={"Create a note"}
                    >
                        <span>

                            <button>
                                <FormOutlined icon={faPenToSquare} />
                            </button>
                            <span className='tiny-text'>Note</span>
                        </span>
                    </Popover>

                    <Popover
                        content={"Create a post"}
                    >
                        <span>
                            <button>
                                <FontAwesomeIcon icon={faBarsStaggered} />
                            </button>
                            <span className='tiny-text'>Post</span>
                        </span>
                    </Popover>

                    <Popover
                        content={"Make a phone call"}
                    >
                        <span>
                            <button>
                                <PhoneOutlined />
                            </button>
                            <span className='tiny-text'>Call</span>
                        </span>
                    </Popover>

                    <Popover
                        content={"Create a task"}
                    >
                        <span>
                            <button>
                                <ContainerOutlined />
                            </button>
                            <span className='tiny-text'>Task</span>
                        </span>
                    </Popover>
                    
                    <Popover content={"Follow this"} >
                        <span>
                            <button>
                                <FontAwesomeIcon icon={faHandHoldingHand} />
                            </button>
                            <span className='tiny-text'>Follow</span>
                        </span>
                    </Popover>
                </div>

                
            </div>
            <div className="btm-border"></div>

            <Collapse defaultActiveKey={['1']}>
                <Collapse.Panel header="About this branch" key="1" style={{paddingBottom:'28%'}} >
                    {loading ?
                    <div style={{display: 'flex', justifyContent: 'center', paddingTop: '8%'}}>
                        <Spinner/>
                    </div> 
                    :
                    (viewProperties?.length>0? viewProperties:
                    employeeObject)?.map((prop, index)=>{
                        // const defaultVal = singleEmployee[prop?.label?.replaceAll(" ","")?.toLowerCase()] || singleEmployee['metadata'][prop?.label?.replaceAll(" ","")?.toLowerCase()];
                        return(
                            <div className='detailInputParent'>
                                <div className='detailInputHead'>
                                    <span>
                                        {prop?.label}
                                    </span>
                                    <span className={'detail-section'}>
                                        <FontAwesomeIcon icon={faPencil}/>
                                        &emsp;
                                        <button className='grid-sm-btn' type='link' style={{padding: '4px 10px'}} 
                                        onClick={()=>{setPropertyDetailDrawer(true); setSelectedProp({propertyId: prop?._id, propertyName: prop?.label})}}
                                        >Details</button>
                                    </span>

                                </div>
                                
                                <input type="text" 
                                    onChange={(e) => handelInputChange(e.target)} 
                                    name={prop?.label?.replaceAll(" ","")?.toLowerCase()}
                                    defaultValue={singleEmployee?.hasOwnProperty(prop?.label?.replaceAll(" ","")?.toLowerCase())  || singleEmployee['metadata']?.hasOwnProperty(prop?.label?.replaceAll(" ","")?.toLowerCase())? 
                                        singleEmployee[prop?.label?.replaceAll(" ","")?.toLowerCase()] || singleEmployee['metadata'][prop?.label?.replaceAll(" ","")?.toLowerCase()] : ""}  
                                    className={'detailInput-focus'} 
                                />
                                
                               
                            </div>

                        )
                    }) }

                </Collapse.Panel>
            </Collapse>

            <PropertyDetailDrawer
                visible={propertyDetailDrawer}
                selectedProp={selectedProp} 
                clearState={setSelectedProp} 
                loading={employeePropLoading}
                data={employeeProp?.getEmployeePropHistory?.response}
                close={()=>setPropertyDetailDrawer(false)} />
               
        </div>
    );
}