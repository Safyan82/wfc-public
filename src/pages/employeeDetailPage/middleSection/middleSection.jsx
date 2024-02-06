import { Avatar, Collapse, Input, Popover, Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import React, {useState} from 'react';
import './middleSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronLeft, faChevronRight, faComment, faCommentAlt, faCommentDots, faCommenting, faInfo, faInfoCircle, faPen, faPenAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import noData from '../noData.svg';
import { Notes } from './notes/notes';
import { setNoteToggle } from '../../../middleware/redux/reducers/note.reducer';
import { useDispatch } from 'react-redux';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { UserOutlined } from '@ant-design/icons';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';


export const DetailPageMiddleSection = ()=>{

    const [width, setWidth] = useState(false);
    const [isCollapsed, setCollapsed] = useState(true);
    const [commentCollapse, setCommentCollapse] = useState(true);

    const dispatch = useDispatch();
    const [editorState, setEditorState] = useState(EditorState.createEmpty())

    const onEditorStateChange = (newEditorState) =>{
        setEditorState(newEditorState);
    }

    const [editNote, setEditNote] = useState(false);

    return(
        <div className='setting-body-inner detailPageTab'
        style={{background:'rgb(245, 248, 250)', padding:'16px', paddingRight: '0', overflowY: 'auto',}}>
            
            <Tabs defaultActiveKey="1" >

                <TabPane tab={`Overview`} key="1"> 
                    <div className='overview-card'>
                        <div className="overview-header"></div>
                        <div className="overview-body">
                            <ul className='overviewList'>

                                <li>
                                    <b>Created Date</b>
                                    <div className="text">06/16/2023 4:19 PM GMT+1</div>
                                </li>

                                <li>
                                    <b>Status</b>
                                    <div className="text" style={{textTransform:'capitalize'}}>Active</div>
                                </li>

                                <li>
                                    <b>Last activity Date</b>
                                    <div className="text">--</div>

                                </li>

                            </ul>
                        </div>
                    </div> 

                    <div className='overview-card'>
                        <div className="overview-header">
                            <b className='f16'>Recent communications </b>
                            <Popover
                                content={"asd"}
                            >
                                <FontAwesomeIcon icon={faInfoCircle} style={{color:'rgb(124, 152, 182)'}}/>  
                            </Popover>
                        </div>
                        <div className="overview-body" style={{textAlign:'center'}}>
                            <img src={noData} />
                            <div className="text">There are no recent communications.</div>
                        </div>
                    </div> 
                </TabPane>

                <TabPane tab="Activites" key="2" className='detailActivityTab'>
                    
                    <div style={{padding:'0px 2px', display:'flex', justifyContent:'space-between'}}>
                        <Input type="text" 
                            id="inputSearch"
                            name='popoverSearch'
                            style={width? { backgroundColor: 'white', width:'100%'  } :{backgroundColor: 'white', width:'40%'}} 
                            className='generic-input-control activites-SearchInput' 
                            placeholder="Search activites"
                            autoComplete="off"
                            onFocus={()=>setWidth(true)}
                            onBlur={()=>setWidth(false)}
                            suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
                        />
                    </div>
                    {width?
                    <div style={{marginTop:'2%', marginBottom:'-3%'}}>
                        <b style={{fontSize:'14px'}}>Results are based on terms found in following activites fields: </b>
                        Branch name, Post code and Address.
                    </div>
                    :null}

                    <div className='editFieldTabs'>
                        <Tabs defaultActiveKey="1">
                            
                            <TabPane tab={`Activity`} key="1">
                                <div>

                                    <div className='detailPage-activity-filter'>
                                        <span>Filter by:</span>
                                        <span style={{color:'#0091ae', fontWeight:'bold', cursor:'pointer'}}>Filter activity <span className='caret'></span></span>
                                        <span style={{color:'#0091ae', fontWeight:'bold', cursor:'pointer'}}>All users <span className='caret'></span></span>
                                    </div>

                                    <div className="month-stage">
                                        September 2023
                                    </div>

                                    <div className="activity-card">
                                        <div className="activity-card-header">
                                            <span style={{width:'65%'}}>This contact was created from Offline Sources from CRM UI</span>
                                            <span style={{color:'#516F8A', fontSize:'11px'}}>Sept 26, 2023 at 4:19 PM GMT+1</span>
                                        </div>
                                    </div>

                                </div>
                            </TabPane>

                            <TabPane tab={`Notes`} key="2">
                               <div>
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

                                        <div className="note-list">
                                            <div className='note-list-header'>
                                                <div className='note-header-left' onClick={()=>setCollapsed(!isCollapsed)} >
                                                    <span>
                                                        {isCollapsed?
                                                            <FontAwesomeIcon style={{width:'20px'}} icon={faChevronRight} onClick={()=>setCollapsed(!isCollapsed)} />
                                                            :
                                                            <FontAwesomeIcon style={{width:'20px'}}  icon={faChevronDown} onClick={()=>setCollapsed(!isCollapsed)} />
                                                        }
                                                    </span>
                                                    <span><b>Note</b> by Safyan Mehar</span> 
                                                    {
                                                        isCollapsed?
                                                        <span>
                                                            <FontAwesomeIcon icon={faCommentDots} className='comment-icon'/> <small style={{color:'#0091ae'}}>2</small>
                                                        </span>
                                                        :null
                                                    }
                                                </div>

                                                <div className="note-header-right">
                                                {isCollapsed? null :
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
                                                    <small>Oct 5, 2023 at 12:12 AM GMT+1</small>
                                                </div>
                                            </div>
                                            
                                            {isCollapsed? null:
                                            <>
                                                {/* note edit text or update text */}
                                                {editNote?
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
                                                        toolbarClassName="noteEditToolbar"
                                                        wrapperClassName="wrapperClassName"
                                                        editorClassName="comment-editor-container"
                                                        onEditorStateChange={onEditorStateChange}
                                                        placeholder='Send your colleague a notification by typing @ followed by their name. Only users in your organization can see comments.'
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

                                                    </div>
                                                    
                                                    <button className='middle-note-btn'>Save</button> &emsp;
                                                    <button className='light-btn' onClick={()=>setEditNote(false)}>Cancel</button>
                                                </div>
                                                :
                                                // {/* note actual body text */}
                                                <div className="note-list-body ">
                                                    
                                                    <div className="note-list-content">
                                                        <span>ASD Content</span>
                                                        <FontAwesomeIcon icon={faPen} className='comment-icon' onClick={()=>setEditNote(!editNote)}/>
                                                        
                                                    </div>
                                                </div>
                                                }

                                                <div className="note-list-footer">
                                                    <span onClick={()=>setCommentCollapse(!commentCollapse)}>
                                                        <FontAwesomeIcon icon={faCommentDots}/> {commentCollapse?'Add comment' : 'Hide comment'}
                                                    </span>
                                                    <span>1 association <span className='caret'></span></span>
                                                </div>

                                                {commentCollapse? null :
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
                                                            toolbarClassName="commenteditorToolbar"
                                                            wrapperClassName="wrapperClassName"
                                                            editorClassName="comment-editor-container"
                                                            onEditorStateChange={onEditorStateChange}
                                                            placeholder='Send your colleague a notification by typing @ followed by their name. Only users in your organization can see comments.'
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

                                                        </div>

                                                        <button className='middle-note-btn'>Save</button>
                                                    </div>
                                                </div>
                                                }

                                            </>
                                            }

                                        </div>

                                    </div>
                               </div>
                            </TabPane>


                            <TabPane tab={`Post`} key="0">
                            </TabPane>

                            <TabPane tab={`Calls`} key="4">
                            </TabPane>

                            <TabPane tab={`Tasks`} key="5">
                            </TabPane>




                        </Tabs>
                    </div>


                </TabPane>
            </Tabs>
        </div>
    );
}