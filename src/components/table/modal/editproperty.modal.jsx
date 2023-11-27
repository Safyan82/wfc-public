import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, Button, notification, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { LoadingOutlined } from '@ant-design/icons';


export const EditPropertiesModal = ({ visible, onClose, record, dynamicColumn}) => {
  console.log(dynamicColumn, "dynamicColumn")
  return (
    <Modal
      visible={visible}
      width={500}
      footer={
        <div style={{padding:'26px 40px', textAlign:'left', display:'flex', columnGap:'16px', marginTop:'-25px' }}>
            <button  
              disabled={false} 
              className={'drawer-filled-btn'} 
            >
              {false? <Spin indicator={<LoadingOutlined/>}/> : "Update"}
            </button>
            <button  disabled={false} className={false? 'disabled-btn drawer-outlined-btn':'drawer-outlined-btn'} onClick={onClose}>
              Cancel
            </button>
        </div>
      }
      closable={false}
    >
      
      <React.Fragment>
        <div className='modal-header-title'>
            <span>Bulk edit {record} records</span>
            <span  onClick={onClose}><FontAwesomeIcon className='close' icon={faClose}/></span>
        </div>
        <div className='modal-body'>
         
          <form id="branchForm" className='form'>
            <Form.Item>
              <label>Property to update</label>
              <Select
                className='custom-select'  
                suffixIcon={<span className='dropdowncaret'></span>}
                placeholder="Select a property to edit"
              >
                {dynamicColumn?.map((opt)=>(
                  <Select.Option value={opt.title}>{opt.title}</Select.Option>
                ))}
              </Select>
            </Form.Item>     
          </form>
        </div>  
      </React.Fragment>  
    </Modal>
  );
};

