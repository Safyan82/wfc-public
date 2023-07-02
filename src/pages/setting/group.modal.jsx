import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, Button, notification, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

export const GroupModal = ({ visible, onClose}) => {

  const [groupName, setGroupName] = useState("");

  const handelChange = (e)=>{
    setGroupName(e.target.value);
    if(e.target.value < 3){
      e.target.classList.add('input-control-error'); 
    }else{
      e.target.classList.remove('input-control-error'); 
    }

  };

  return (
    <Modal
      visible={visible}
      width={500}
      footer={
        <div style={{padding:'26px 40px', textAlign:'left', display:'flex', columnGap:'16px', marginTop:'-25px' }}>
            <button disabled={groupName?.length<3 && true} className={ groupName?.length < 3 ? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} onClick={()=>console.log('save')}>Save</button>
            <button  className='drawer-outlined-btn' onClick={onClose}>Cancel</button>
        </div>
      }
      closable={false}
    >
      
      <React.Fragment>
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
              <Input className={'input-control'} onChange={handelChange} name="groupName" />
            </Form.Item>     
          </form>
        </div>  
      </React.Fragment>  
    </Modal>
  );
};

