import { setNoteToggle } from "../../../../middleware/redux/reducers/note.reducer";
import { useDispatch } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight, faCommentDots, faCopy, faDeleteLeft, faPen, faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Avatar, Popover, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import dayjs from "dayjs";
import ReactQuill from 'react-quill';
import { useMutation } from "@apollo/client";
import { DeleteNoteMutation, UpdateNoteMutation } from "../../../../util/mutation/note.mutation";
import { DeleteNoteCommentMutation, NewNoteCommentMutation } from "../../../../util/mutation/noteComment.mutation";
import { useSelector } from "react-redux";

export const NotesTab = ({note, noteRefetch}) =>{

    

    // get employee Notes

    useEffect(()=>{
        noteRefetch();
    },[noteRefetch]);

    // modify note data to add collapse functionality
    const [noteList, setNoteList] = useState([]);
    useEffect(()=>{
        if(note?.length>0){
            
            if(sessionStorage.getItem("editComment")){
                setNoteList(note?.map((note)=>{
                    if(note?._id==sessionStorage.getItem("editComment")){
                        return {...note, isCollapsed: false, commentCollapse: false, editNote:false}
                    }else{
                        return {...note, isCollapsed: true, commentCollapse: true, editNote:false}
                    }
                
                }));
                sessionStorage.removeItem("editComment");
            }else{
                setNoteList(note?.map((note)=>({...note, isCollapsed: true, commentCollapse: true, editNote:false})));
            }
            
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

    const handelCommentCollapse = (id,state)=>{
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
    
    const handelNoteToBeEdit = (id, noteContent) =>{
        setNoteList(noteList?.map((note)=>{
            if(note?._id==id){
                return {...note, editedNote: noteContent}
            }else{
                return note;
            }
        }));
    }

    const handelCancelNotes = (id) =>{
        setNoteList(noteList?.map((list)=>{
            
            if(list?._id==id){
                return {...list, editedNote: null, editNote:false}
            }else{
                return list;
            }

        }));
    }

    const [updateNote,{loading: updateNoteLoading}] = useMutation(UpdateNoteMutation);
    
    const handelUpdateNotes = async(_id)=>{
        const noteToEdit = await noteList?.find((note)=>note?._id==_id);
        await updateNote({
            variables:{
                input:{
                    _id,
                    note: noteToEdit?.editedNote
                }
            }
        });
        
        await noteRefetch();
    }

    const [newNoteComment] = useMutation(NewNoteCommentMutation);

    const handelComment = (id,state)=>{
        setNoteList(noteList?.map((note)=>{
            if(note?._id==id){
                return {...note, comment: state}
            }else{
                return note;
            }
        }));
    }

    const newComment = async (noteId) =>{

        const note = await noteList?.find((note)=>note?._id==noteId);
        await newNoteComment({
            variables:{
                input: {
                    noteId,
                    comment: note?.comment
                }
            }
        });

        setNoteList(noteList?.map((note)=>{
            if(note?._id==noteId){
                delete note?.comment;
                return {...note}
            }else{
                return note;
            }
        }));

        await noteRefetch();  
        
        
        
        sessionStorage.setItem("editComment", noteId);

    }

    const {authenticatedUserDetail} = useSelector(state=>state.userAuthReducer);   

    const [DeleteNoteComment] = useMutation(DeleteNoteCommentMutation);
    const [deleteNote] = useMutation(DeleteNoteMutation);

    return(
        
        <div className='setting-body-inner detailPageTab'
        style={{background:'rgb(245, 248, 250)', padding:'16px', overflowY:'auto', maxHeight:'85.6vh'}}>

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

                        
                        {/* <div className="month-stage">
                            September 2023
                        </div> */}

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
                                                    <FontAwesomeIcon icon={faCommentDots} className='comment-icon'/> <small style={{color:'#0091ae'}}>{note?.comments?.length}</small>
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
                                                        <div className={note?.createdBy[0]?._id == authenticatedUserDetail?.employeeId? "popoverdataitem" : "disabled-btn popoverdataitem"} onClick={async()=>{
                                                            await deleteNote({
                                                                variables:{
                                                                    noteId: note?._id
                                                                }
                                                            });
                                                            await noteRefetch();
                                                        }}>
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
                                    
                                    // {/* note actual static text before expand */}
                                    <div className={"note-list-body"}  
                                    style={{cursor: 'pointer'}} onClick={()=>handelCollapse(note?._id, !note?.isCollapsed)}>
                                            
                                        <div className="note-list-content">
                                            <span  style={{overflowWrap:'anywhere'}} dangerouslySetInnerHTML={{__html:note?.note}}></span>
                                            
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
                                                        marginBottom:'17px',
                                                        cursor: 'pointer'
                                                    }}
                                                >

                                                    <ReactQuill onChange={(e)=>handelNoteToBeEdit(note?._id, e)} value={note?.editedNote || note?.note} theme="snow" />


                                                </div>
                                                
                                                <button className='middle-note-btn' onClick={()=>handelUpdateNotes(note?._id)}>Save</button> &emsp;
                                                <button className='light-btn' onClick={()=>{ handelCancelNotes(note?._id); }}>Cancel</button>
                                            </div>
                                            :

                                            // {/* note actual text while expand this can be updated*/}
                                            <div className={note?.isCollapsed?"note-list-body": "note-list-body note-list-body-uncollapse"}>
                                                
                                                <div className={"note-list-content"}>
                                                    <span style={{overflowWrap:'anywhere'}} dangerouslySetInnerHTML={{__html:note?.note}}></span>
                                                    {note?.createdBy[0]?._id == authenticatedUserDetail?.employeeId?
                                                    <FontAwesomeIcon icon={faPen} className='comment-icon' onClick={()=>handelNoteEdit(note?._id, !note?.editNote)}/>: null}
                                                    
                                                </div>
                                            </div>
                                        }



                                        {/* footer */}

                                        <div className="note-list-footer">
                                            <span onClick={()=>handelCommentCollapse(note?._id ,!note?.commentCollapse)}>
                                                <FontAwesomeIcon icon={faCommentDots}/> {note?.commentCollapse? note?.comments?.length>0? note?.comments?.length +' comment' : 'Add comment' : 'Hide comment'}
                                            </span>
                                            {/* <span>1 association <span className='caret'></span></span> */}
                                        </div>



                                        {/* comment area */}

                                        {note?.commentCollapse? null :
                                            <>
                                                {/* list all comments of particualr note */}
                                                {note?.comments?.map((comment)=>
                                                {
                                                    return(
                                                        <div className='comment-section' style={{marginBottom:'10px'}}>
                                                            <Avatar size={35}
                                                                style={{border:0, width: '40px'}}
                                                                icon={<img src='https://avatars.hubspot.net/default-80'/>}
                                                            />

                                                                <div style={{width:'100%'}}>

                                                                    <b>{note?.commentedBy?.find((commentedPerson)=>commentedPerson?._id==comment?.commentedBy)?.firstname}</b>
                                                                    
                                                                    {authenticatedUserDetail?.employeeId==comment?.commentedBy?
                                                                        <div className="edit-comment-icon" >
                                                                            {/* <FontAwesomeIcon icon={faPencil}/> */}
                                                                            <FontAwesomeIcon onClick={async()=>{
                                                                                await DeleteNoteComment({
                                                                                    variables:{
                                                                                        commentId: comment?._id
                                                                                    }
                                                                                });
                                                                                await noteRefetch();
                                                                                sessionStorage.setItem("editComment", note?._id);
                                                                            }} icon={faTrashCan}/>
                                                                        </div>
                                                                        
                                                                        :
                                                                        null
                                                                    }

                                                                    <div className="notes-body"  style={{marginTop:'-10px', width:'100%', overflowWrap:'anywhere'}} dangerouslySetInnerHTML={{__html:comment?.comment}}></div>

                                                                </div>

                                                        </div>
                                                    )
                                                })}
                                            
                                                {/* new comment */}
                                                <div className='comment-section'>
                                                    <Avatar size={35}
                                                        style={{border:0, width: '40px'}}
                                                    icon={<img src='https://avatars.hubspot.net/default-80'/>}/>
                                                    
                                                    <div
                                                        style={{

                                                            width:'100%',
                                                            
                                                        }}
                                                    >
                                                        <b>{authenticatedUserDetail?.employeeDetail[0]?.firstname}</b>
                                                        
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
                                                                onChange={(e)=>handelComment(note?._id, e)}
                                                                value={note?.comment}
                                                            />


                                                        </div>

                                                        <button className='middle-note-btn' onClick={()=>newComment(note?._id)}>Save</button> &emsp;
                                                        <button className='light-btn' onClick={()=>handelCommentCollapse(note?._id, !note?.commentCollapse)}>Cancel</button>

                                                    </div>
                                                </div>

                                            </>
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