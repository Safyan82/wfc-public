import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, Button, notification, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../../../components/spinner';

export const ArchiveConfirmationModal = ({ visible, onClose, ArcheivePropertyGrid, propertyName, loading}) => {

  return (
    <Modal
      visible={visible}
      width={450}
      style={{borderRadius:'3px'}}
      footer={
        <div style={{padding:'0px 40px 26px 40px', textAlign:'left', display:'flex', columnGap:'16px', marginTop:'-25px' }}>
            <button disabled={loading} className={loading?'disabled-btn archive-btn':'archive-btn'} onClick={ArcheivePropertyGrid}>
              {loading?
                <Spinner />
              :"Archive"}
            </button>
            <button disabled={loading} className={loading?'disabled-btn dim-btn':'dim-btn'} onClick={onClose}>Cancel</button>
        </div>
      }
      closable={false}
    >
      
      <React.Fragment>
        <div className='archive-modal-header modal-header-title'>
            <span className='archive-font'>
                Archive the property <br/>
                {propertyName} ?
            </span>
            <span onClick={onClose}><FontAwesomeIcon className='close' icon={faClose}/></span>
        </div>
        <div className='modal-body'>
          
          <div className="text">
            Archived properties can be restored within 90 days. After 90 days, they are deleted automatically.
          </div>

        </div>  
      </React.Fragment>  
    </Modal>
  );
};

