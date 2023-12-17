import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Modal, Select, Button, notification, Spin, Popover, Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import { CREATE_GROUP, UPDATE_GROUP } from '../../../util/mutation/group.mutation';
import { useMutation, useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { resetGroup } from '../../../middleware/redux/reducers/group.reducer';
import { LoadingOutlined } from '@ant-design/icons';
import { Loader } from '../../../components/loader';
import { MOVE_GROUP } from '../../../util/mutation/properties.mutation';
import { GET_BRANCHES } from '../../../util/query/branch.query';
import { setModuleCustomPermission } from '../../../middleware/redux/reducers/moduleCustomPermission.reducer';


export const CustomModulePermission = ({ visible, onClose, propertyListRefetch, groupList, setSelectedRowKeys, obj}) => {
 

  const [api, contextHolder] = notification.useNotification();

    const { data: branchData, refetch, loading } = useQuery(GET_BRANCHES,{
        fetchPolicy: 'cache-and-network',
        variables: {
            input: {
                filters: null
            }
        }
    });

  const popoverRef = useRef(null);
  const inputRef = useRef(null);
  const [localGroup, setLocalGroup] = useState(branchData?.branches||[]);
  const [groupInput, setGroupInput] = useState();
  const [groupPopover, setGroupPopover] = useState(false);

  useEffect(()=>{
    if(branchData?.branches?.length>0){
        setLocalGroup(branchData?.branches);
    }
  },[branchData?.branches]);

  
  const [parentWidth, setParentWidth] = useState(null);
  const parentRef = useRef(null);

  const [tags, setTags] = useState([]);
  
  const  customPermission = useSelector(state=>state.moduleCustomPermissionReducer);
  
  console.log(customPermission)

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

  }, [groupPopover, visible]);


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



  useEffect(()=>{
    if(groupInput && !tags?.find((tag)=>tag?.name==groupInput?.name)){
        setTags([...tags, groupInput]);
    }
  }, [groupInput]);


  const dispatch = useDispatch();
  useEffect(()=>{
    // setModuleCustomPermission
    dispatch(setModuleCustomPermission({[obj]:tags}))
  }, [tags]);



  return (
    <Modal
      open={visible}
      width={450}
      footer={
        <div style={{padding:'6px 40px', paddingBottom:'16px', textAlign:'left', display:'flex', columnGap:'16px', marginTop:'-25px' }}>
            <button  
              disabled={groupInput?.id? false : true} 
              className={!groupInput?.id? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} 
              onClick={onClose}
            >
              {loading ? <Spin indicator={<LoadingOutlined/>}/> : "Save"}
            </button>
            <button  disabled={loading } className={loading  ? 'disabled-btn drawer-outlined-btn':'drawer-outlined-btn'} onClick={onClose}>
              Cancel
            </button>
        </div>
      }
      closable={false}
    >
      <React.Fragment>
        {contextHolder}
        <div className='modal-header-title'>
            <span style={{letterSpacing:'0.2px'}}>Choose Desired {obj}</span>
            <span  onClick={onClose}><FontAwesomeIcon className='close' icon={faClose}/></span>
        </div>


        {!loading?
       
        
        <div className='modal-body'>

            {tags?.length>0?
            <>
                <div style={{padding:' 8px 12px 10px 0', fontSize:'14px', color:'#33475b'}}>
                    {tags?.length>1? 'Branches': 'Branch'}
                </div>
                <div className="grouptabs" style={{marginBottom: '16px'}}>
                    {tags?.map((property)=>(
                        <Tag closable={true} onClose={()=>setTags(tags?.filter((tag)=>tag.id!=property.id))} className='tag'>
                            {property.name}
                        </Tag>
                    ))}
                </div>
            </>
            : null
            }
            

          <form id="branchForm" >
            <Form.Item>
              <label>Branches</label>
              
                <div className="group-wrapper">
                    <div
                        name="groupInput"
                        className='generic-input-control groupInput' 
                        style={{cursor:'pointer', padding:'0 0px'}}
                        onClick={()=>setGroupPopover(!groupPopover)}
                    >
                        <div style={{fontSize:'14px', fontWeight: 'normal', margin: '9px', display: 'flex'}}>
                            Select branch
                            <span onClick={()=>setGroupPopover(!groupPopover)} 
                                style={{
                                    position: 'absolute',
                                    right: '6px',
                                }} className='caret'></span>
                        </div>
                    </div>

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
                                    onChange={(e)=> setLocalGroup(branchData?.branches?.filter((group)=> (group.branchname)?.toLowerCase()?.includes(e.target.value?.toLowerCase())))}
                                    suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
                                />
                            </div>

                            <div ref={popoverRef}>
                                {localGroup?.length ? localGroup?.map((gl)=>(
                                    <div 
                                        className={"popoverdataitem"} 
                                        onClick={(e)=>{setGroupInput({name:gl.branchname, id:gl._id}); setGroupPopover(false)}}>
                                        {gl.branchname}
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

