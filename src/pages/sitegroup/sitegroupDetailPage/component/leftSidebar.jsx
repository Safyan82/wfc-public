
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faBusinessTime, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Popover, Collapse, Skeleton, Tag, DatePicker, Input } from 'antd';
import {faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { PhoneOutlined,  FormOutlined, MessageOutlined, UserAddOutlined } from '@ant-design/icons';
import { GET_BRANCHES,} from '@src/util/query/branch.query';
import { useQuery } from '@apollo/client';
import PhoneInput from 'react-phone-input-2';
import { useNavigate } from 'react-router-dom';
import Spinner from '@src/components/spinner';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { SiteGroupObjectQuery } from '../../../../util/query/siteGroup.query';

export const SiteGroupDetailPageLeftSideBar = ({siteGroup, loading})=>{
    
    const {data:siteGroupObject, loading: siteGroupObjectLoading, refetch: siteGroupObjectRefetch} = useQuery(SiteGroupObjectQuery);
    const navigate = useNavigate();

    const [siteGroupSchema, setSiteGroupSchema] = useState([]);
    useEffect(()=>{
        if(siteGroupObject?.getSiteGroupObject?.response){
            setSiteGroupSchema(siteGroupObject?.getSiteGroupObject?.response?.map((object)=>(object?.propertyDetail?.label)));
        }
    },[siteGroupObject?.getSiteGroupObject?.response]);


    return(
        <div className='sidebar-wrapper' >
            <div className='leftsidebar'>

                <div className='side-intro'>
                    {siteGroup?
                    <>
                        <div className='emp-avatar'>
                            {/* <Avatar size={70} src={"https://scontent-man2-1.xx.fbcdn.net/v/t39.30808-6/424898432_4542228726002734_5791661793434540279_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=95FoMIfU6UgAX9ihnaO&_nc_ht=scontent-man2-1.xx&oh=00_AfBAVkq-CuOQsJjYfVH10IDnqpXH79nyCpVGPrFJndgURA&oe=65EB1456"}/> */}
                            <Avatar size={70} ><FontAwesomeIcon icon={faMapLocationDot} /></Avatar>
                        </div>
                        
                        <div className='text-head' style={{width:'100%'}}>
                            <div className='text-title' style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',}}
                            >
                                <span>
                                    {siteGroup?.sitegroupname?.toUpperCase()}
                                </span>
                                <Popover
                                    overlayClassName='notePopover'
                                    placement='right'
                                    content={
                                        <div className='popover-data'>
                                            <div className="disabled popoverdataitem" onClick={()=>navigate("/user/employee-detail-view/"+siteGroup?._id)}>
                                                Data Fields View
                                            </div>
                                            <div className="disabled popoverdataitem" onClick={()=>navigate(`/user/employee-prop-history/`+siteGroup?._id)}>
                                               Data Fields History
                                            </div>
                                        </div>
                                    }
                                >
                                    <FontAwesomeIcon style={{cursor:'pointer'}} icon={faEllipsisV}/>
                                </Popover>
                            </div>

                            <div className='text-subtitle'>

                                <div style={{textTransform:'lowercase', fontSize:'1em', marginBottom:'22px', marginTop:'10px'}}>
                                    <FontAwesomeIcon icon={faBusinessTime}/> &nbsp; {"Customer"} 
                                </div>   
                            
                                <div className="activity-btn-grp">
                                    
                                    <Popover
                                        content={"Make a phone call"}
                                    >
                                        <span>
                                            <button className='disabled-btn'>
                                                <PhoneOutlined />
                                            </button>
                                            <span className='tiny-text disabled'>Call</span>
                                        </span>
                                    </Popover>

                                    
                                    <Popover
                                        content={"Start conversation"}
                                    >
                                        <span>
                                            <button className='disabled-btn'>
                                                {/* <FontAwesomeIcon icon={faComment} /> */}
                                                <MessageOutlined/>
                                            </button>
                                            <span className='tiny-text disabled'>Chat</span>
                                        </span>
                                    </Popover>


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


                                    
                                    <Popover content={"Follow this"} >
                                        <span>
                                            <button className='disabled-btn'>
                                                {/* <FontAwesomeIcon icon={faUserPlus} /> */}
                                                <UserAddOutlined />
                                            </button>
                                            <span className='tiny-text disabled'>Follow</span>
                                        </span>
                                    </Popover>
                                </div>

                            </div>
                        </div>
                    </>
                    : 
                    <div className='skeleton-custom'>

                    <Skeleton.Avatar active size={69} />
                    <Skeleton className='text-head' active/>
                    </div>
                    }
                </div>

                

                
            </div>
            

                {
                    Object.values(siteGroup)?.map((prop, index)=>{
                        if(Object.keys(siteGroup)[index]=="sitegroupname"){
                            return(
                                <div className='fieldView'>
                                    <div>{siteGroupSchema[index]}</div>
                                    <div>
                                        {prop}
                                    </div>
                                </div>
    
                            )
                        }
                    })
                }

                <div className="btm-border"></div>

                
                {
                    Object.values(siteGroup)?.map((prop, index)=>{
                        if(Object.keys(siteGroup)[index]!=="sitegroupname"){
                            return(
                                <div className='fieldView'>
                                    <div>{siteGroupSchema[index]}</div>
                                    <div>
                                        {prop}
                                    </div>
                                </div>
    
                            )
                        }
                    })
                }
               
        </div>
    );
}