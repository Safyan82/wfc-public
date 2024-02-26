import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, Button, notification, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../../../components/spinner';
import './bulkArchiveConfirmation.modal.css';
import { useMutation } from '@apollo/client';
import { BULK_ARCHIVE_PROPERTIES } from '../../../../util/mutation/properties.mutation';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../../middleware/redux/reducers/notification.reducer';

export const BulkDeleteConfirmationModal = ({ refreshAll, visible, onClose, selectedRowKeys, properties, loading, setSelectedRowKeys, label, deleteRecord}) => {
  const [propertyConfirmation, setPropertyConfirmation] = useState(null);
  const [isDisabled, setDisabled] = useState(false);

  
  const dispatch = useDispatch();

    useEffect(()=>{
        if(properties?.length>0){
            setDisabled(true);
        }
    }, [properties?.length]);
  
  const handelProperties = (e)=>{
    const p =properties?.length.toString();
    if(e.target.value.length==1 && e.target.value[0]==p[0]){  
        setPropertyConfirmation(e.target.value);
        setDisabled(true);
    }

    if(Number(e.target.value)===properties?.length){
        setPropertyConfirmation(e.target.value);
        setDisabled(false);
        return
    }
    else if(e.target.value==''){
        setDisabled(true);
        setPropertyConfirmation('');
    }
    else{
        return;
    }
  };

  return (
    <Modal
      visible={visible}
      width={450}
      style={{borderRadius:'3px'}}
      footer={
        <div style={{padding:'0px 40px 26px 40px', textAlign:'left', display:'flex', columnGap:'16px', marginTop:'-25px' }}>
            <button disabled={isDisabled || loading} className={isDisabled || loading?'disabled-btn archive-btn':'archive-btn'} onClick={deleteRecord}>
              {loading ?
                <Spinner />
              :"Delete"}
            </button>
            <button disabled={loading } className={loading  ?'disabled-btn dim-btn':'dim-btn'} onClick={onClose}>Cancel</button>
        </div>
      }
      closable={false}
    >
      
      <React.Fragment>
        <div className='archive-modal-header modal-header-title'>
            <span className='archive-font'>
               {
                properties?.length>0 ? `Delete ${properties?.length} ${properties.length>1? ' properties?': ' property?'}` : 
                `Permanently delete ${label} ? `
               }
            </span>
            <span onClick={onClose}><FontAwesomeIcon className='close' icon={faClose}/></span>
        </div>
        <div className='modal-body'>
          
          <div className="text">
            You're about to permanently delete {properties?.length ? properties?.length + " properties" : label} . This can't be undone.
          </div>
          {properties?.length>0?
          <>

            <label style={{color:'#33475b'}}>
                Type the number of {properties?.length<1 ? "property" : "properties"} to delete.
            </label>
            <Input
                className='generic-input-control bulkArchiveInput'
                placeholder={properties?.length}
                onChange={handelProperties}
                value={propertyConfirmation}
            />

          </>
            : null}
        </div>  
      </React.Fragment>  
    </Modal>
  );
};

