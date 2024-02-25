import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Modal, Select, Button, notification, Spin, Popover, Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import { CREATE_GROUP, UPDATE_GROUP } from '@src/util/mutation/group.mutation';
import { useMutation, useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { resetGroup } from '@src/middleware/redux/reducers/group.reducer';
import { LoadingOutlined } from '@ant-design/icons';
import { Loader } from '@src/components/loader';
import { MOVE_GROUP } from '@src/util/mutation/properties.mutation';
import { GET_BRANCHES } from '@src/util/query/branch.query';
import { setModuleCustomPermission } from '@src/middleware/redux/reducers/moduleCustomPermission.reducer';
import { setCustomModulePermission, updateDefaultPropPermissin } from '@src/middleware/redux/reducers/permission.reducer';
import { GetEmployeeRecord } from '@src/util/query/employee.query';


export const CustomEmployeeModulePermission = ({ visible, onClose, propertyListRefetch, groupList, setSelectedRowKeys, obj}) => {
 

  const [api, contextHolder] = notification.useNotification();

  const {propAccess} = useSelector(state=>state.permissionReducer);
  
  
    const {data: employeeData, loading, refetch} = useQuery(GetEmployeeRecord,{fetchPolicy: 'cache-and-network',
        variables: {
            input: {
                filters: propAccess?.Branch?.customBranch?.map((branch)=>branch?.id)?.length>0 ? {branch: propAccess?.Branch?.customBranch?.map((branch)=>branch?.id)} : null
            }
        },
        skip: !propAccess
    });

    console.log(employeeData?.getEmployee?.response, "employeeData");


  const popoverRef = useRef(null);
  const inputRef = useRef(null);
  const [localGroup, setLocalGroup] = useState(employeeData?.getEmployee?.response||[]);
  const [groupInput, setGroupInput] = useState();
  const [groupPopover, setGroupPopover] = useState(false);

  useEffect(()=>{
    if(employeeData?.getEmployee?.response?.length>0){
        setLocalGroup(employeeData?.getEmployee?.response);
    }
  },[employeeData?.getEmployee?.response]);

  
  const [parentWidth, setParentWidth] = useState(null);
  const parentRef = useRef(null);

  const [tags, setTags] = useState([]);
  
 

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
    if(groupInput && !tags?.find((tag)=>tag?.name==groupInput?.name) && groupInput?.id!="dumy"){
        setTags([...tags, groupInput]);
    }
  }, [groupInput]);


  const dispatch = useDispatch();
  useEffect(()=>{
    if(propAccess && propAccess.hasOwnProperty(obj)){
      if((propAccess[obj]).hasOwnProperty("custom"+obj)){

        setTags([...propAccess[obj]["custom"+obj]]);
        // console.log(propAccess[obj]["custom"+obj]);
      }
    }
    // setModuleCustomPermission
  }, [propAccess]);


  const [btn, setBtn] = useState(false);
  useEffect(()=>{
    console.log(btn);
  },[btn]);

  return (
    <Modal
      open={visible}
      width={450}
      footer={
        <div style={{padding:'6px 40px', paddingBottom:'16px', textAlign:'left', display:'flex', columnGap:'16px', marginTop:'-25px' }}>
            <button  
              disabled={btn || groupInput?.id ? false : true} 
              className={ !btn || !groupInput?.id  ? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} 
              onClick={()=>{
                dispatch(setCustomModulePermission({objectType: obj, custom:tags}));
                onClose();
              }}
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
                        <Tag closable={true} onClose={()=>{setBtn(true); setGroupInput({id:"dumy"}); setTags(tags?.filter((tag)=>tag.id!=property.id));  }} className='tag'>
                            {property.name}
                        </Tag>
                    ))}
                </div>
            </>
            : null
            }
            

          <form id="branchForm" >
            <Form.Item>
              <label>Employee</label>
              
                <div className="group-wrapper">
                    <div
                        name="groupInput"
                        className='generic-input-control groupInput' 
                        style={{cursor:'pointer', padding:'0 0px'}}
                        onClick={()=>setGroupPopover(!groupPopover)}
                    >
                        <div style={{fontSize:'14px', fontWeight: 'normal', margin: '9px', display: 'flex'}}>
                            Select Employee
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
                                    onChange={(e)=> setLocalGroup(employeeData?.getEmployee?.response?.filter((group)=> (group.firstname)?.toLowerCase()?.includes(e.target.value?.toLowerCase())))}
                                    suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
                                />
                            </div>

                            <div ref={popoverRef}>
                                {localGroup?.length ? localGroup?.map((gl)=>(
                                    <div 
                                        className={"popoverdataitem"} 
                                        onClick={(e)=>{setGroupInput({name:gl.firstname, id:gl._id}); setBtn(true); setGroupPopover(false)}}>
                                        {gl.firstname +" "+gl.lastname}
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

