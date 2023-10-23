import React,{useEffect, useState} from 'react';
import Draggable from 'react-draggable';
import './notes.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownAZ, faArrowsH, faChevronDown, faChevronRight, faClose, faEllipsisV, faMaximize } from '@fortawesome/free-solid-svg-icons';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { toolbarOptions } from './toolbar';
import { Checkbox, Popover } from 'antd';
import draftToHtml from 'draftjs-to-html';
import { setNoteToggle } from '../../../../middleware/redux/reducers/note.reducer';
import { useDispatch } from 'react-redux';

export const Notes = ()=>{
    const [position, setPosition] = useState({ x: 206, y: 122 });

    const handleDrag = (e, ui) => {
      const { x, y } = ui;
      console.log(x,y)
      setPosition({ x, y });
    };
    const [collapse, setCollapse] = useState(false);
    const uploadImageCallBack = ()=>{

    };
    
    const [editorState, setEditorState] = useState(EditorState.createEmpty())

    const onEditorStateChange = (newEditorState) =>{
        setEditorState(newEditorState);
    }

    useEffect(()=>{
        if(editorState){

            const contentState = editorState.getCurrentContent();
            const rawContentState = convertToRaw(contentState);

            console.log( draftToHtml(rawContentState), "text");
        }
    },[editorState]);

    const [followUp, setFollowUp] = useState("To-do");
    const [timespan, setTimeSpan] = useState("In 3 business days");

    const [width, setWidth] = useState(false);
    const dispatch = useDispatch();

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
                overflow:collapse?"hidden":"hidden",
                height:collapse?50 :350,
                background: 'white',
                width: width? '1000px' : '600px',
            }}>
                <div className="notes-header">
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

                    <Editor
                        toolbar={{
                            options:[ 
                                'inline', 'list', 'textAlign','link', 'image', 
                                
                            ],
                            inline: {
                                inDropdown: true,
                                options: ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript'],
                            },
                            list:{
                                inDropdown: true,
                            },
                            textAlign: {
                                inDropdown: true
                            },
                            link: {
                                inDropdown: false
                            },
                        }}
                        editorState={editorState}
                        toolbarClassName="editorToolbar"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editor-container"
                        onEditorStateChange={onEditorStateChange}
                        placeholder='Start typing to leave a note ...'
                        style={{padding:'10px'}}
                        mention={{
                            separator: ' ',
                            trigger: '@',
                            suggestions: [
                            { text: 'APPLE', value: 'apple', url: 'apple' },
                            { text: 'BANANA', value: 'banana', url: 'banana' },
                            { text: 'CHERRY', value: 'cherry', url: 'cherry' },
                            { text: 'DURIAN', value: 'durian', url: 'durian' },
                            { text: 'EGGFRUIT', value: 'eggfruit', url: 'eggfruit' },
                            { text: 'FIG', value: 'fig', url: 'fig' },
                            { text: 'GRAPEFRUIT', value: 'grapefruit', url: 'grapefruit' },
                            { text: 'HONEYDEW', value: 'honeydew', url: 'honeydew' },
                            ],
                        }}
                        hashtag={{
                          separator: ' ',
                          trigger: '#',
                        }}
                    />

                    <div className='note-association'>
                        <Popover
                            content={
                                <div>
                                    adasd
                                </div>
                            }
                        >
                           <span className='span-text'>Associated with 1 record <span className='caret'></span> </span> 
                        </Popover>
                    </div>
                </div>

                <div className="note-footer">
                    <button className='middle-note-btn'>Save note</button>
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