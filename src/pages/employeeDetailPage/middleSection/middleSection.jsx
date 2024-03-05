import { Avatar, Input, Popover } from 'antd';
import React, { useState } from 'react';
import './middleSection.css';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faEllipsisV } from '@fortawesome/free-solid-svg-icons';


export const DetailPageMiddleSection = ({singleEmployee})=>{
    const [postCollapse, setPostCollapse] = useState(false)
    return(
        <div className='setting-body-inner detailPageTab'
        style={{padding:'16px'}}>
            
            <div className='post-header'>
                <div className='post-avatar'>
                    <Avatar size={60} src={"https://scontent-man2-1.xx.fbcdn.net/v/t39.30808-6/424898432_4542228726002734_5791661793434540279_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=95FoMIfU6UgAX9ihnaO&_nc_ht=scontent-man2-1.xx&oh=00_AfBAVkq-CuOQsJjYfVH10IDnqpXH79nyCpVGPrFJndgURA&oe=65EB1456"} />
                </div>
                <Input
                    className='generic-input-control'
                    placeholder="What's on your mind?"
                    style={{borderRadius:'5px',height:'50px'}}
                />
            </div>

            <div className="post-body">
                <div className="post-body-item">
                    <div className='poster'>
                        <div style={{display:'flex', gap:'20px', alignItems:'center', width:'100%'}}>
                            <div className='post-avatar'>
                                <Avatar size={60} src={"https://scontent-man2-1.xx.fbcdn.net/v/t39.30808-6/424898432_4542228726002734_5791661793434540279_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=95FoMIfU6UgAX9ihnaO&_nc_ht=scontent-man2-1.xx&oh=00_AfBAVkq-CuOQsJjYfVH10IDnqpXH79nyCpVGPrFJndgURA&oe=65EB1456"} />
                            </div>

                            <div style={{width:'97%', borderBottom:'1px solid #ECEFEC', paddingBottom:'16px'}}>
                                <div style={{fontWeight:'500',marginBottom:'6px', fontSize:'14px'}}>{singleEmployee?.firstname+" "+singleEmployee?.lastname}</div>
                                <div>{dayjs().format("DD-MM-YYYY HH:mm")}</div>
                            </div>
                        </div>

                        <div style={{cursor:'pointer'}}>
                            <Popover
                                overlayClassName='notePopover'
                                placement='right'
                                content={
                                    <div className='popover-data'>
                                        <div className="popoverdataitem">
                                            Pin
                                        </div>
                                        <div className="disabled popoverdataitem">
                                            Delete
                                        </div>
                                    </div>
                                }
                            >
                                <FontAwesomeIcon icon={faEllipsisV} />
                            </Popover>
                        </div>


                    </div>
                    {/* posting body */}
                    <div style={{padding:'20px 0px 20px 80px'}}>
                        <div style={{fontSize:'16px', fontWeight:'500', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                           <span>Post Body</span> 
                           {
                            postCollapse?
                            <FontAwesomeIcon onClick={()=>setPostCollapse(!postCollapse)} style={{cursor:'pointer'}}  icon={faChevronRight} />
                            :
                            <FontAwesomeIcon onClick={()=>setPostCollapse(!postCollapse)} style={{cursor:'pointer'}} icon={faChevronDown} />
                           }
                        </div>
                        {
                            postCollapse? null
                            :
                            <div className="text">
                                Our research objectives encompass the development and training of a robust CNN model capable of accurately detecting tire cracks. Subsequently, we optimize the model for deployment on mobile platforms using TensorFlow Lite, ensuring that our proposed solution meets the demands of real-time, on-the-go inspections. The dissertation aims to contribute to the field by providing an effective and accessible solution that enhances tire safety through advanced deep learning techniques and mobile computing capabilities.
                            </div>
                        }
                    </div>
                </div>
            </div>
            
        </div>
    );
}