import './editField.css';
import React,{ useEffect, useState } from 'react';
import { Form, Input, Drawer, Button, notification, Steps, Popover, Tabs, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faClose, faCode} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { BasicInfo } from './step1basicInfo';
import { FieldType } from './step2fieldType';
import { Rules } from './step3Rules';
import { useDispatch } from 'react-redux';
import { resetEditRules, resetFieldState, resetRules, setRules, toggleSaveWhileUpdateProperty } from '../../middleware/redux/reducers/createField.reducer';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PROPERTIES, UPDATE_PROPERTY } from '../../util/mutation/properties.mutation';
import { GetProptyById } from '../../util/query/properties.query';
import { setEditPropertyId, setPropertyTobeEdit } from '../../middleware/redux/reducers/createField.reducer';
import { setNotification } from '../../middleware/redux/reducers/notification.reducer';
import TabPane from 'antd/es/tabs/TabPane';
import { Loader } from '../loader';
import Spinner from '../spinner';


export const EditFieldDrawer = ({ visible, onClose, refetch, groupList, groupLoading, propertyListRefetch }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [basicInfo, setBasicInfo] = useState({objectType: 'branches'});
    const [basicInfoCheck, setBasicInfoCheck] = useState(true);
    const [fieldType, setFieldType] = useState(sessionStorage.getItem('fieldType') || null);

    const [width, setWidth] = useState(false);

    
    const {propertyToBeEditId} = useSelector(state => state.createFieldReducer);
    const { loading: propertyLoading, data } =  useQuery(GetProptyById, {
      variables: { getPropertyById: (propertyToBeEditId)?.toString() || null },
      skip: !propertyToBeEditId,
      fetchPolicy: 'network-only'

    });




    const dispatch = useDispatch();

    useEffect(()=>{
      dispatch(setPropertyTobeEdit(data?.getPropertyById));
      if(data?.getPropertyById){

        setBasicInfo({
          objectType: data?.getPropertyById?.objectType,
          groupId: data?.getPropertyById?.groupId,
          groupName: data?.getPropertyById?.groupName,
          label: data?.getPropertyById?.label,
          description: data?.getPropertyById?.description,
          options: data?.getPropertyById?.options
        });
        setFieldType(data?.getPropertyById?.fieldType);
      };
    },[data]);


    

    const clearandClose=async()=>{
      await dispatch(resetFieldState());
      setBasicInfo(null);
      onClose();
      sessionStorage.clear();
      setCurrentStep(0)
    }


    useEffect(()=>{
      sessionStorage.clear();
    },[]);

    
    useEffect(()=>{
      if(
          (basicInfo?.objectType?.length>0 && basicInfo?.groupId?.length>0 && basicInfo?.label?.length>0) 
          ){
        setBasicInfoCheck(false);
      }else{
        setBasicInfoCheck(true);
      }
    },[basicInfo]);
  


   
  
  
    // mutation
    const [createProperty, {loading, error}] = useMutation(CREATE_PROPERTIES);
    const [updateProperty, {loading:updatePropertyLoading}] = useMutation(UPDATE_PROPERTY);
    const {labelValue, rules, propertyToBeEdit, toggleSaveBtn, globalFieldType} = useSelector((state) => state.createFieldReducer);
    


    const handelSubmit= async ()=>{
      const field = {
        ...basicInfo,
        fieldType,
        options: labelValue[0]?.key && labelValue,
        rules,
        id: propertyToBeEditId,
      }

      try{

        // call mutation 

        const {data} = await updateProperty({variables:{input:{...field}}});
  
        await propertyListRefetch();
        
        dispatch(setNotification({
          notificationState:true, 
          message:"Property was created successfully",
          error: false,
        }))
        


        clearandClose();
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

      }

    }  

    const [tabKey, setTabKey] = useState(0);
    const [nrules, setNRules] = useState(0);
    useEffect(()=>{
      if(propertyToBeEdit?.rules){

        setNRules(propertyToBeEdit && Object.values(propertyToBeEdit?.rules)?.filter((property) => property == true)?.length);
      }
    },[propertyToBeEdit]);

    // useEffect(()=>{
    //   if(rules && globalFieldType){
    //     dispatch(resetEditRules());
    //     setNRules(rules && Object.values(rules)?.filter((property) => property == true)?.length);
    //   }
    // },[globalFieldType]);

    
    return (
        <div>

          <Drawer
            title="Edit property "
            placement="right"
            closable={true}
            onClose={clearandClose}
            closeIcon={<FontAwesomeIcon icon={faClose} onClick={clearandClose} className='close-icon'/>}
            visible={visible}
            width={900}
            className='fieldDrawer'
            maskClosable={false}
            mask={true}
            footer={
              <div className='drawer-footer' style={{display:'flex', }}>
                  
                <button onClick={handelSubmit} className={updatePropertyLoading? 'disabled-btn drawer-filled-btn': 'drawer-filled-btn'}>
                {updatePropertyLoading? <Spinner/> :'Save'}
                </button>
                <button className='drawer-outlined-btn' onClick={clearandClose} >Cancel</button>
                  

              </div>
            }
          >

            {data?.getPropertyById?
             
            <div className='stepperBody ' style={{paddingTop:'0px'}}>
                <Form.Item >
                    <label>Label <sup>*</sup></label>
                    <div style={{display:'flex', columnGap:'16px'}}>
                        <Input className="generic-input-control"  
                        value={basicInfo?.label}
                        onChange={(e)=>setBasicInfo({...basicInfo, label:e.target.value})} />
                        <Popover 
                            overlayClassName="custom-popover"
                            content={<div>If you are using this property <br/> for an integration, you can <br/> access its internal name here.</div>} 
                            placement='left'
                            >
                            <FontAwesomeIcon icon={faCode}
                                style={{    
                                    marginTop: '13px',
                                    fontSize: '20px',
                                    color: '#0091ae',
                                    cursor: 'pointer',
                                }}
                            />
                        </Popover>
                    </div>
                </Form.Item>

                <div className='editFieldTabs'>
                    <Tabs defaultActiveKey="1" onChange={(key)=>setTabKey(key)}>
                        <TabPane tab={`Basic Info`} key="1">
                            <BasicInfo groupList={groupList} groupLoading={groupLoading} basicInfo={basicInfo} setWidth={setWidth} setBasicInfo={setBasicInfo} />
                        </TabPane>
                        <TabPane tab={`Field Type`} key="2">
                            <FieldType fieldType={fieldType} setFieldType={setFieldType} basicInfo={basicInfo} setWidth={setWidth}/>
                        </TabPane>
                        <TabPane tab={`Rules (${nrules})`} key="3">
                           {tabKey ==3 &&
                            <Rules 
                                propertyToBeEdit={propertyToBeEdit}
                                rules={rules}
                                basicInfo={basicInfo} setWidth={setWidth} />
                            } 
                        </TabPane>
                        <TabPane tab={`Used in (${0})`} key="4">
                          
                          <div className="editProperty-info-box">
                              <div className="head">0 <span className="microText">&nbsp; (out of 5)</span></div>
                              <span className="text">Number of branches with a value for this property</span>
                          </div>

                          <div className="text">
                          This property isn’t used by any other assets, like forms, workflows, or lists.”
                          </div>
            
                        </TabPane>
                    </Tabs>
                </div>
            </div>
            :
             <Loader/>
            }
        </Drawer>
        </div>
      );
      
}