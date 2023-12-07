import Spinner from '../../../components/spinner';
import './createUserModal.css';
import React, { useState } from 'react';
import { Modal, Steps } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { CreateUserComponent } from '../component/createUserComponent/createUser.component';
import { PermissionComponent } from '../component/permission/permission.component';



export const CreateUserModal = ({visible, onClose})=>{
    
    const [currentStep, setCurrentStep] = useState(0);
    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleNext = (e) => {
        setCurrentStep(currentStep + 1);
    };
        
    const steps = [
        {
          title: 'EMPLOYEE DETAIL',
          component: <CreateUserComponent />
        },
        {
          title: 'PERMISSIONS',
          component: <PermissionComponent />
        },
        {
          title: 'REVIEW',
        //   component: <Review basicInfo={basicInfo} setWidth={setWidth} />
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
                      <button className='drawer-btn' onClick={onClose} >Cancel</button>
                    </div>
                    
                    {(currentStep < steps.length - 1) &&
                      <button id="nextBtn" className={false? ' disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} onClick={handleNext}>
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
            <div className='userModal'>
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