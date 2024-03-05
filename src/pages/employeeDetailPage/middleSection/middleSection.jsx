import './middleSection.css';
import { Avatar, Input, Modal, Popover } from 'antd';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faClose, faEllipsisV, faPoll } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import multi from "./assets/multi-shade.png";
import heartico from "./assets/heart_ico.jpg";
import heartbg from "./assets/heart_bg.jpg";

export const DetailPageMiddleSection = ({singleEmployee})=>{
    const [postCollapse, setPostCollapse] = useState(false)
    const [post, setPost] = useState(false);
    const [postContent, setPostContent] = useState("");
    const [bg, setBg] = useState("white");
    return(
        <div className='setting-body-inner detailPageTab'
        style={{padding:'16px'}}>
            
            <div className='post-header'>
                <div className='post-avatar'>
                    <Avatar size={60} src={"https://scontent-man2-1.xx.fbcdn.net/v/t39.30808-6/424898432_4542228726002734_5791661793434540279_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=95FoMIfU6UgAX9ihnaO&_nc_ht=scontent-man2-1.xx&oh=00_AfBAVkq-CuOQsJjYfVH10IDnqpXH79nyCpVGPrFJndgURA&oe=65EB1456"} />
                </div>
                <Input
                    className='generic-input-control'
                    placeholder={"What's on your mind, "+singleEmployee?.firstname+"?"}
                    style={{borderRadius:'5px',height:'50px'}}
                    onClick={()=>setPost(!post)}
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
            
            <Modal
                open={post}
                width={600}
                footer={null}
                closable={false}
            >
                <div className='modal-header-title'>
                    <span>Create post</span>
                    <span  onClick={()=>setPost(!post)}><FontAwesomeIcon className='close' icon={faClose}/></span>
                </div>
                <div className={bg=="white"?'modal-body postlight':'modal-body postdark'} style={{padding:'0px 0px'}}>
                        
                        <ReactQuill
                            placeholder={"What's on your mind, "+singleEmployee?.firstname+"?"}
                            onChange={(e)=>setPostContent(e)}
                            value={postContent}
                            style={{color:bg=="white"?'black' :'white', fontWeight:'normal', fontSize:'30px', background: bg}}
                        />
                        <div style={{margin:'0px', padding:'20px', textAlign:'center', borderTop: '1px solid #ECEFEC', background: 'white', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
                                <div className='post-option'>
                                    <FontAwesomeIcon icon={faPoll}/>    Poll
                                </div>

                                <Popover
                                    
                                    overlayClassName='notePopover'
                                    style={{width:'fit-content'}}
                                    content={
                                        <div style={{display:'flex', gap:'20px', alignItems:'center', padding:'10px 20px'}}>
                                            <div onClick={()=>setBg("white")} style={{background:'white', height:'29px', width:'29px', border:'1px solid lightgray'}} className='post-color'></div>
                                            <div onClick={()=>setBg("#33363D")}  style={{background:'#33363D'}} className='post-color'></div>
                                            <div onClick={()=>setBg("#0077b6")}  style={{background:'#0077b6'}} className='post-color'></div>
                                            <div onClick={()=>setBg("#7600bc")}  style={{background:'#7600bc'}} className='post-color'></div>
                                            <div onClick={()=>setBg("#8B0000")}  style={{background:'#8B0000'}} className='post-color'></div>
                                            <div onClick={()=>setBg("#6FC276")}  style={{background:'#6FC276'}} className='post-color'></div>
                                            <div onClick={()=>setBg("#FFDA29")}  style={{background:'#FFDA29'}} className='post-color'></div>
                                        </div>
                                    }
                                >
                                    <div className='post-option' style={{height:'38px', width:'38px'}}>
                                        <img src={multi} style={{width:'100%'}} />
                                    </div>
                                </Popover>
                            </div>

                            <button className='drawer-outlined-btn post-btn'>Post</button>

                        </div>
                </div>
            </Modal>
            
        </div>
    );
}

