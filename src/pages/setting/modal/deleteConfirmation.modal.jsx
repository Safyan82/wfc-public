import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, Button, notification, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { LoadingOutlined } from '@ant-design/icons';

export const DeleteConfirmationModal = ({ refresh, visible, onClose, deleteRecord, label, additionalText, title, loading}) => {
 

  return (
    <Modal
      visible={visible}
      width={450}
      style={{borderRadius:'3px'}}
      footer={
        <div style={{padding:'0px 40px 26px 40px', textAlign:'left', display:'flex', columnGap:'16px', marginTop:'-25px' }}>
            <button  disabled={loading} className={loading? 'disabled-btn archive-btn': 'archive-btn'} onClick={deleteRecord}>{loading? <Spin style={{color:'white'}} indicator={<LoadingOutlined/>}/> :"Delete"}</button>
            <button  disabled={loading}  className={loading? 'disabled-btn dim-btn': 'dim-btn'} onClick={onClose}>Cancel</button>
        </div>
      }
      closable={false}
    >
      <React.Fragment>
        <div className='archive-modal-header modal-header-title'>
            <span className='archive-font'>
                Delete {additionalText ? label + " ?": 'the ' + title +" "}
                {!additionalText && label + " ?"}
            </span>
            <span  onClick={onClose}><FontAwesomeIcon className='close' icon={faClose}/></span>
        </div>
        <div className='modal-body'>
          
          <div className="text">
            {additionalText ? 
              "This group will be permanently deleted from your CRM. This action can't be undone."
              :
            
             `Are you sure you want to delete this ${title}?`
            }
          </div>

        </div>  
      </React.Fragment>  
    </Modal>
  );
};

