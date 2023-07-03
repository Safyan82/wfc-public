import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, Button, notification, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { CREATE_GROUP } from '../../util/mutation/group.mutation';
import { useMutation } from '@apollo/client';

export const GroupModal = ({ visible, onClose, groupRefetch}) => {

  const [groupName, setGroupName] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const [btn, setbtn] = useState(true);
  const [createGroup, { loading, error }] = useMutation(CREATE_GROUP);

  const handelChange = (e)=>{
    setGroupName(e.target.value);
    if(e.target.value < 3){
      e.target.classList.add('input-control-error'); 
    }else{
      setbtn(false);
      e.target.classList.remove('input-control-error'); 
    }

  };

  const handelSubmit = async() =>{
    try{
      const {data:{createGroup:{success, message}}} = await createGroup({variables: {input: {name:groupName}}});
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

  return (
    <Modal
      visible={visible}
      width={500}
      footer={
        <div style={{padding:'26px 40px', textAlign:'left', display:'flex', columnGap:'16px', marginTop:'-25px' }}>
            <button  disabled={btn || loading || groupName?.length<3 && true} className={btn || loading ||  groupName?.length < 3 ? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} onClick={handelSubmit}>Save</button>
            <button  disabled={loading} className='drawer-outlined-btn' onClick={onClose}>Cancel</button>
        </div>
      }
      closable={false}
    >
      
      <React.Fragment>
        {contextHolder}
        <div className='modal-header-title'>
            <span>Create a new property group</span>
            <span className='close' onClick={onClose}><FontAwesomeIcon icon={faClose}/></span>
        </div>
        <div className='modal-body'>
          
          <div className="text">
              You can create custom property groups to better organize any custom properties for each object.
          </div>

          <form id="branchForm" className='form'>
            <Form.Item>
              <label>Name</label>
              <Input className={'input-control'} value={groupName} onChange={handelChange} name="groupName" />
            </Form.Item>     
          </form>
        </div>  
      </React.Fragment>  
    </Modal>
  );
};

