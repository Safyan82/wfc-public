import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, Button, notification, Spin, Checkbox } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { CREATE_GROUP, UPDATE_GROUP } from '../../../../util/mutation/group.mutation';
import { useMutation } from '@apollo/client';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { resetGroup } from '../../../../middleware/redux/reducers/group.reducer';
import { LoadingOutlined } from '@ant-design/icons';
import { moduleTabs } from '../../../../util/tabs/employee.tab';
import "./group.css";

export const GroupModal = ({ visible, onClose, groupRefetch, objectType}) => {

  const {group} = useSelector(state=>state.groupReducer);
  const [groupName, setGroupName] = useState(group?.name || "");

  const [api, contextHolder] = notification.useNotification();
  const [btn, setbtn] = useState(true);
  const [createGroup, { loading, error }] = useMutation(CREATE_GROUP);
  const dispatch = useDispatch();

  const [updateGroup,{loading:updateGroupLoading}] = useMutation(UPDATE_GROUP);

  useEffect(()=>{
    setGroupName(group?.name);
    setbtn(true);
  },[group]);

  const editGroup = async ()=>{
    if(Object.keys(group)){
      try{

        const {data:{updateGroup:{success, message}}} = await updateGroup({variables:{ input: {groupId: group?.key, name: groupName, tabs: localtab}}});
        onClose();
        api.success({
          message,
          placement:"top",
          className: 'notification-without-close',
        });
        await groupRefetch();
        
        setGroupName(null);

        dispatch((resetGroup({})));
      }
      catch(err){
        
        api.error({
          message: err.message,
          placement:"top",
          className: 'notification-without-close',
        });
        // onClose();
      }
    }
  };

  const handelChange = (e)=>{
    setGroupName(e.target.value);
    if(e.target.value < 2){
      e.target.classList.add('input-control-error'); 
    }else{
      setbtn(false);
      e.target.classList.remove('input-control-error'); 
    }

  };

  const [localtab, setTab] = useState([]);

  useEffect(()=>{
    if(group?.tabs){
      setTab([...group?.tabs])
    }
  },[group]);


  const handelSubmit = async() =>{
    try{
      const {data:{createGroup:{success, message}}} = await createGroup({variables: {input: {name:groupName, objectType, tabs: localtab}}});
      groupRefetch();
      setGroupName(null);
      api.success({
        message,
        placement:"top",
        className: 'notification-without-close',
      });
      onClose();
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


  const handelTab = (checked, selectedtab)=>{
    const isExist = localtab?.find((tab)=>tab==selectedtab);
    if(isExist && !checked){
      setTab(localtab?.filter((tab)=>tab!=selectedtab));
      if(groupName?.length>1){
        setbtn(false);
      }
    }else{
      setTab([...localtab, selectedtab]);
      if(groupName?.length>1){
        setbtn(false);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      width={500}
      footer={
        <div style={{padding:'26px 40px', textAlign:'left', display:'flex', columnGap:'16px', marginTop:'-25px' }}>
            <button  
              disabled={btn || loading || updateGroupLoading ||  groupName?.length<2 && true} 
              className={btn || loading || updateGroupLoading ||  groupName?.length < 2 ? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} 
              onClick={group?.key ? editGroup :handelSubmit}
            >
              {loading || updateGroupLoading? <Spin indicator={<LoadingOutlined/>}/> : "Save"}
            </button>
            <button  disabled={loading || updateGroupLoading} className={loading || updateGroupLoading? 'disabled-btn drawer-outlined-btn':'drawer-outlined-btn'} onClick={()=>{setTab([]); onClose(); }}>
              Cancel
            </button>
        </div>
      }
      closable={false}
    >
      
      <React.Fragment>
        {contextHolder}
        <div className='modal-header-title'>
            <span>{group?.name || updateGroupLoading ? 'Edit  ' : 'Create a new' } property group</span>
            <span  onClick={()=>{ setTab([]); onClose();}} ><FontAwesomeIcon className='close' icon={faClose}/></span>
        </div>
        <div className='modal-body'>
          
          <div className="text">
              You can create custom property groups to better organize any custom properties for each object.
          </div>

          <form id="branchForm" className='form group-tabs'>
            <Form.Item>
              <label>Name</label>
              <Input className={'input-control'} value={groupName} onChange={handelChange} name="groupName" />
            </Form.Item> 
            {moduleTabs?.hasOwnProperty(objectType)?
            <>
            
              <Form.Item>
                <label>Associated Tabs</label>
              </Form.Item>
              <Form.Item>
                {moduleTabs[objectType]?.map((tab)=>{
                  return <div style={{width:'auto'}}>
                      <Checkbox checked={localtab?.find((tb)=>tb==tab)? true : false} onChange={(e)=>handelTab(e.target.checked, tab)}>{tab}</Checkbox>
                    </div>
                })}
              </Form.Item>

            </>
            : null
            }    
          </form>
        </div>  
      </React.Fragment>  
    </Modal>
  );
};

