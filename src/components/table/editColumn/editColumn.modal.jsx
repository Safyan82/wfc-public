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
import { SingleBranchViewQuery } from '../../../util/query/branchView.query';


export const EditColumn = ({ visible, onClose, setcreatedView, createdView }) => {

  const [name, setName] = useState("");
  const [access, setAccess] = useState("");
  const dispatch = useDispatch();

  const [loader, setLoader] = useState(true);
  const {branchSchemaNewFields} = useSelector(state => state.branchReducer);
  const [updateBranchCloumnView] = useMutation(updateBranchView);
  
  const updateView = async ()=>{
    
    await updateBranchCloumnView({
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

    onClose();


  };

   
  const {data: branchView, loading: branchViewLoading, refetch: branchViewRefetch} = useQuery(SingleBranchViewQuery,{
    variables:{
      id: sessionStorage.getItem("selectedViewId")
    },
    fetchPolicy: 'network-only'
  });



  return (
    <Modal
      open={visible}
      width={1100}
      style={{    marginTop: '-4%' }}
      footer={
        <div style={{padding:'0px 40px 26px', textAlign:'left', display:'flex', alignItems:'center', columnGap:'16px', marginTop:'-25px' }}>
            <button  
            //   disabled={name?.length<1 || access?.length<1} 
            //   className={name?.length<1 || access?.length<1 ? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} 
            onClick={updateView}
            className='drawer-filled-btn'
            >
              {false? <Spin indicator={<LoadingOutlined/>}/> : "Apply"}
            </button>
            <button  disabled={false} className={false? 'disabled-btn drawer-outlined-btn':'drawer-outlined-btn'} onClick={onClose}>
              Cancel
            </button>
            <span className='grid-text-btn' onClick={()=>{
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
                   {loader? <Loader/>: <PropertyToBeAdd/>}
                </span> 
                <span style={{width:'100%'}}>
                    <PropertiesList setLoader={setLoader}/>
                </span>
            </div>
        </div>  
      </React.Fragment>  
    </Modal>
  );
};

