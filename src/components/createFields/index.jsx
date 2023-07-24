import './createFieldDrawer.css';
import React,{ useEffect, useState } from 'react';
import { Form, Input, Drawer, Button, notification, Steps } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faClose} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { BasicInfo } from './step1basicInfo';
import { FieldType } from './step2fieldType';
import { Rules } from './step3Rules';
import { useDispatch } from 'react-redux';
import { resetFieldState, resetRules, setRules } from '../../middleware/redux/reducers/createField.reducer';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PROPERTIES } from '../../util/mutation/properties.mutation';
import { GetProptyById } from '../../util/query/properties.query';
import { setEditPropertyId, setPropertyTobeEdit } from '../../middleware/redux/reducers/createField.reducer';
import { setNotification } from '../../middleware/redux/reducers/notification.reducer';
import { Loader } from '../loader';
import Spinner from '../spinner';


const { Step } = Steps;
const customDot = (dot, { status, index }) => {
  return (
    <div className={status=="process" ? 'custom-dot custom-icon-active' : status=='finish' ? 'custom-dot custom-icon-finished' : `custom-dot`}>
    </div>
  );
};

export const CreateFieldDrawer = ({ visible, onClose, refetch, propertyListRefetch }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [basicInfo, setBasicInfo] = useState({objectType: 'branches'});
    const [basicInfoCheck, setBasicInfoCheck] = useState(true);
    const [fieldType, setFieldType] = useState(sessionStorage.getItem('fieldType') || null);

    const [width, setWidth] = useState(false);

    const navigate = useNavigate();

    
    const {propertyToBeEditId} = useSelector(state => state.createFieldReducer);
    const { loading: propertyLoading, data } =  useQuery(GetProptyById, {
      variables: { getPropertyById: (propertyToBeEditId)?.toString() || null },
      skip: !propertyToBeEditId,
      fetchPolicy: 'network-only'
      },
      
    );

    const dispatch = useDispatch();

    useEffect(()=>{
      if(propertyToBeEditId){
      dispatch(setPropertyTobeEdit(data?.getPropertyById));
      if(data?.getPropertyById){

        setBasicInfo({
          objectType: data?.getPropertyById?.objectType,
          groupId: data?.getPropertyById?.groupId,
          groupName: data?.getPropertyById?.groupName,
          label: data?.getPropertyById?.label+" (Clone)",
          description: data?.getPropertyById?.description,
          options: data?.getPropertyById?.options
        });
        setFieldType(data?.getPropertyById?.fieldType);
      };};
    },[data]);


    

    const clearandClose=async()=>{
      // await dispatch(setPropertyTobeEdit(null));
      // await dispatch(setEditPropertyId(''));
      // await dispatch(resetRules({}));
      await dispatch(resetFieldState());
      onClose();
      setBasicInfo(null);
      sessionStorage.clear();
      setCurrentStep(0)
    }


    useEffect(()=>{
      sessionStorage.clear();
    },[]);

    useEffect(()=>{
      if(!propertyToBeEditId){
        dispatch(resetFieldState());  
        setBasicInfo(null);
        sessionStorage.clear();
        setCurrentStep(0)
      }
    },[propertyToBeEditId])
    
    useEffect(()=>{
      if(
          (basicInfo?.objectType?.length>0 && basicInfo?.groupId?.length>0 && basicInfo?.label?.length>0) 
        ){
        setBasicInfoCheck(false);
      }else{
        setBasicInfoCheck(true);
      }
    },[basicInfo]);
    
    
    const steps = [
      {
        title: 'BASIC INFO',
        component: <BasicInfo  basicInfo={basicInfo} setWidth={setWidth} setBasicInfo={setBasicInfo} />
      },
      {
        title: 'FIELD TYPE',
        component: <FieldType fieldType={fieldType} setFieldType={setFieldType} basicInfo={basicInfo} setWidth={setWidth}/>
      },
      {
        title: 'RULES',
        component: <Rules basicInfo={basicInfo} setWidth={setWidth} />
      }
    ];
  
    const handleNext = (e) => {
      setCurrentStep(currentStep + 1);
    };

    useEffect(()=>{
      if(currentStep==1 && fieldType==null){
        document.getElementById("nextBtn")?.classList.add("disabled-btn");
      }
    },[currentStep]);

    useEffect(()=>{
      if(fieldType){
        document.getElementById("nextBtn")?.classList.remove("disabled-btn");
      }
    },[fieldType])

   
  
    const handlePrev = () => {
      setCurrentStep(currentStep - 1);
    };
  
    // mutation
    const [createProperty, {loading, error}] = useMutation(CREATE_PROPERTIES);
    const {labelValue, rules} = useSelector((state) => state.createFieldReducer);
    
    const [disableBtn, setDisabledBtn] = useState(false);

    const handelSubmit= async ()=>{
      setDisabledBtn(true);
      const field = {
        ...basicInfo,
        fieldType,
        options: labelValue[0]?.key && labelValue,
        rules
      }

      try{

        // call mutation 

        const {data} = await createProperty({variables:{input:{...field}}});
        clearandClose();
        dispatch(setNotification({
          notificationState:true, 
          message:"Property was created successfully",
          error: false,
        }))
  
        await propertyListRefetch();
        
        setDisabledBtn(false);
        


      }
      catch(err){
        clearandClose();
        dispatch(setNotification(
          {
            notificationState:true, 
            message: err.message,
            error: true,
          }
        ));

      setDisabledBtn(false);


      }

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
                  
                  {(currentStep < steps.length - 1) && !disableBtn &&
                    <button id="nextBtn" className={currentStep ==0 && basicInfoCheck ?' disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} onClick={handleNext}>
                    {'Next'} <FontAwesomeIcon className='next-btn-icon' icon={faChevronRight}/>
                    </button>
                  } 
                  {currentStep == steps.length - 1 && 
                    <button disabled={loading || disableBtn} onClick={handelSubmit} className={(currentStep ==0 && basicInfoCheck) || loading || disableBtn ? ' disabled-btn drawer-filled-btn' : 'drawer-filled-btn'}>
                    {loading || disableBtn? <Spinner/> :'Create'}
                    </button>
                  }

              </div>
            }
          >




            {/* stepper body */}
            {propertyLoading?
              <Loader/>
              :  
              <>
                {/* stepper header */}
                <Steps current={currentStep} progressDot={customDot}>
                  {steps.map((step, index) => (
                    <Step key={index} title={step.title} />
                  ))}
                </Steps>
                <div className='stepperBody'>{steps[currentStep].component}</div>
              </>
            }
        </Drawer>
        </div>
      );
      
}