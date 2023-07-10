import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, Button, notification, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

export const DeleteConfirmationModal = ({ visible, onClose, deleteRecord, label, additionalText, title}) => {

  return (
    <Modal
      visible={visible}
      width={450}
      style={{borderRadius:'3px'}}
      footer={
        <div style={{padding:'0px 40px 26px 40px', textAlign:'left', display:'flex', columnGap:'16px', marginTop:'-25px' }}>
            <button  className={'archive-btn'} onClick={deleteRecord}>Delete</button>
            <button  className='dim-btn' onClick={onClose}>Cancel</button>
        </div>
      }
      closable={false}
    >
      
      <React.Fragment>
        <div className='archive-modal-header modal-header-title'>
            <span className='archive-font'>
                Delete the {title} <br/>
                {label} ?
            </span>
            <span className='close' onClick={onClose}><FontAwesomeIcon icon={faClose}/></span>
        </div>
        <div className='modal-body'>
          
          <div className="text">
            Are you sure you want to delete this {title}?.
            {additionalText && 
            <b>
              <br/>
              <span style={{color: 'red'}}>{additionalText}</span>
            </b>
            }
          </div>

        </div>  
      </React.Fragment>  
    </Modal>
  );
};

