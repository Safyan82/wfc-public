import "../userSetting/component/permission/permission.css";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinner from "../../components/spinner";
import { useState } from "react";
import { Input, Steps } from "antd";
import { Permission, PermissionComponent } from "../userSetting/component/permission/permission.component";

export const UserRole = () => {

        
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
            title:  'Role Info',
            component: <RoleInfo roleName={roleName} setRoleName={setRoleName} />
        }, 
        {
            title: 'Permissions',
            component: <Permission role />
        }, 
        {
            title: 'Review'
        }
    ];

    return(
        <div className="setting-body">
        <div className="setting-body-inner">
            <div className='setting-body-inner'>

                <div className="setting-body-title">
                    <div className='setting-body-inner-title'>
                        User Roles
                    </div>
                </div>
                
                <div className="text">
                    Creation of new roles and efficient management of field-level access. Elevate control and security effortlessly for a more streamlined user experience.
                </div>

                    {/* Stepper Top */}
                    <div style={{width: '100%'}}>
                        <Steps current={currentStep} progressDot={customDot}>
                            {steps.map((step, index) => (
                                <Step key={index} title={step.title} />
                                ))}
                        </Steps>
                    </div>


                    <div style={{padding: '15px 0', 
                    // marginTop: 'calc(100% - 850px)', 
                    fontSize: '14px'}}>{steps[currentStep].component}</div>


                    {/* stepper footer */}
                    <div style={{display:'flex', justifyContent:'space-between', background: 'transparent', 
                        // marginTop: 'calc(100% - 409px)'
                    }}>
                        <div>
                        {currentStep > 0 &&
                            <button disabled={false} className={'drawer-outlined-btn'} onClick={handlePrev}>
                            <FontAwesomeIcon style={{marginRight:'0.5em'}} icon={faChevronLeft}/> {'Back'} 
                            </button>
                        }
                        </div>
                        
                        {(currentStep < steps.length - 1) &&
                            <button id="nextBtn" className={roleName?.length<3? ' disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} onClick={handleNext}>
                            {'Next'} <FontAwesomeIcon className='next-btn-icon' icon={faChevronRight}/>
                            </button>
                        } 
                        {currentStep == steps.length - 1 && 
                            <button disabled={false} onClick={null} className={(currentStep ==0) || false ? ' disabled-btn drawer-filled-btn' : 'drawer-filled-btn'}>
                            {false? <Spinner/> :'Create'}
                            </button>
                        }

                    </div>
            </div>
        </div>

        </div>
    );
};


const RoleInfo = ({roleName, setRoleName})=>{
    
    return(
        <div style={{ margin:'auto' , width:'60%'}}>
            <Input 
                className="generic-input-control"
                placeholder="Define New Role Name"
                autoFocus
                value={roleName}
                onChange={(e)=>setRoleName(e.target.value)}
            />
        </div>
    )
}


const { Step } = Steps;
const customDot = (dot, { status, index }) => {
  return (
    <div className={status=="process" ? 'custom-dot custom-icon-active' : status=='finish' ? 'custom-dot custom-icon-finished' : `custom-dot`}>
    </div>
  );
};