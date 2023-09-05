import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, Button, notification, Spin, Radio } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { LoadingOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../middleware/redux/reducers/notification.reducer';
import { useMutation } from '@apollo/client';
import { createBranchViewMutation } from '../../../util/mutation/branchView.mutation';
import { useSelector } from 'react-redux';


export const CreateView = ({ visible, onClose, setcreatedView, createdView, branchViewRefetch }) => {

  const [name, setName] = useState("");
  const [access, setAccess] = useState("");
  const dispatch = useDispatch();

  const[createBranchView, {loading, error}] = useMutation(createBranchViewMutation)
  const {quickFilter, advanceFilter} = useSelector(state=>state.quickFilterReducer);

  const { branchSchemaNewFields } = useSelector(state => state.branchReducer);
  
  const handelSave = async () => {
    setcreatedView([...createdView, {label:name, access}]);
    await createBranchView({variables:{input:{
      name, visibility: access, quickFilter, advanceFilter, isManual: true,
      viewFields: branchSchemaNewFields
    }}});
    dispatch(setNotification({
        error:false,
        notificationState:true, 
        message: 'View was created successfully',
    }));
    onClose();
    await branchViewRefetch();
  };

  return (
    <Modal
      open={visible}
      width={480}
      footer={
        <div style={{padding:'26px 40px', textAlign:'left', display:'flex', columnGap:'16px', marginTop:'-25px' }}>
            <button  
              onClick={handelSave}
              disabled={name?.length<1 || access?.length<1} 
              className={name?.length<1 || access?.length<1 ? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} 
            >
              {false? <Spin indicator={<LoadingOutlined/>}/> : "Save"}
            </button>
            <button  disabled={false} className={false? 'disabled-btn drawer-outlined-btn':'drawer-outlined-btn'} onClick={onClose}>
              Cancel
            </button>
        </div>
      }
      closable={false}
    >
      
      <React.Fragment>
        {/* {contextHolder} */}
        <div className='modal-header-title'>
            <span>Create a new saved view</span>
            <span  onClick={onClose}><FontAwesomeIcon className='close' icon={faClose}/></span>
        </div>
        <div className='modal-body'>
          <form id="branchForm" className='form'>
            <Form.Item>
              <label>Name <sup>*</sup></label>
              <Input className={'input-control'} name="viewName" value={name}  onChange={(e)=>setName(e.target.value)}/>
            </Form.Item> 
            <Form.Item>
                <label>Shared with <sup>*</sup></label><br />
                <Radio.Group onChange={(e)=>setAccess(e.target.value)}>
                    <Radio value={"private"}>Private</Radio> <br />
                    <Radio value={"team"}>My team</Radio><br />
                    <Radio value={"public"}>Everyone</Radio>
                </Radio.Group>
            </Form.Item>    
          </form>
        </div>  
      </React.Fragment>  
    </Modal>
  );
};

