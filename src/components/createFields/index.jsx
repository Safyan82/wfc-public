import './createFieldDrawer.css';
import React,{ useEffect, useState } from 'react';
import { Form, Input, Drawer, Button, notification, Steps } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faClose} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { BasicInfo } from './step1basicInfo';
import { FieldType } from './step2fieldType';
import { Rules } from './step3Rules';


const { Step } = Steps;
const customDot = (dot, { status, index }) => {
  return (
    <div className={status=="process" ? 'custom-dot custom-icon-active' : status=='finish' ? 'custom-dot custom-icon-finished' : `custom-dot`}>
    </div>
  );
};

export const CreateFieldDrawer = ({ visible, onClose, refetch }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [basicInfo, setBasicInfo] = useState(null);
    const [basicInfoCheck, setBasicInfoCheck] = useState(true);
    const [width, setWidth] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    const navigate = useNavigate();

    const clearandClose=()=>{
      setBasicInfo(null)
      onClose();
      sessionStorage.clear();
      setCurrentStep(0)
    }

    useEffect(()=>{
      sessionStorage.clear();
    },[])

    useEffect(()=>{
      if(basicInfo?.objectType?.length>0 && basicInfo?.group?.length>0 && basicInfo?.label?.length>0 ){
        setBasicInfoCheck(false);
      }else{
        setBasicInfoCheck(true);
      }
      console.log(basicInfo)
    },[basicInfo]);
    
    
    const steps = [
      {
        title: 'BASIC INFO',
        component: <BasicInfo basicInfo={basicInfo} setWidth={setWidth} setBasicInfo={setBasicInfo} />
      },
      {
        title: 'FIELD TYPE',
        component: <FieldType basicInfo={basicInfo} setWidth={setWidth}/>
      },
      {
        title: 'RULES',
        component: <Rules basicInfo={basicInfo} setWidth={setWidth} />
      }
    ];
  
    const handleNext = () => {
      setCurrentStep(currentStep + 1);
    };
  
    const handlePrev = () => {
      setCurrentStep(currentStep - 1);
    };
  
    const handelSubmit=()=>{
      clearandClose()
      api.success({
        message:'Field was created successfully',
        placement:"top",
        className: 'notification-without-close',
      });
    }  

    
    return (
        <div>
          <Drawer
            title="Create a new property "
            placement="right"
            closable={true}
            onClose={clearandClose}
            closeIcon={<FontAwesomeIcon icon={faClose} onClick={clearandClose} className='close-icon'/>}
            visible={visible}
            width={width ? 900 : 600}
            className='fieldDrawer'
            maskClosable={false}
            mask={true}
            footer={
              <div className='drawer-footer' style={{display:'flex', justifyContent:'space-between'}}>
                  <div>
                  {currentStep > 0 &&
                    <button disabled={false} className={'drawer-outlined-btn'} onClick={handlePrev}>
                      <FontAwesomeIcon style={{marginRight:'0.5em'}} icon={faChevronLeft}/> {'Back'} 
                    </button>
                  }
                    <button className='drawer-btn' onClick={clearandClose} >Cancel</button>
                  </div>
                  
                  {currentStep < steps.length - 1 && 
                    <button className={currentStep ==0 && basicInfoCheck ? ' disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} onClick={handleNext}>
                    {'Next'} <FontAwesomeIcon className='next-btn-icon' icon={faChevronRight}/>
                    </button>
                  } 
                  {currentStep == steps.length - 1 && 
                    <button onClick={handelSubmit} className={currentStep ==0 && basicInfoCheck ? ' disabled-btn drawer-filled-btn' : 'drawer-filled-btn'}>
                    {'Create'}
                    </button>
                  }

              </div>
            }
          >


          {contextHolder}

            {/* stepper header */}
            <Steps current={currentStep} progressDot={customDot}>
              {steps.map((step, index) => (
                <Step key={index} title={step.title} />
              ))}
            </Steps>

            {/* stepper body */}

            <div className='stepperBody'>{steps[currentStep].component}</div>
        </Drawer>
        </div>
      );
      
}