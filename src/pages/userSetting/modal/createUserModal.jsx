import Spinner from '../../../components/spinner';
import './createUserModal.css';
import React, { useEffect, useState } from 'react';
import { Modal, Steps } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { CreateUserComponent } from '../component/createUserComponent/createUser.component';
import { PermissionComponent } from '../component/permission/permission.component';
import { ReviewPermission } from '../../../components/reviewPermission/ReviewPermission';
import { useDispatch } from 'react-redux';
import { resetPermission, setPreDefinedDBPermission } from '../../../middleware/redux/reducers/permission.reducer';
import { useSelector } from 'react-redux';
import { resetUserDetail } from '../../../middleware/redux/reducers/user.reducer';



export const CreateUserModal = ({visible, onClose})=>{
    
    const [currentStep, setCurrentStep] = useState(0);
    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleNext = (e) => {
        setCurrentStep(currentStep + 1);
    };
    
    const [userAccessType, setUserAccessType] = useState("standardPermissions");
    const [userRole, setuserRole] = useState("");
    
    // check the user role and populate propAccess attribute in redux for review component at the end of the step

    const dispatch = useDispatch();
    useEffect(()=>{
      if(userRole.hasOwnProperty('permission')){
        dispatch(setPreDefinedDBPermission(userRole?.permission));
      }
    },[userRole]);

    useEffect(()=>{
      // if(userRole.hasOwnProperty('permission')){
        dispatch(resetPermission());
      // }
    },[userAccessType]);

    
    useEffect(()=>{
      // if(userRole.hasOwnProperty('permission')){
        dispatch(resetPermission());
      // }
    },[]);

    const {userDetail} = useSelector(state=> state.userDetailReducer);

    const steps = [
        {
          title: 'PERMISSIONS',
          component: <PermissionComponent 
          userAccessType={userAccessType} 
          setUserAccessType={setUserAccessType} 
          userRole={userRole}
          setuserRole={setuserRole}
          role/>
        },
        {
          title: 'USER DETAIL',
          component: <CreateUserComponent />
        },
        {
          title: 'REVIEW',
          component: userRole?.permission ? <ReviewPermission user={userDetail}/> : null
        }
    ];


      

    return(
        <Modal
            visible={visible}     
            width="100%"
            height="100vh"
            className='createUserModal'
            style={{ top: 10, height: '100vh', paddingBottom: 10 }}
            footer={
                <div className='drawer-footer' style={{marginTop:0, display:'flex', justifyContent:'space-between'}}>
                    <div>
                    {currentStep > 0 &&
                      <button disabled={false} className={'drawer-outlined-btn'} onClick={handlePrev}>
                        <FontAwesomeIcon style={{marginRight:'0.5em'}} icon={faChevronLeft}/> {'Back'} 
                      </button>
                    }
        
                      <button className='drawer-btn' onClick={async ()=>{
                        // await dispatch(setPreDefinedDBPermission(userRole?.permission)); 
                        await dispatch(resetPermission());
                        await dispatch(resetUserDetail());
                        onClose();}} >Cancel</button>
                    </div>
                    
                    {(currentStep < steps.length - 1) &&
                      <button id="nextBtn" 
                      disabled={currentStep==0 && userAccessType==="standardPermissions" && userRole?.length<1  || currentStep===1 && userDetail && Object.keys(userDetail)?.length<1 ? true : false}
                      className={currentStep==0 && userAccessType==="standardPermissions" && userRole?.length<1 || currentStep===1 && userDetail && Object.keys(userDetail)?.length<1 ? ' disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} onClick={handleNext}>
                      {'Next'} <FontAwesomeIcon className='next-btn-icon' icon={faChevronRight}/>
                      </button>
                    } 
                    {currentStep == steps.length - 1 && 
                      <button disabled={false} onClick={null} className={(currentStep ==0) || false ? ' disabled-btn drawer-filled-btn' : 'drawer-filled-btn'}>
                      {false? <Spinner/> :'Create'}
                      </button>
                    }
  
                </div>
        }
        closable={false}
        >
            <div className='userModal modal-parent'>
                <div className="user-header">
                    <div className="text w-100">Create User</div>
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