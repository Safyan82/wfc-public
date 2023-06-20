import React,{ useEffect, useState } from 'react';
import { Form, Input, Drawer, Button, notification, Steps } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faClose, faExternalLink, faUmbrella } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_BRACNH } from '../../util/mutation/branch.mutation';
import './createFieldDrawer.css';
import Spinner from '../spinner';
import { BasicInfo } from './step1basicInfo';
import { FieldType } from './step2fieldType';


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
    const navigate = useNavigate();

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
        component: <BasicInfo basicInfo={basicInfo} setBasicInfo={setBasicInfo} />
      },
      {
        title: 'FIELD TYPE',
        component: <FieldType basicInfo={basicInfo}/>
      },
      {
        title: 'RULES',
        component:  <div>step3 </div>
      }
    ];
  
    const handleNext = () => {
      setCurrentStep(currentStep + 1);
    };
  
    const handlePrev = () => {
      setCurrentStep(currentStep - 1);
    };
  
      
      return (
        <div>
          <Drawer
            title="Create a new property "
            placement="right"
            closable={true}
            onClose={onClose}
            closeIcon={<FontAwesomeIcon icon={faClose} onClick={onClose} className='close-icon'/>}
            visible={visible}
            width={600}
            className='fieldDrawer'
            footer={
              <div className='drawer-footer' style={{display:'flex', justifyContent:'space-between'}}>
                  <div>
                  {currentStep > 0 &&
                    <button disabled={false} className={'drawer-outlined-btn'} onClick={handlePrev}>
                      <FontAwesomeIcon style={{marginRight:'0.5em'}} icon={faChevronLeft}/> {'Back'} 
                    </button>
                  }
                    <button className='drawer-btn' onClick={onClose}>Cancel</button>
                  </div>
                  
                  {currentStep < steps.length - 1 && 
                    <button className={currentStep ==0 && basicInfoCheck ? ' disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} onClick={handleNext}>
                    {'Next'} <FontAwesomeIcon className='next-btn-icon' icon={faChevronRight}/>
                    </button>
                  }

              </div>
            }
          >
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