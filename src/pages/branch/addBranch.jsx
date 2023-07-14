import './modal.css';
import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, Button, notification, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_BRACNH } from '../../util/mutation/branch.mutation';

const AddBranch = ({ visible, onCancel, refetch }) => {
  const navigate = useNavigate();
      
  const branchOrder = JSON.parse(localStorage.getItem("branchOrder"));
  
  const [createBranch, { loading, error }] = useMutation(CREATE_BRACNH);
  const [api, contextHolder] = notification.useNotification();


  const handelSubmit=async ()=>{
    const branchForm = document.getElementById("branchForm");
    const inputs = (branchForm.querySelectorAll("input"));
    let i = [];
    inputs.forEach((input)=>{
      i.push(input);
      if(input.value.length<2 && input.name!="AddressLine2"){
        input.style.borderColor="red";
        input.style.boxShadow="0 0 4px 1px red, 0 0 0 1px red";
        return
      }else{
        input.style.borderColor="rgba(0,208,228,.5)";
        input.style.boxShadow="0 0 4px 1px rgba(0,208,228,.3), 0 0 0 1px #00d0e4";
        return
      }
    });

    const isValidatedata = i?.some((input) => input.value.length>1)
    if(isValidatedata){
      const rawData = i?.map((d)=>({[d.name]:d.value}));
      let data = {};
      for(let i=2;i<rawData.length;i++){
        Object.assign(data,rawData[i]);
      }

      const branch = {
        ...rawData[0],
        ...rawData[1],
        metadata:data,
      }
      // handel mutation
      await branchMutation(branch)
    }

  }

  const branchMutation=async (branch)=>{
    try{
      await createBranch({variables: {input: branch}});
      await refetch();
      const openNotification = (message) => {
        api.success({
          message,
          placement:"topCenter",
          className: 'notification-without-close',
        });
      };
      openNotification("Branch created");

      onCancel();
    }
    catch(err){
      const openNotification = (description) => {
        api.warning({
          message: error,
          description,
          placement:"topCenter",
        });
      };
      openNotification(err);
    }
  }

  const handelChange=(e)=>{
    if(e.value.length>2){
      e.style.borderColor="rgba(0,208,228,.5)";
      e.style.boxShadow="0 0 4px 1px rgba(0,208,228,.3), 0 0 0 1px #00d0e4";
    }
  }

  return (
    <Modal
      visible={visible}
      className='slide-in-right-to-left-modal'
      width={600}
      footer={
        <div className='footer'>
            <Button disabled={loading} className='grid-filed-btn' onClick={handelSubmit}>Create</Button>
            <Button disabled={loading} className='grid-outlined-btn'>Create and add another</Button>
            <Button disabled={loading} className='grid-outlined-btn' onClick={onCancel}>Cancel</Button>
        </div>
      }
      closable={false}
    >
      {contextHolder}
      
      <React.Fragment>
        <div className='modal-header-title'>
            <span>Add Branch</span>
            <span  onClick={onCancel}><FontAwesomeIcon className='close' icon={faClose}/></span>
        </div>
        <div className='modal-body'>
          <div className='title' onClick={()=>navigate('/editform',{
        state: {
          title: 'Branch',
          url:'/user/branch',
        }
      })}> <FontAwesomeIcon icon={faExternalLink} style={{ marginLeft: 4 }} /> Edit this form </div>
          
          <form id="branchForm" className='form'>
            <Form.Item>
              <label>Branch Name</label>
              <Input className='input-control' onChange={(e)=>handelChange(e.target)} name="branchName" />
            </Form.Item>
            <Form.Item>
              <label>Post Code</label>
              <Input className='input-control' onChange={(e)=>handelChange(e.target)} name="postCode" />
            </Form.Item>
          {branchOrder?.map((branch)=>(
            <Form.Item>
              <label>{branch.content}</label>
              <Input className='input-control' onChange={(e)=>handelChange(e.target)} name={branch.content.replaceAll(" ","")} />
            </Form.Item>
            ))}            
          </form>
        </div>  
      </React.Fragment>  
    </Modal>
  );
};

export default AddBranch;
