import Spinner from '../../components/spinner';
// import './createUserModal.css';
import React, { useState } from 'react';
import { Input, Modal, Steps } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Permission } from "../userSetting/component/permission/permission.component";
import { ReviewPermission } from '../../components/reviewPermission/ReviewPermission';



export const CreateUserRoleModal = ({visible, onClose})=>{
    
    const [currentStep, setCurrentStep] = useState(0);
    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleNext = (e) => {
        setCurrentStep(currentStep + 1);
    };
    const [roleName, setRoleName] = useState("");
        
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
            component: <ReviewPermission roleName={roleName} />
        }
    ];

      

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
                      <button className='drawer-btn' onClick={onClose} >Cancel</button>
                    </div>
                    
                    {(currentStep < steps.length - 1) &&
                      <button id="nextBtn" disabled={currentStep==1 && roleName?.length<3 ? true : false} className={currentStep==1 && roleName?.length<3 ? ' disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} onClick={handleNext}>
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

