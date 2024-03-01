import { setNoteToggle } from "../../../../middleware/redux/reducers/note.reducer";
import { useDispatch } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight, faCommentDots, faCopy, faPen } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { Avatar, Popover, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import draftToHtml from "draftjs-to-html";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { objectType } from "@src/util/types/object.types";
import { getNote } from "@src/util/query/note.query";
import dayjs from "dayjs";
import ReactQuill from 'react-quill';

export const NotesTab = () =>{

    

    // get employee Notes
    const param = useParams();
    const { data:note , loading: noteLoading, refetch: noteRefetch} = useQuery(getNote,{
        variables:{
            createdFor: param?.id,
            objectType: objectType?.Employee
        }
    });

    useEffect(()=>{
        noteRefetch();
    },[noteRefetch]);

    // modify note data to add collapse functionality
    const [noteList, setNoteList] = useState([]);
    useEffect(()=>{
        if(note?.getNote?.response?.length>0){
            setNoteList(note?.getNote?.response?.map((note)=>({...note, isCollapsed: true, commentCollapse: true, editNote:false})))
        }
    },[note]);

    // handel note main collapse
    const handelCollapse = (id, state)=>{
        setNoteList(noteList?.map((note)=>{
            if(note?._id==id){
                return {...note, isCollapsed: state}
            }else{
                return note;
            }
        }));
    }

    const handelComment = (id,state)=>{
        setNoteList(noteList?.map((note)=>{
            if(note?._id==id){
                return {...note, commentCollapse: state}
            }else{
                return note;
            }
        }));
    }

    
    const handelNoteEdit = (id,state)=>{
        setNoteList(noteList?.map((note)=>{
            if(note?._id==id){
                return {...note, editNote: state}
            }else{
                return note;
            }
        }));
    }

    const dispatch = useDispatch();
    


    return(
        
        <div className='setting-body-inner detailPageTab'
        style={{background:'rgb(245, 248, 250)', padding:'16px', paddingRight: '0'}}>

        <Tabs defaultActiveKey="1" >

            <TabPane tab={`Notes`} key="1"> 
            
                <div style={{paddingRight:'16px'}}>
                    <div className='middle-btn-wrapper'>
                        <button className='middle-note-btn' onClick={()=>dispatch(setNoteToggle(true))}>Create Note</button>
                    </div>

                    {/* <div className="text" style={{paddingTop:'68px'}}>
                    Take notes about this record to keep track of important info. You can even <b>@mention</b> a teammate
                    </div> */}

                    <div className="notes-list-main">

                        
                        <div className="month-stage">
                            September 2023
                        </div>

                        {noteList?.map((note)=>{
                            return(
                                <div className="note-list">
                                    <div className='note-list-header'>

                                        {/* note left side */}
                                        <div className='note-header-left' onClick={()=>handelCollapse(note?._id, !note?.isCollapsed)} >
                                            <span>
                                                {note?.isCollapsed?
                                                    <FontAwesomeIcon style={{width:'20px'}} icon={faChevronRight} onClick={()=>handelCollapse(note?._id, !note?.isCollapsed)} />
                                                    :
                                                    <FontAwesomeIcon style={{width:'20px'}}  icon={faChevronDown} onClick={()=>handelCollapse(note?._id, !note?.isCollapsed)} />
                                                }
                                            </span>

                                            {/* who notted */}
                                            <span><b>Note</b> by {note?.createdBy[0]?.firstname +" "+note?.createdBy[0]?.lastname}</span> 
                                            {
                                                note?.isCollapsed?
                                                <span>
                                                    <FontAwesomeIcon icon={faCommentDots} className='comment-icon'/> <small style={{color:'#0091ae'}}>2</small>
                                                </span>
                                                :null
                                            }
                                        </div>


                                        <div className="note-header-right">
                                        
                                        {/* right side action popover */}

                                        {note?.isCollapsed? null :
                                            <Popover
                                                overlayClassName='notePopover'
                                                content={
                                                    <div className='popover-data'>
                                                        <div className="popoverdataitem">
                                                            Pin
                                                        </div>
                                                        <div className="popoverdataitem">
                                                            History
                                                        </div>
                                                        <div className="popoverdataitem">
                                                            Delete
                                                        </div>
                                                        
                                                        <div className="popoverdataitem">
                                                            Copy link &nbsp; <FontAwesomeIcon icon={faCopy} />
                                                        </div>
                                                    </div>
                                                }
                                                trigger={"click"}
                                            >
                                                <span className='popoverHeadText'>Actions <span className='caret'></span></span>

                                            </Popover>
                                        }

                                        {/* date right side */}
                                            <small>{dayjs(note?.createdAt).format("DD/MM/YYYY HH:mm")}</small>
                                        </div>

                                    </div>
                                    
                                    {note?.isCollapsed? 
                                    
                                    // {/* note actual text */}
                                    <div className={"note-list-body"}>
                                            
                                        <div className="note-list-content">
                                            <span  dangerouslySetInnerHTML={{__html:note?.note}}></span>
                                            
                                            {!note?.isCollapsed && <FontAwesomeIcon icon={faPen} className='comment-icon' onClick={()=>handelNoteEdit(note?._id, !note?.editNote)}/>}
                                            
                                        </div>
                                    </div>
                                    
                                    :
                                    <>
                                        {/* note edit text or update text */}
                                        {note?.editNote?
                                            <div
                                                style={{

                                                    width:'-webkit-fill-available',
                                                    
                                                }}
                                                className='note-body-main'
                                            >
                                                    
                                                <div className="notes-body"
                                                    style={{
                                                        minHeight:'180px',
                                                        border: '1px solid rgb(223, 227, 235)',
                                                        background: 'rgb(245, 248, 250)',
                                                        marginTop:'10px',
                                                        marginBottom:'17px'
                                                    }}
                                                >

                                                    <ReactQuill theme="snow" />


                                                </div>
                                                
                                                <button className='middle-note-btn'>Save</button> &emsp;
                                                <button className='light-btn' onClick={()=>handelNoteEdit(note?._id, !note?.editNote)}>Cancel</button>
                                            </div>
                                            :

                                            // {/* note actual text while expand */}
                                            <div className={note?.isCollapsed?"note-list-body": "note-list-body note-list-body-uncollapse"}>
                                                
                                                <div className={"note-list-content"}>
                                                    <span dangerouslySetInnerHTML={{__html:note?.note}}></span>
                                                    <FontAwesomeIcon icon={faPen} className='comment-icon' onClick={()=>handelNoteEdit(note?._id, !note?.editNote)}/>
                                                    
                                                </div>
                                            </div>
                                        }



                                        {/* footer */}

                                        <div className="note-list-footer">
                                            <span onClick={()=>handelComment(note?._id ,!note?.commentCollapse)}>
                                                <FontAwesomeIcon icon={faCommentDots}/> {note?.commentCollapse?'Add comment' : 'Hide comment'}
                                            </span>
                                            <span>1 association <span className='caret'></span></span>
                                        </div>



                                        {/* comment area */}

                                        {note?.commentCollapse? null :
                                        <div className='comment-section'>
                                            <Avatar size={35}
                                                style={{border:0, width: '40px'}}
                                            icon={<img src='https://avatars.hubspot.net/default-80'/>}/>
                                            
                                            <div
                                                style={{

                                                    width:'100%',
                                                    
                                                }}
                                            >
                                                <b>Safyan</b>
                                                
                                                <div className="notes-body"
                                                    style={{
                                                        minHeight:'180px',
                                                        border: '1px solid rgb(223, 227, 235)',
                                                        background: 'rgb(245, 248, 250)',
                                                        marginTop:'10px',
                                                        marginBottom:'17px'
                                                    }}
                                                >

                                                    <ReactQuill 
                                                        theme="snow" 
                                                        className="comment-editor"
                                                        style={{height:'200px'}}
                                                    />


                                                </div>

                                                <button className='middle-note-btn'>Save</button> &emsp;
                                                <button className='light-btn' onClick={()=>handelComment(note?._id, !note?.commentCollapse)}>Cancel</button>

                                            </div>
                                        </div>
                                        }

                                        {/* comment terminated */}

                                    </>
                                    }

                                </div>
                            );
                        })}
                            

                    </div>
                </div>
            </TabPane>

        </Tabs>

        </div>
    )
}