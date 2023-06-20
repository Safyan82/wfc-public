import React,{ useState } from 'react';
import { Form, Input, Drawer, Button, notification, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_BRACNH } from '../../util/mutation/branch.mutation';

import './drawer.css';
import Spinner from '../../components/spinner';

export const FormDrawer = ({ visible, onClose, refetch }) => {
    const [drawerVisible, setDrawerVisible] = useState(false);
      const navigate = useNavigate();
      
      const branchOrder = JSON.parse(localStorage.getItem("branchOrder"));
      
      const [createBranch, { loading, error }] = useMutation(CREATE_BRACNH);
      const [api, contextHolder] = notification.useNotification();
      const [isoverlay, setIsOverlay] = useState(true);
    
    
      const handelSubmit=async ()=>{
        const branchForm = document.getElementById("branchForm");
        const inputs = (branchForm.querySelectorAll("input"));
        let i = [];
        inputs.forEach((input)=>{
          i.push(input);
          if(input.value.length<2 && input.name=="BranchName" || input.name=="postCode"){
            input.style.borderColor="red";
            input.style.boxShadow="0 0 4px 1px red, 0 0 0 1px red";
            return
          }else{
            
            input.style.borderColor="#cbd6e2";
            input.style.boxShadow="none";
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
    
          onClose();
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
            if(e.name=="branchName"){
                setIsOverlay(false);
            }
          e.style.borderColor="rgba(0,208,228,.5)";
          e.style.boxShadow="0 0 4px 1px rgba(0,208,228,.3), 0 0 0 1px #00d0e4";
        }else{
            if(e.name=="branchName"){
                setIsOverlay(true);
            }
        }
      }

      const onBlurDesign = (e) =>{
        e.style.borderColor="#cbd6e2";
        e.style.boxShadow="none";
      }
    
      
      return (
        <div>
          <Drawer
            title="Create Branch "
            placement="right"
            closable={true}
            onClose={onClose}
            closeIcon={<FontAwesomeIcon icon={faClose} onClick={onClose} className='close-icon'/>}
            visible={visible}
            width={600}
            footer={
              <div className='drawer-footer'>
                  <button disabled={isoverlay || loading} className={isoverlay || loading ? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} onClick={handelSubmit}>
                   {loading? <Spinner color={"#ff7a53"}/> : 'Create'} 
                  </button>
                  <button disabled={isoverlay || loading} className={isoverlay || loading ? 'disabled-btn drawer-outlined-btn' : 'drawer-outlined-btn'} >
                    Create and add another
                  </button>
                  <button disabled={loading} className='drawer-outlined-btn' onClick={onClose}>Cancel</button>
              </div>
            }
          >
            <div className='title' 
                onClick={()=>navigate('/editfrom',{
                    state: {
                    title: 'Branch',
                    url:'/user/branch',
                    }
                })}
            ><FontAwesomeIcon icon={faExternalLink} style={{ marginLeft: 4 }} /> Edit this form </div>
          
            <form id="branchForm" className='form' >
                <div className={isoverlay? 'overlay' : 'overlay hidden'}>
                    <div className='overlay-text'>Start by entering the Branch's name</div>
                </div>
                <Form.Item>
                <label>Branch Name <sup className='mandatory'>*</sup></label>
                <Input className='input-control' onBlur={(e)=>onBlurDesign(e.target)} onChange={(e)=>handelChange(e.target)} name="branchName" />
                </Form.Item>
                <Form.Item>
                <label>Post Code <sup className='mandatory'>*</sup></label>
                <Input className='input-control' onBlur={(e)=>onBlurDesign(e.target)} onChange={(e)=>handelChange(e.target)} name="postCode" />
                </Form.Item>
            {branchOrder?.map((branch)=>(
                <Form.Item>
                <label>{branch.content}</label>
                <Input className='input-control' onBlur={(e)=>onBlurDesign(e.target)} onChange={(e)=>handelChange(e.target)} name={branch.content.replaceAll(" ","")} />
                </Form.Item>
                ))}            
            </form>
            
        </Drawer>
        </div>
      );
      
}