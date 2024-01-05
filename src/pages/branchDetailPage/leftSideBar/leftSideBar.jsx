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
import { GetBranchPropertyHistoryDetail } from '../../../util/query/branchPropHistory';
import { useSelector } from 'react-redux';

export const DetailPageLeftSideBar = ({branchId, singleBranchData, 
    handelInputChange, dataFields, 
    handelScrollbar, branchProperties})=>{

    
    const {data: branchObjectdata , loading: branchObjectLoading} = useQuery(GetBranchObject);

    const {data: branchViewForUser, loading: branchViewForUserLoading, refetch: branchViewForUserRefetch} = useQuery(BranchViewForSpecificUser,{
        variables:{
            createdBy: "M Safyan",
            createdFor: branchId,
        },
        fetchPolicy: 'cache-and-network'
    });

    const [objectData, setObjectData] = useState([]);
    useEffect(()=>{
        // console.log(.includes(), "branchViewForUser?.getUserBranchView?.response?.properties");
        if(!branchObjectLoading && !branchViewForUserLoading){
        branchProperties?.getBranchProperty?.response?.filter((prop)=> prop.propertyId);
            setObjectData(branchProperties?.getBranchProperty?.response?.map((prop)=>({id: prop.propertyId, ...prop.propertyDetail})))
        }
    }, [branchViewForUserLoading, branchObjectLoading]);
  
    const [bioPopover, setBioPopover] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('+44');
    const phoneInputRef = useRef(null);
    const [phoneDialouge, setPhoneDialouge] = useState(false);

    const handleKeyPress = (e) => {
        // Get the current input value
        const inputValue = phoneInputRef.current.state.formattedNumber || '';
        console.log("inputValue", inputValue, inputValue.startsWith('+44'))
        // Check if the backspace key is pressed and the input starts with '+44'
        if (e.key === 'Backspace' && inputValue.startsWith('+44') && inputValue.length <=3) {
          e.preventDefault(); // Prevent the default backspace behavior
          setPhoneNumber('+44'); // Set the input to '+44'
        }
    };


    const [isAction, setAction] = useState(false);
    const containerRef = useRef(null);

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

    const dataFieldRef = useRef();

    const [propertyDetailDrawer, setPropertyDetailDrawer] = useState(false);
    const [selectedProp, setSelectedProp] = useState(null);

    const [filteredView, setFilteredView] = useState();

    useEffect(()=>{
        if(branchViewForUser?.getUserBranchView?.response?.properties?.length>0){
            const view = branchViewForUser?.getUserBranchView?.response?.properties?.filter((prop)=>(
                branchProperties?.getBranchProperty?.response?.find(prp => prp.propertyId== prop)));
            
            setFilteredView(view?.map((prop)=>{
                const property = branchProperties?.getBranchProperty?.response?.find(prp => prp.propertyId == prop)
                return {
                    _id: property?.propertyId,
                    ...property?.propertyDetail
                }
            }))
        }
    },[branchViewForUser]);


    const {data: branchPropertyHistoryDetail, loading, error} = useQuery(GetBranchPropertyHistoryDetail,{
        variables:{
            input: {
                propertyId: selectedProp?.propertyId,
                branchId
            }
        },
        skip: !selectedProp?.propertyId || !branchId,
        fetchPolicy: 'network-only'
    });

    
    const {authenticatedUserDetail} = useSelector(state=>state.userAuthReducer);
    const [readonlyProp, setReadOnlyProp] = useState([]);
    useEffect(()=>{
        let readOnly = [];
        for (const key in authenticatedUserDetail?.permission?.Branch) {
            if (authenticatedUserDetail?.permission?.Branch.hasOwnProperty(key) && authenticatedUserDetail?.permission?.Branch[key].hasOwnProperty('edit')) {
                if(authenticatedUserDetail?.permission?.Branch[key]?.edit==0){

                    readOnly.push(key);
                    
                }
                
            }
        };
        setReadOnlyProp([...readOnly]);
        console.log(readOnly, "readOnly", authenticatedUserDetail?.permission?.Employee);
        // console.log(Object.values(authenticatedUserDetail?.permission?.Employee), "authenticatedUserDetail");
    }, [authenticatedUserDetail]);

    return(
        <div className='sidebar-wrapper' ref={dataFieldRef}>
            <div className='leftsidebar'>

                <div className="header-navigator">
                    <div  onClick={()=>navigate(-1)}>
                        <FontAwesomeIcon className='left-chevron-icon' icon={faChevronLeft}/> <span className='text-deco' style={{left: '20%', position: 'relative'}}>Branch</span> 
                    </div>

                    <div className="dropdown" ref={containerRef}>

                        <span className='text-deco' onClick={()=>setAction(!isAction)}>Actions<span className='caret'></span></span> 
                        
                        <div  className="dropdown-content dropdown-content-prev" style={isAction ? {display:'block'}: {display:'none'}}>
                            <a href="" onClick={(e)=>{ e.preventDefault(); }}>
                                Edit view
                            </a>
                            <a href="" onClick={(e)=>{ e.preventDefault(); navigate("/user/allproperties")}}>
                                Edit data fields
                            </a>
                            <a href="" onClick={(e)=>{ e.preventDefault(); navigate(`/user/prophistory`)}}>
                                Audit log
                            </a>
                            <a href="" onClick={(e)=>{ e.preventDefault(); }}>
                                Generate report
                            </a>
                        </div>
                    </div>
                </div>

                <div className='side-intro'>
                    {singleBranchData?
                    <>
                    <div style={{height:'70px', width: '70px'}}>
                        <Avatar size={69} style={{ background: 'rgb(81, 111, 144, 0.15)' }}>
                            <FontAwesomeIcon 
                                icon={faBuilding} 
                                />
                        </Avatar>
                    </div>
                    
                    <div className='text-head'>
                        <span className='text-title'>{singleBranchData?.branch?.branchname}</span>

                        <span className='text-subtitle'>

                            <span style={{textTransform:'uppercase'}}>{singleBranchData?.branch?.postcode} </span>   
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

                    
                    {/* <Popover
                        trigger={"click"}
                        placement='bottom'
                        overlayClassName='bioPopover'
                        open={bioPopover}
                        content={
                            <div className='bioform'>
                                <div>
                                    <Form.Item>
                                        <label>Branch Name</label>
                                        <Input className='generic-input-control'/>
                                    </Form.Item>
                                    <Form.Item>
                                        <label>Note</label>
                                        <Input.TextArea className='generic-input-control'/>
                                    </Form.Item>

                                </div>
                                <div className="bio-footer">
                                    <button className='middle-note-btn'>Save</button>
                                    <button className='light-btn' onClick={()=>setBioPopover(!bioPopover)}>Cancel</button>
                                </div>
                            </div>
                        }
                    >

                        <FontAwesomeIcon icon={faPencil} 
                            onClick={()=>setBioPopover(!bioPopover)}
                            className='iconHover pen-icon'
                            style={{marginTop:'5px', marginLeft:'30px',color: '#0091ae', cursor: 'pointer', visibility: bioPopover?'visible':'inherit'}}
                        />
                    </Popover> */}

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

                    {/* <Popover content={"More"}>

                        <span>
                            <button>
                                <EllipsisOutlined />
                            </button>
                            <span className='tiny-text'>More</span>
                        </span>
                    </Popover> */}
                </div>

                
            </div>
            <div className="btm-border"></div>

            <Collapse defaultActiveKey={['1']}>
                <Collapse.Panel header="About this branch" key="1" style={{paddingBottom:'28%'}} >
                    {branchViewForUserLoading || branchObjectLoading ?
                    <div style={{display: 'flex', justifyContent: 'center', paddingTop: '8%'}}>
                        <Spinner/>
                    </div> 
                    :
                    (
                        filteredView? filteredView
                        : objectData)?.map((prop, index)=>{
                            console.log(prop, "propprop")
                            const defaultVal = 
                        singleBranchData?.branch?.hasOwnProperty(prop?.label?.replaceAll(" ","")?.toLowerCase())  || (
                            
                            singleBranchData?.branch['metadata']?.hasOwnProperty(prop?.label?.replaceAll(" ","")?.toLowerCase())
                            )? 
                        singleBranchData?.branch[prop?.label?.replaceAll(" ","")?.toLowerCase()] || singleBranchData?.branch['metadata'][prop?.label?.replaceAll(" ","")?.toLowerCase()]
                        : null;


                        return(
                            <div className='detailInputParent' onMouseEnter={
                                (branchViewForUser?.getUserBranchView?.response?.properties?.length>0 ? branchViewForUser?.getUserBranchView?.response?.properties : objectData)?.length - 1 == index ?  
                                handelScrollbar
                                : null
                            }>
                                <div className='detailInputHead'>
                                    <span>
                                        {prop?.label}
                                    </span>
                                    <span className={'detail-section'}>
                                        {prop?.label?.toLowerCase()?.replaceAll(" ", "")=="phonenumber" || prop?.label?.toLowerCase()?.replaceAll(" ", "")=="phone" || prop?.labelprop?.label?.toLowerCase()?.replaceAll(" ","")=="telephone"?
                                        <Popover
                                            placement='right'
                                            trigger={"click"}
                                            open={phoneDialouge}
                                            overlayClassName='phonePopover'
                                            content={
                                                <div className='phonePopover-main'>
                                                    <div className="phonePopover-header">
                                                        <b>Phone number</b>
                                                        <FontAwesomeIcon onClick={()=>setPhoneDialouge(false)} icon={faClose}/>
                                                    </div>
                                                    <div className="phonePopover-body">
                                                        <div className="phonePopover-input">
                                                        <PhoneInput
                                                            country={'gb'}
                                                            onlyCountries={['gb']}
                                                            onChange={setPhoneNumber}
                                                            onKeyDown={handleKeyPress}
                                                            value={phoneNumber}
                                                            ref={phoneInputRef}
                                                            autoFormat={true}
                                                            inputProps={{
                                                                name: 'phone',
                                                                required: true,
                                                                autoFocus: true
                                                            }}
                                                            
                                                        />
                                                            {/* <Select
                                                                suffixIcon={<span className='caret'></span>}
                                                                value={"GB"}
                                                                className='custom-select'
                                                                style={{margin:'0px'}}
                                                            >
                                                                <Select.Option>GB</Select.Option>
                                                            </Select>
                                                            <Input className='generic-input-control' /> */}
                                                        </div>
                                                        <Checkbox>Mark it primary</Checkbox>
                                                    </div>
                                                    <div className="bio-footer">
                                                        <button className='middle-note-btn' onClick={()=>{handelInputChange({name:'phonenumber', value:phoneNumber});setPhoneDialouge(false);}}>Apply</button>
                                                        <button className='light-btn' onClick={()=>setPhoneDialouge(false)}>Cancel</button>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <FontAwesomeIcon onClick={()=>setPhoneDialouge(!phoneDialouge)} icon={faPencil}/>
                                        </Popover>
                                        :
                                        <FontAwesomeIcon icon={faPencil}/>
                                        }&emsp;
                                        <button className='grid-sm-btn' type='link' style={{padding: '4px 10px'}} onClick={()=>{setPropertyDetailDrawer(true); setSelectedProp({propertyId: prop?._id, propertyName: prop?.label})}}>Details</button>
                                    </span>

                                </div>
                                {prop?.label?.toLowerCase()?.replaceAll(" ","")=="phonenumber"?
                                <span>

                                    <span style={{display:'flex'}}>
                                        <input type="text"  
                                            style={{marginBottom:'10%', marginTop:'10%'}}
                                            name="phonenumber"
                                            onClick={()=>setPhoneDialouge(!phoneDialouge)}
                                            defaultValue={defaultVal}
                                            disabled={readonlyProp.includes(prop._id)}
                                            className={readonlyProp.includes(prop._id)? 'disabled-text detailInput' :'detailInput'} 
                                           
                                        />
                                        <code className='primary detail-section'>Primary</code>
                                        {/* <code className='primary detail-section'>
                                            <FontAwesomeIcon icon={faCheck} className='primary-check'/>    Mark as primary
                                        </code> */}
                                    </span>

                                    {/* <span style={{display:'flex'}}>
                                        <input type="text"
                                            className={prop?.label=="Phone Number"? phoneDialouge?'detailInput-focus':'detailInput' : 'detailInput'} 
                                        />
                                        <code className='mark-primary detail-section'>
                                            <FontAwesomeIcon icon={faCheck} className='primary-check'/>    Mark as primary
                                        </code>
                                    
                                    </span> */}
                                   
                                </span>
                                
                                :
                                <input type="text" 
                                    onChange={(e) => handelInputChange(e.target)} 
                                    name={prop?.label?.replaceAll(" ","")?.toLowerCase()}
                                    defaultValue={
                                        singleBranchData?.branch?.hasOwnProperty(prop?.label?.replaceAll(" ","")?.toLowerCase())  || (
                                            singleBranchData?.branch?.hasOwnProperty('metadata') &&
                                            singleBranchData?.branch['metadata']?.hasOwnProperty(prop?.label?.replaceAll(" ","")?.toLowerCase())
                                            )? 
                                        
                                        singleBranchData?.branch[prop?.label?.replaceAll(" ","")?.toLowerCase()] || singleBranchData?.branch['metadata'][prop?.label?.replaceAll(" ","")?.toLowerCase()]
                                        
                                        : null
                                    }  
                                    disabled={readonlyProp.includes(prop._id)}
                                   
                                    className={
                                        dataFields?.find((dprop)=>dprop?.name==prop?.label?.replaceAll(" ","")?.toLowerCase())? 'detailInput-focus':
                                        prop?.label=="Phone Number"? 
                                        phoneDialouge?'detailInput-focus':'detailInput-focus' 
                                        : readonlyProp.includes(prop._id)? 'disabled-text detailInput' :'detailInput'} 
                                />
                                }
                               
                            </div>

                        )
                    }) }



                    {/* Bottom Button */}
                    {/* <div style={{display:'flex', columnGap:'10px', marginTop:'32px', marginBottom:'20px'}}>
                        <button className='simple-btn' title="View all properties" >View all properties</button>
                        <button className='simple-btn' title='View property history'>View property history</button>
                    </div> */}
                </Collapse.Panel>
            </Collapse>
            <PropertyDetailDrawer
                visible={propertyDetailDrawer}
                selectedProp={selectedProp} 
                clearState={setSelectedProp} 
                loading={loading}
                data={branchPropertyHistoryDetail?.getBranchPropHistory?.response}
                close={()=>setPropertyDetailDrawer(false)} />
               
        </div>
    );
}