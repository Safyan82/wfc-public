import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, Button, notification, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../../components/spinner';
import './bulkArchiveConfirmation.modal.css';
import { useMutation } from '@apollo/client';
import { BULK_ARCHIVE_PROPERTIES } from '../../../util/mutation/properties.mutation';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../middleware/redux/reducers/notification.reducer';

export const BulkArchiveConfirmationModal = ({ refreshAll, visible, onClose, selectedRowKeys, properties, loading, setSelectedRowKeys}) => {
  const [propertyConfirmation, setPropertyConfirmation] = useState(null);
  const [isDisabled, setDisabled] = useState(true);

  const [bulkArchiveProperties, {loading: bulkArchivePropertiesLoading}] = useMutation(BULK_ARCHIVE_PROPERTIES);
  
  const dispatch = useDispatch();


  const handelProperties = (e)=>{

        
        if(Number(e.target.value)===properties){
            setPropertyConfirmation(e.target.value);
            setDisabled(false);
        }
        else if(e.target.value==''){
            setDisabled(true);
            setPropertyConfirmation('');
        }else{
            return;
        }
  };

  const handelBulkArchive = async()=>{
    try{

        await bulkArchiveProperties({
            variables:{
              ids:{ids: selectedRowKeys}
            }
        });

        dispatch(setNotification({
            notificationState:true, 
            message:`${properties?.length<1 ? "property was" : "properties were"}  archived successfully`,
            error: false,
        }));
        setSelectedRowKeys([]);
        onClose();
        refreshAll();
        
    }catch(err){

        dispatch(setNotification({
            notificationState:true, 
            message:`An Error occur while archiving the properties please refresh page and try again`,
            error: true,
        }));
    }

  }

  return (
    <Modal
      visible={visible}
      width={450}
      style={{borderRadius:'3px'}}
      footer={
        <div style={{padding:'0px 40px 26px 40px', textAlign:'left', display:'flex', columnGap:'16px', marginTop:'-25px' }}>
            <button disabled={loading || isDisabled} className={loading || isDisabled?'disabled-btn archive-btn':'archive-btn'} onClick={handelBulkArchive}>
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
                Archive {properties} {properties?.length<1 ? "property" : "properties"}
            </span>
            <span onClick={onClose}><FontAwesomeIcon className='close' icon={faClose}/></span>
        </div>
        <div className='modal-body'>
          
          <div className="text">
            Archived properties can be restored within 90 days. After 90 days, they are deleted automatically.
          </div>
          <label style={{color:'#33475b'}}>
            Type the number of {properties?.length<1 ? "property" : "properties"} to archive.
          </label>
          <Input
            className='generic-input-control bulkArchiveInput'
            placeholder={properties}
            onChange={handelProperties}
            value={propertyConfirmation}
          />
        </div>  
      </React.Fragment>  
    </Modal>
  );
};

