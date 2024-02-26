import Spinner from '@src/components/spinner';
// import './createUserModal.css';
import React, { useState } from 'react';
import { Input, Modal, Steps } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Permission } from "../userSetting/component/permission/permission.component";
import { ReviewPermission } from '@src/components/reviewPermission/ReviewPermission';
import { resetPermission } from '@src/middleware/redux/reducers/permission.reducer';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import { createUserRoleMutation, updateUserRoleMutation } from '@src/util/mutation/userRole.mutation';
import { setNotification } from '@src/middleware/redux/reducers/notification.reducer';
import { setUserRoleToBeEdit } from '@src/middleware/redux/reducers/userRole.reducer';



export const CreateUserRoleModal = ({visible, onClose})=>{
    
    const [currentStep, setCurrentStep] = useState(0);
    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleNext = (e) => {
        setCurrentStep(currentStep + 1);
    };
    const {userRoleToBeEdit} = useSelector((state)=>state?.userRoleReducer);
    console.log(userRoleToBeEdit, "userRoleToBeEdit")
    const [roleName, setRoleName] = useState(userRoleToBeEdit?.rolename||"");
        
    const steps = [
        {
            title: 'Permissions',
            component: <Permission role />
        },
        {
            title:  'Role Info',
            component: <RoleInfo roleName={roleName} setRoleName={setRoleName} />
        },          
        {
            title: 'Review',
            component: <ReviewPermission userAccessType={false} roleName={roleName} />
        }
    ];

    const dispatch = useDispatch();
    const {propAccess} = useSelector(state=>state.permissionReducer);
    const [createUserRole, {loading}] = useMutation(createUserRoleMutation);
    const [updateUserRole, {loading:updateUserRoleLoading}] = useMutation(updateUserRoleMutation);
   
    const handelSubmit = async ()=>{
    
        try{
            if(userRoleToBeEdit?.hasOwnProperty('rolename')){

                
                await updateUserRole({
                    variables:{
                        input:{
                            _id: userRoleToBeEdit?._id,
                            rolename: roleName.toString(),
                            permission: Object.fromEntries(Object.entries(propAccess).slice(0,5)),
                        }
                    }
                });
                dispatch(setNotification({
                    notificationState:true, 
                    message:"User Role was updated",
                    error: false,
                }));

            }else{
             
                await createUserRole({
                    variables:{
                        input:{
                            rolename: roleName.toString(),
                            permission: Object.fromEntries(Object.entries(propAccess).slice(0,5)),
                        }
                    }
                });
                dispatch(setNotification({
                    notificationState:true, 
                    message:"New System User Role has been added",
                    error: false,
                }));
            }

            dispatch(setUserRoleToBeEdit(null));
            sessionStorage.removeItem("RoleEditDone");

            onClose();
        }
        catch(err){
            sessionStorage.removeItem("RoleEditDone");
            dispatch(setUserRoleToBeEdit(null));
            
            dispatch(setNotification({
                notificationState:true, 
                message:"An Error Encountered",
                error: true,
            }));

        }
    }

    return(
        <Modal
            visible={visible}     
            width="100%"
            height="100%"
            className='createUserModal'
            footer={
                <div className='drawer-footer' style={{marginTop:0, display:'flex', justifyContent:'space-between'}}>
                    <div>
                    {currentStep > 0 &&
                      <button disabled={false} className={'drawer-outlined-btn'} onClick={handlePrev}>
                        <FontAwesomeIcon style={{marginRight:'0.5em'}} icon={faChevronLeft}/> {'Back'} 
                      </button>
                    }
            
            
                      <button className='drawer-btn' onClick={()=>{dispatch(resetPermission()); dispatch(setUserRoleToBeEdit(null)); onClose(); sessionStorage.removeItem("RoleEditDone");}} >Cancel</button>
                    </div>
                    
                    {(currentStep < steps.length - 1) &&
                      <button id="nextBtn" disabled={currentStep==1 && roleName?.length<3 ? true : false} className={currentStep==1 && roleName?.length<3 ? ' disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} onClick={handleNext}>
                      {'Next'} <FontAwesomeIcon className='next-btn-icon' icon={faChevronRight}/>
                      </button>
                    } 
                    {currentStep == steps.length - 1 && 
                      <button disabled={loading} onClick={handelSubmit} className={(currentStep ==0) || false ? ' disabled-btn drawer-filled-btn' : 'drawer-filled-btn'}>
                      {loading? <Spinner/> : userRoleToBeEdit?.hasOwnProperty('rolename')?'Update' :'Create' }
                      </button>
                    }
  
                </div>
        }
        closable={false}
        >
            <div className='userModal modal-parent'>
                <div className="user-header">
                    <div className="text w-100">Create Role</div>
                    <Steps current={currentStep} progressDot={customDot}>
                    {steps.map((step, index) => (
                        <Step key={index} title={step.title} />
                    ))}
                    </Steps>
                    <div className="text w-100">Step {currentStep+1} of {steps?.length}</div>
                </div>
                <div>{steps[currentStep].component}</div>


            </div>
        </Modal>
    );
}


const { Step } = Steps;
const customDot = (dot, { status, index }) => {
  return (
    <div className={status=="process" ? 'custom-dot custom-icon-active' : status=='finish' ? 'custom-dot custom-icon-finished' : `custom-dot`}>
    </div>
  );
};


const RoleInfo = ({roleName, setRoleName})=>{
    
    return(
        <div style={{ margin:'auto', marginTop:'2%' , width:'60%', marginBottom:'5%' }}>
            <label style={{fontWeight: 'bold'}}>Role Name</label>
            <Input 
                className="generic-input-control"
                placeholder="Define Role Name"
                autoFocus
                value={roleName}
                onChange={(e)=>setRoleName(e.target.value)}
            />
            <div className="text">Specify a role name that aligns with the designated permissions and access levels configured previously.
            </div>
        </div>
    )
}

