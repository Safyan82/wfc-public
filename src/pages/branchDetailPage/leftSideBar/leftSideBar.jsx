import React, { useEffect, useRef, useState } from 'react';
import './leftsidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered, faCalendarDay, faCheck, faChevronLeft, faClose, faCross, faDesktop, faEllipsis, faHandHolding, faHandHoldingHand, faList, faList12, faListDots, faPaw, faPen, faPencil, faPhone, faTasks, faTasksAlt } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Popover, Collapse, Panel, Form, Input, Select, Badge, Checkbox } from 'antd';
import { faBuilding, faCalendar, faCalendarAlt, faCalendarDays, faCopy, faEnvelope, faMeh, faNoteSticky, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import {    EditOutlined, CopyOutlined, CopyTwoTone, PhoneOutlined, EllipsisOutlined, CalendarOutlined, MediumWorkmarkOutlined, TableOutlined, TagsOutlined, ContainerOutlined, RedEnvelopeOutlined, MailOutlined, FormOutlined } from '@ant-design/icons';
import { GetBranchObject, getSingleBranch } from '../../../util/query/branch.query';
import { useQuery } from '@apollo/client';
import PhoneInput from 'react-phone-input-2';

export const DetailPageLeftSideBar = ({id})=>{

    const {data: singleBranchData, loading: singleBranchLoading} = useQuery(getSingleBranch,{
        variables:{
            id
        }
    });


    const {data:branchProperties, loading: branchObjectLoading, refetch: branchObjectRefetch} = useQuery(GetBranchObject,{
        fetchPolicy: 'network-only',
    });

    useEffect(()=>{
        console.log(branchProperties?.getBranchProperty?.response)
    }, [branchProperties]);

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



    return(
        <div className='sidebar-wrapper'>
            <div className='leftsidebar'>

                <div className="header-navigator">
                    <div>
                        <FontAwesomeIcon className='left-chevron-icon' icon={faChevronLeft}/> <span className='text-deco' style={{left: '20%', position: 'relative'}}>Branch</span> 
                    </div>
                    <div>
                        <Popover>
                        <span className='text-deco'>Actions<span className='caret'></span></span> 
                        </Popover>
                    </div>
                </div>

                <div className='side-intro'>
                    <>
                    <Avatar size={69} style={{ background: 'rgb(81, 111, 144, 0.15)' }}>
                        <FontAwesomeIcon 
                            icon={faBuilding} 
                        />
                    </Avatar>
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

                    
                    <Popover
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
                    </Popover>

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
                <Collapse.Panel header="About this branch" key="1">
                    
                    {branchProperties?.getBranchProperty?.response?.map((prop)=>{
                        return(
                            <div className='detailInputParent'>
                                <div className='detailInputHead'>
                                    <span>
                                        {prop?.propertyDetail?.label}
                                    </span>
                                    <span className={'detail-section'}>
                                        {prop?.propertyDetail?.label=="Phone Number"?
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
                                                        <button className='middle-note-btn'>Apply</button>
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
                                        <button className='grid-sm-btn' type='link' style={{padding: '4px 10px'}}>Details</button>
                                    </span>

                                </div>
                                {prop?.propertyDetail?.label=="Phone Number"?
                                <span>
                                    <span style={{display:'flex'}}>
                                        <input type="text" defaultValue={"+447904259391"}  
                                        style={{marginBottom:'10%', marginTop:'10%'}}
                                        className={prop?.propertyDetail?.label=="Phone Number"? phoneDialouge?'detailInput-focus':'detailInput' : 'detailInput'} />
                                        <code className='primary detail-section'>Primary</code>
                                    </span>

                                    <span style={{display:'flex'}}>
                                        <input type="text" defaultValue={"+447904259392"}  
                                        className={prop?.propertyDetail?.label=="Phone Number"? phoneDialouge?'detailInput-focus':'detailInput' : 'detailInput'} />
                                        <code className='mark-primary detail-section'>
                                            <FontAwesomeIcon icon={faCheck} className='primary-check'/>    Mark as primary
                                        </code>
                                    
                                    </span>
                                   
                                </span>
                                
                                :
                                <input type="text" defaultValue={singleBranchData?.branch[prop?.propertyDetail?.label.replaceAll(" ","").toLowerCase()] || singleBranchData?.branch['metadata'][prop?.propertyDetail?.label.replaceAll(" ","").toLowerCase()]}  
                                className={prop?.propertyDetail?.label=="Phone Number"? phoneDialouge?'detailInput-focus':'detailInput' : 'detailInput'} />
                                }
                               
                            </div>

                        )
                    })}



                    {/* Bottom Button */}
                    <div style={{display:'flex', columnGap:'10px', marginTop:'32px', marginBottom:'20px'}}>
                        <button className='simple-btn' title="View all properties" >View all properties</button>
                        <button className='simple-btn' title='View property history'>View property history</button>
                    </div>
                </Collapse.Panel>
            </Collapse>

        </div>
    );
}