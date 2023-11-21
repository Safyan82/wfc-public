import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, Button, notification, Spin, Radio } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { LoadingOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../middleware/redux/reducers/notification.reducer';
import { PropertyToBeAdd } from '../../../pages/editForm/propertyTobeAdd.component';
import { PropertiesList } from '../../../pages/editForm/propertiesList.modal';
import { Loader } from '../../loader';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import { updateBranchView } from '../../../util/mutation/branchView.mutation';
import { refreshBranchGrid, removeAllColumns, setPropertyToBeRemoveFromSchema } from '../../../middleware/redux/reducers/branch.reducer';
import Spinner from '../../spinner';


export const EditColumn = ({ visible, 
  onClose, objectType, 
  properties, propertiesRefetch,
  loading, view, updateRenderedView, refetchView,
}) => {

  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();

  const [loader, setLoader] = useState(true);
  const {branchSchemaNewFields} = useSelector(state => state.branchReducer);
  
  const updateView = async ()=>{
    setDisabled(true);
    await updateRenderedView({
      variables:{
        input:{
          _id: sessionStorage.getItem('selectedViewId'),
          viewFields: branchSchemaNewFields.filter((field)=>field.isLocalDeleted!=1),
        }
      }
    });

    dispatch(refreshBranchGrid(true));
    dispatch(setNotification({
      error: false,
      notificationState:true, 
      message: "Column updated",

    }));
    await refetchView();
    setDisabled(false);
    onClose();
  };

   




  return (
    <Modal
      open={visible}
      width={1100}
      style={{ marginTop: '-4%' }}
      footer={
        <div style={{padding:'0px 40px 26px', textAlign:'left', display:'flex', alignItems:'center', columnGap:'16px', marginTop:'-25px' }}>
            <button  
            //   disabled={name?.length<1 || access?.length<1} 
            //   className={name?.length<1 || access?.length<1 ? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} 
            onClick={updateView}
            className='drawer-filled-btn'
            disabled={disabled}
            >
              {disabled? <Spinner color={"white"} /> : "Apply"}
            </button>
            <button  disabled={disabled} className={false? 'disabled-btn drawer-outlined-btn':'drawer-outlined-btn'} onClick={onClose}>
              Cancel
            </button>
            <span className='grid-text-btn' disabled={disabled} onClick={()=>{
              dispatch(removeAllColumns(true));
            }}>Remove All Columns</span>
        </div>
      }
      closable={false}
    >
      
      <React.Fragment>
        {/* {contextHolder} */}
        <div className='modal-header-title'>
            <span>Choose which columns you see</span>
            <span  onClick={onClose}><FontAwesomeIcon className='close' icon={faClose}/></span>
        </div>
        <div className='modal-body'>
            <div className="editColumn-body">
                <span style={{width:'100%'}}>
                   {loader? 
                   <Loader/>: 
                   <PropertyToBeAdd processing={loading} view={view} objectType={objectType} />}
                </span> 
                <span style={{width:'100%'}}>
                  <PropertiesList 
                    propertiesRefetch={propertiesRefetch}
                    properties={properties} 
                    setLoader={setLoader}
                    processing={loading}
                    view={view}
                  />
                </span>
            </div>
        </div>  
      </React.Fragment>  
    </Modal>
  );
};

