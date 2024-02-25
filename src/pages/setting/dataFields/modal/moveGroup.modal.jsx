import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Modal, Select, Button, notification, Spin, Popover, Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import { CREATE_GROUP, UPDATE_GROUP } from '../../../../util/mutation/group.mutation';
import { useMutation } from '@apollo/client';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { resetGroup } from '../../../../middleware/redux/reducers/group.reducer';
import { LoadingOutlined } from '@ant-design/icons';
import { Loader } from '../../../../components/loader';
import { MOVE_GROUP } from '../../../../util/mutation/properties.mutation';


export const MoveGroupModal = ({ visible, onClose, propertyListRefetch, groupList, setSelectedRowKeys}) => {
  console.log(groupList, "groupListgroupList");
  const {group} = useSelector(state=>state.groupReducer);
  const [groupName, setGroupName] = useState(group?.name || "");

  const [api, contextHolder] = notification.useNotification();
  const [btn, setbtn] = useState(true);
  const [createGroup, { loading, error }] = useMutation(CREATE_GROUP);
  const dispatch = useDispatch();


  useEffect(()=>{
    setGroupName(group?.name);
    setbtn(true);
  },[group]);  

  const popoverRef = useRef(null);
  const inputRef = useRef(null);
  const [localGroup, setLocalGroup] = useState(groupList?.groupList||[]);
  const [groupInput, setGroupInput] = useState({name:"Select a group", id:0});
  const [groupPopover, setGroupPopover] = useState(false);

  useEffect(()=>{
    if(groupList?.groupList?.length>0){
        setLocalGroup(groupList?.groupList);
    }
    console.log(groupList);
  },[groupList]);

  
  const [parentWidth, setParentWidth] = useState(null);
  const parentRef = useRef(null);

  

  useEffect(() => {

    const updateParentWidth = () => {
      if (parentRef.current) {
        const width = parentRef.current.offsetWidth;
        setParentWidth(width);
      }
    };

    // Call the update function on initial mount and window resize
    updateParentWidth();
    window.addEventListener('resize', updateParentWidth);
    inputRef?.current?.focus();

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', updateParentWidth);
    };

  }, [groupPopover]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.group-wrapper')) {
        setGroupPopover(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


  const {propertiesToBeMoved} = useSelector(state => state.groupReducer);
  const [tags, setTags] = useState([]);
  useEffect(()=>{
    if(propertiesToBeMoved?.length){
        setTags(propertiesToBeMoved);
    }
  }, [propertiesToBeMoved]);


  const [moveGroup, {loading:moveGroupLoading}] = useMutation(MOVE_GROUP);

  const handelSubmit = async() =>{
    try{
      await moveGroup({
        variables:{
          input:{
            properties: tags,
            groupId: groupInput?.id,
            groupName: groupInput?.name
          }
        }
      });
      setSelectedRowKeys([]);
      onClose();
      api.success({
        message:"Group moved successfully",
        placement:"top",
        className: 'notification-without-close',
      });
      await propertyListRefetch();

    }
    catch(err){
      setGroupName(null);
      setbtn(true);
      api.error({
        message: err.message,
        placement:"top",
        className: 'notification-without-close',
      });
    }
  }


  return (
    <Modal
      open={visible}
      width={450}
      footer={
        <div style={{padding:'6px 40px', paddingBottom:'16px', textAlign:'left', display:'flex', columnGap:'16px', marginTop:'-25px' }}>
            <button  
              disabled={groupInput?.id || moveGroupLoading? false : true} 
              className={!groupInput?.id || moveGroupLoading? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} 
              onClick={handelSubmit}
            >
              {loading || moveGroupLoading ? <Spin indicator={<LoadingOutlined/>}/> : "Save"}
            </button>
            <button  disabled={loading || moveGroupLoading } className={loading || moveGroupLoading ? 'disabled-btn drawer-outlined-btn':'drawer-outlined-btn'} onClick={onClose}>
              Cancel
            </button>
        </div>
      }
      closable={false}
    >
      <React.Fragment>
        {contextHolder}
        <div className='modal-header-title'>
            <span style={{letterSpacing:'0.2px'}}>Choose new property group</span>
            <span  onClick={onClose}><FontAwesomeIcon className='close' icon={faClose}/></span>
        </div>
        {groupList?.groupList?
       
        <div className='modal-body'>
          <div style={{padding:' 8px 12px 10px 0', fontSize:'14px', color:'#33475b'}}>
            {tags?.length>1? 'Properties' : 'Property'}
          </div>
          <div className="grouptabs">
            {tags?.map((property)=>(
                <Tag closable={tags?.length>1 ? true : false} onClose={()=>setTags(tags?.filter((tag)=>tag.key!=property.key))} className='tag'>
                    {property.label}
                </Tag>
            ))}
          </div>

          <form id="branchForm" className='form'>
            <Form.Item>
              <label>Groups</label>
              
                <div className="group-wrapper">
                    <Input
                        name="groupInput"
                        className='generic-input-control groupInput' 
                        value={groupInput.name}
                        style={{cursor:'pointer', padding:'0 0px'}}
                        onClick={()=>setGroupPopover(!groupPopover)}
                        suffix={<span onClick={()=>setGroupPopover(!groupPopover)} 
                        style={{
                            position: 'absolute',
                            right: '6px'
                        }} className='caret'></span>}
                        readOnly
                    />

                    <div ref={parentRef} className={groupPopover? 'show': 'hide'}>
                        <div className="moveGroupData" style={{width: parentWidth-1.5}} >
                            <div className="popover-search" >
                                <Input type="text" 
                                    ref={inputRef}
                                    name='popoverSearch'
                                    style={{ width: '-webkit-fill-available', backgroundColor: 'white'  }} 
                                    className='generic-input-control' 
                                    placeholder="Search..."
                                    autoFocus={groupPopover}
                                    autoComplete="off"
                                    onChange={(e)=> setLocalGroup(groupList?.groupList?.filter((group)=> (group.name)?.toLowerCase()?.includes(e.target.value?.toLowerCase())))}
                                    suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
                                />
                            </div>

                            <div ref={popoverRef}>
                                {localGroup?.length ? localGroup?.map((gl)=>(
                                    <div 
                                        className={groupInput.name==gl.name? "popoverdataitem popoverdataitem-active": "popoverdataitem"} 
                                        onClick={(e)=>{setGroupInput({name:gl.name, id:gl.key}); setGroupPopover(false)}}>
                                        {gl.name}
                                    </div>
                                )):
                                
                                <div 
                                    className={"popoverdataitem"} 
                                    style={{cursor:'no-drop'}}
                                    onClick={(e)=>{ setGroupPopover(false)}}>
                                    No results found
                                </div>
                                }
                            </div>
                        </div>

                    </div>
                
                        
                        
                  
                </div>
            </Form.Item>     
          </form>
        </div> 
         :
         <Loader/>
        }  
      </React.Fragment> 
     
    </Modal>
  );
};

