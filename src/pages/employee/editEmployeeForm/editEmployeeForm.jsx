// import './editform.css';
// import '../../assets/default.css';
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk, faChevronLeft, faChevronRight, faEllipsisH, faStar } from "@fortawesome/free-solid-svg-icons";
import { Button, Divider, Form, Input, notification } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import DraggableList from '../../../components/shuffle/draggeableList';
import { AddProperty } from './AddProperty.modal';
import { Popover } from "antd";
import { ApartmentOutlined } from "@ant-design/icons";
import { faDeleteLeft, faEdit, faTrash, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from 'react-redux';
import { addFieldToBranchSchema, removeFieldFromBranchSchema, resetbranchSchemaNewFields, setBranchSchema } from '../../../middleware/redux/reducers/branch.reducer';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import { BulkBranchObjectMutation, BulkDeleteBranchObjectMutation } from '../../../util/mutation/branch.mutation';
import { Loader } from '../../../components/loader';
import { setNotification } from '../../../middleware/redux/reducers/notification.reducer';

import { EmployeeObjectQuery } from '../../../util/query/employee.query';
import { FormHeader } from "../../../components/header/header";
import { BulkDeleteEmployeeObjectMutation, BulkEmployeeObjectCreationMutation, bulkUpdateEmployeeObjectOrderMutation } from "../../../util/mutation/employeeObject.mutation";
import Spinner from "../../../components/spinner";

export const EditEmployeeForm=()=>{
    const location = useLocation();
    // const title= "Employee Form";
    // const url= "";
    const {title="Employee", url=""} = location?.state || {title:"Employee", url:""};
    const [modalState, setModalState] = useState(false);


    const {data:employeeObject, loading: employeeObjectLoading, refetch: employeeObjectRefetch} = useQuery(EmployeeObjectQuery,{
      fetchPolicy: 'network-only',
    });


    const [createBulkProperties, {loading: createBulkPropertiesLoading, error}] = useMutation(BulkEmployeeObjectCreationMutation);
    
    const [mandatory, setMandatory] = useState([]);

    const { branchSchemaNewFields } = useSelector(state=>state.branchReducer);
    const [branchSchemaLocal, setBranchSchemaLocal] = useState([...branchSchemaNewFields]);
    useEffect(()=>{
      employeeObjectRefetch();
    }, []);
    useEffect(()=>{
      setBranchSchemaLocal([...branchSchemaNewFields]);
    }, [branchSchemaNewFields]);

    useEffect(()=>{

      console.log(branchSchemaLocal.sort((a, b) => a?.order - b?.order), "sort", branchSchemaLocal)
    },[branchSchemaLocal]);
    
    const dispatch = useDispatch();
    useEffect(()=>{
      if(!employeeObjectLoading){

        const mandatoryFields = employeeObject?.getEmployeeObject?.response?.filter((property)=> property.isReadOnly===true);
        setMandatory(mandatoryFields);
        dispatch(setBranchSchema(employeeObject?.getEmployeeObject?.response));

        employeeObject?.getEmployeeObject?.response?.filter((property)=> property.isReadOnly!==true)?.map((field)=>{
          const propData = {
            label:field?.propertyDetail?.label,
            _id:field?.propertyId,
            isMandatory:field?.isMandatory,
            isLocalDeleted: 0,
            order: field?.order
          }
          dispatch(addFieldToBranchSchema (propData));
        });

        
      }
    },[employeeObject]);

    const[isPropOpen, setProp]=useState(false);

    const [deleteProperties, {loading: deletePropertiesLoading}] = useMutation(BulkDeleteEmployeeObjectMutation);

    const [loading, setLoading] = useState(false);

    useEffect(()=>{
      if(deletePropertiesLoading || createBulkPropertiesLoading || employeeObjectLoading){
        setLoading(true);
      }else{
        setLoading(false);
      }
    },[deletePropertiesLoading, createBulkPropertiesLoading, employeeObjectLoading ]); 

    const [api, contextHolder] = notification.useNotification();

    const [btnDisabled, setBtnDisabled] = useState(false);
    useEffect(()=>{
      
      const props = branchSchemaNewFields.filter((schema)=> (schema?.isLocalDeleted==0 && schema?.isNew==1));
      const deletedProps = branchSchemaNewFields.filter((schema)=> (schema?.isLocalDeleted==1));
      if(props?.length>0 || deletedProps?.length>0){
        setBtnDisabled(false);
      }else{
        setBtnDisabled(false);
      }
    },[branchSchemaNewFields]);

    
    const handelSave = async() => {
      if(branchSchemaNewFields?.length>0){
        const props = branchSchemaNewFields.filter((schema)=> (schema?.isLocalDeleted==0));
        const deletedProps = branchSchemaNewFields.filter((schema)=> (schema?.isLocalDeleted==1));
        if(deletedProps?.length>0){
          await deleteProperties({
            variables:{
              input: {properties: deletedProps?.map((props)=>(props._id))}
            }
          })
        }
        if(props?.length>0){
          await createBulkProperties({
            variables:{
              input:{
                fields: props.map((schema)=>({propertyId: schema?._id, isMandatory: schema?.isMandatory || false}))
              }
            }
          });
        }
        dispatch(setNotification({
          notificationState:true, 
          message:"Changes were saved",
          error: false,
        }));
        await employeeObjectRefetch();
      }
    }


    const {propertyToBeRemoveFromSchema} = useSelector((state)=>state.branchReducer);
    
    useEffect(()=>{
      if(propertyToBeRemoveFromSchema){
          dispatch(removeFieldFromBranchSchema({_id: propertyToBeRemoveFromSchema}));
      }
    },[propertyToBeRemoveFromSchema]);

    const [reorderEmployeeObjectSchema] = useMutation(bulkUpdateEmployeeObjectOrderMutation)
    
    
    // on session terminate of this page clear the 
    useEffect(()=>{
      return()=>{
        // resetbranchSchemaNewFields
        dispatch(resetbranchSchemaNewFields());
      }
    },[]);

    const navigate = useNavigate();
    const [openDrawer, setOpenDrawer] = useState(false);
    return(
        <div className="setting-body" style={url?{margin:'0',padding:'0'}:{}}>
          {contextHolder}
          <div className="setting-body-inner">
            <div className="setting-body-inner">

            <div className="setting-body-title">

              <div className='setting-body-inner-title'>
                Edit Employee Form 
                
              </div>

              <div className='btn-group' style={{gap:'20px'}}>
                <button disabled={loading} className={loading?"drawer-outlined-btn disabled-btn": "drawer-outlined-btn"} onClick={()=>navigate(url)}>Preview</button>
                <button disabled={loading || btnDisabled} className={loading || btnDisabled? "drawer-filled-btn disabled-btn":"drawer-filled-btn "} onClick={handelSave}> {loading? <Spinner/> : "Save"}</button>   
              </div>

            </div>

            
            <div className="text">
              The Edit Employee Form streamlines the creation of new branches. It collects essential information like branch name, location, contact details.
            </div>
                  
              <div className="form-section">
                  <div className="form-section-inner">
                      <div className="modal-header-title">
                          Edit Employee Form
                            
                          <Popover
                            content={
                              <div className="editFormPop">
                                <span  onClick={()=>{setOpenDrawer(true);setProp(true);}} >Add properties</span>
                                <span className='disabled'>Add conditional logic</span>
                                <span className='disabled'>Add associations</span>
                              </div>
                            }

                          > 
                            <FontAwesomeIcon icon={faEllipsisH} style={{color:'white', cursor: 'pointer'}}/> 
                          </Popover>

                      </div>
                      
                      <div className="form-section-body form"  style={{marginTop:'3%'}}> 
                      {loading &&
                      <div style={{
                        height:'100%',
                        width: "90%",
                        background: "white",position:'absolute',
                        opacity: 0.8,}}>
                          <Loader/>
                        </div>
                      }

                      

                        {/* branch name */}
                        {mandatory?.map((field)=>(
                          <div className="icon-wrapper">
                            <div className="delete-icon">
                              <Popover 
                                overlayClassName="custom-popover"
                                content={"This Property is a part of object schema"} 
                                placement='top'
                              >
                                <FontAwesomeIcon icon={faTrashAlt} />
                              </Popover>
                              
                              <Popover 
                                overlayClassName="custom-popover"
                                content={"Conditional logic is not available for non-enumerated properties."} 
                                placement='top'
                              >
                                <ApartmentOutlined />
                              </Popover>

                              
                              <Popover 
                              overlayClassName="custom-popover"
                              content={"Make this property mandatory"} 
                              placement='top'
                              >
                                <FontAwesomeIcon icon={faAsterisk} />
                              </Popover>

                            </div>
                            <div
                              className="edit-form-input-control input inputItemList"   
                              style={{backgroundImage: "none", cursor: "auto"}}                    
                            >
                              <span className='draggeableTable-text'>
                                {field?.propertyDetail?.label}
                              </span>
                            </div>
                          </div>
                        ))}

                        <DraggableList
                          reorderSchema = {reorderEmployeeObjectSchema}
                          list={branchSchemaNewFields?.length>0 ? branchSchemaLocal.sort((a, b) => a?.order - b?.order) : []} 
                          objectRefetch={employeeObjectRefetch}
                        />        
                                      
                        </div>
                      
                      

                  </div>
              </div>

            </div>

          </div>
          {/* side drawer */}
          <AddProperty
            close={()=>setOpenDrawer(false)}
            visible={openDrawer}
            setProp={setProp}
            isPropOpen={isPropOpen}
          />
            
        </div>
    );
}


