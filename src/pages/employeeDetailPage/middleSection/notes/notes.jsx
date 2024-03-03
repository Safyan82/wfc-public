import React,{useEffect, useState} from 'react';
import Draggable from 'react-draggable';
import './notes.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownAZ, faArrowsH, faChevronDown, faChevronRight, faClose, faEllipsisV, faMaximize } from '@fortawesome/free-solid-svg-icons';
import { Checkbox, Popover } from 'antd';
import { setNoteToggle } from '@src/middleware/redux/reducers/note.reducer';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import { setNotification } from '@src/middleware/redux/reducers/notification.reducer';
import { objectType } from "@src/util/types/object.types";
import { NewNoteMutation } from '@src/util/mutation/note.mutation';
import ReactQuill from 'react-quill';
import { useParams } from 'react-router-dom';


export const Notes = ({refetch})=>{
    const [position, setPosition] = useState({ x: 206, y: 122 });

    const handleDrag = (e, ui) => {
      const { x, y } = ui;
      console.log(x,y)
      setPosition({ x, y });
    };
    const [collapse, setCollapse] = useState(false);
   
   
    const [newNote, {loading}] = useMutation(NewNoteMutation);

    const [note, setNote] = useState(null);


    const [followUp, setFollowUp] = useState("To-do");
    const [timespan, setTimeSpan] = useState("In 3 business days");

    const [width, setWidth] = useState(false);
    const dispatch = useDispatch();


    const [value, setValue] = useState("");

    const param = useParams();
    
    const handelNote = async()=>{
        try{
            await newNote({
                variables:{
                    input:{
                        note: value,
                        createdFor: param?.id,
                        objectType: objectType?.Employee
                    }
                }
            });
            dispatch(setNotification({
                notificationState: true,
                error:false,
                message: "Note Added"
            }));
            await refetch();
            dispatch(setNoteToggle(false));

        }catch(err){
            dispatch(setNotification({
                notificationState: true,
                error: true,
                message: err.message
            }));
        }
    }


    
    return(
        <Draggable 
            onDrag={handleDrag}
            handle='.notes-header'
            defaultPosition={{ x: position.x, y: position.y }}
        >
            <div  className="notes-main" 
            style={{
                position:'fixed', 
                top: collapse? 420 : width? 0  :position.y,
                left: width? 0 :position.x, 
                zIndex:99999,
                overflow:"hidden",
                height:collapse?50 : 500,
                background: 'white',
                width: width? '1000px' : '650px',
            }}>
                <div className={width? "notes-header width-max" :"notes-header width-min"}>
                    <span style={{display:'flex', alignItems:'center'}}>
                       {collapse? <FontAwesomeIcon className='svg-icon' icon={faChevronRight} style={{    width: '14px', fontSize:'12px'  }}  onClick={()=>setCollapse(false)} /> : <FontAwesomeIcon  style={{    width: '14px', fontSize:'12px'  }}  className='svg-icon'  icon={faChevronDown} onClick={()=>setCollapse(true)} />} Notes
                    </span>
                    <span className='dragable-icon-svg'>
                        <FontAwesomeIcon icon={faEllipsisV} />
                        <FontAwesomeIcon icon={faEllipsisV} />
                        <FontAwesomeIcon icon={faEllipsisV} />
                        <FontAwesomeIcon icon={faEllipsisV} />
                        <FontAwesomeIcon icon={faEllipsisV} />
                        <FontAwesomeIcon icon={faEllipsisV} />
                        <FontAwesomeIcon icon={faEllipsisV} />
                    </span>
                    <span>
                        <FontAwesomeIcon icon={faArrowsH} onClick={()=>setWidth(!width)} className='svg-icon dblarrow'/>
                        <FontAwesomeIcon onClick={()=>dispatch(setNoteToggle(false))}  className='svg-icon' icon={faClose}/>
                    </span>
                </div>

                <div className="notes-body">

                    <ReactQuill theme="snow" value={value} onChange={setValue} />
            

                    <div className='note-association'>
                        <Popover
                            content={
                                <div>
                                    Association not implemented yet
                                </div>
                            }
                        >
                           <span className='span-text disabled'>Associated with 0 record <span className='caret'></span> </span> 
                        </Popover>
                    </div>

                </div>

                <div className="note-footer">
                    <button onClick={handelNote} disabled={value?.length<1 || loading? true : false} className={value?.length<1 || loading? 'disabled-btn middle-note-btn' :'middle-note-btn'}>Save note</button>
                    <Checkbox>
                        Create a&nbsp;

                        <Popover
                            overlayClassName='notePopover'
                            trigger={"click"}
                            content={
                                <div >
                                    <div className="popover-data">
                                        <div className="popoverdataitem" onClick={(e)=>{setFollowUp(e.target.innerText); }}>
                                            To-do
                                        </div>
                                        <div className="popoverdataitem" onClick={(e)=>{setFollowUp(e.target.innerText); }}>
                                            Email
                                        </div>
                                        <div className="popoverdataitem" onClick={(e)=>{setFollowUp(e.target.innerText); }}>
                                            Call
                                        </div>
                                    </div>

                                </div>
                            }
                            placement='top'
                        >
                            <span className='span-text'>{ followUp}
                                <span className='caret'> </span>
                            </span>
                        </Popover>

                        &nbsp; task to follow up &nbsp;

                        
                        <Popover
                            overlayClassName='notePopover'
                            trigger={"click"}
                            content={
                                <div >
                                    <div className="popover-data">
                                        <div className="popoverdataitem" onClick={(e)=>{setTimeSpan(e.target.innerText); }}>
                                            Today
                                        </div>
                                        <div className="popoverdataitem" onClick={(e)=>{setTimeSpan(e.target.innerText); }}>
                                            Tomorrow
                                        </div>
                                        <div className="popoverdataitem" onClick={(e)=>{setTimeSpan(e.target.innerText); }}>
                                            In 1 business day
                                        </div>
                                        <div className="popoverdataitem" onClick={(e)=>{setTimeSpan(e.target.innerText); }}>
                                            In 2 business days
                                        </div>
                                        <div className="popoverdataitem" onClick={(e)=>{setTimeSpan(e.target.innerText); }}>
                                            In 3 business days
                                        </div>
                                        <div className="popoverdataitem" onClick={(e)=>{setTimeSpan(e.target.innerText); }}>
                                            In 1 week
                                        </div>
                                        <div className="popoverdataitem" onClick={(e)=>{setTimeSpan(e.target.innerText); }}>
                                            In 2 weeks
                                        </div>
                                        <div className="popoverdataitem" onClick={(e)=>{setTimeSpan(e.target.innerText); }}>
                                            In 1 month
                                        </div>
                                        <div className="popoverdataitem" onClick={(e)=>{setTimeSpan(e.target.innerText); }}>
                                            In 3 months
                                        </div>
                                        <div className="popoverdataitem" onClick={(e)=>{setTimeSpan(e.target.innerText); }}>
                                            In 6 months
                                        </div>
                                        <div className="popoverdataitem" onClick={(e)=>{setTimeSpan(e.target.innerText); }}>
                                            Custom Date
                                        </div>
                                    </div>

                                </div>
                            }
                            placement='top'
                        >
                            <span className='span-text'>{ timespan }
                                <span className='caret'> </span>
                            </span>
                        </Popover>


                    </Checkbox>
                </div>

            </div>
      </Draggable>
    )
}