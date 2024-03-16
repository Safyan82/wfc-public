import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk, faChevronLeft, faChevronRight, faEllipsisH, faStar } from "@fortawesome/free-solid-svg-icons";
import { Button, Divider, Form, Input, notification } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import DraggableList from '../../../components/shuffle/draggeableList';
import { AddProperty } from './AddProperty.modal';
import { Popover } from "antd";
import { ApartmentOutlined } from "@ant-design/icons";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from 'react-redux';
import { addFieldToBranchSchema, removeFieldFromBranchSchema, resetBranch, resetbranchSchemaNewFields, setBranchSchema } from '../../../middleware/redux/reducers/branch.reducer';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import { Loader } from '../../../components/loader';
import { setNotification } from '../../../middleware/redux/reducers/notification.reducer';

import { BulkCustomerObjectCreationMutation, BulkDeleteCustomerObjectMutation, BulkDeleteEmployeeObjectMutation, BulkDeleteSiteGroupObjectMutation, bulkUpdateCustomerObjectOrderMutation, bulkUpdateEmployeeObjectOrderMutation, bulkUpdateSiteGroupObjectOrderMutation } from "../../../util/mutation/customerObject.mutation";

import { CustomerObjectQuery } from "@src/util/query/customer.query";

export const EditCustomerForm=()=>{
    const location = useLocation();
    // const title= "Employee Form";
    // const url= "";
    const {title="Customer", url=""} = location?.state || {title:"Customer", url:""};
    const [modalState, setModalState] = useState(false);


    const {data:customerObject, loading: customerObjectLoading, refetch: customerObjectRefetch} = useQuery(CustomerObjectQuery,{
      fetchPolicy: 'network-only',
    });


    const [createBulkProperties, {loading: createBulkPropertiesLoading, error}] = useMutation(BulkCustomerObjectCreationMutation);
    
    const [mandatory, setMandatory] = useState([]);

    const { branchSchemaNewFields } = useSelector(state=>state.branchReducer);
    const [branchSchemaLocal, setBranchSchemaLocal] = useState([...branchSchemaNewFields]);
    useEffect(()=>{
      customerObjectRefetch();
    }, []);
    useEffect(()=>{
      setBranchSchemaLocal([...branchSchemaNewFields]);
    }, [branchSchemaNewFields]);

    
    const dispatch = useDispatch();
    const [cancel,setCancel] = useState(false);
    const [addProperty, setAddProperty] = useState(false);
    
    useEffect(()=>{
      if(!customerObjectLoading){
        dispatch(resetBranch());
        console.log(customerObject, "customerObject");
        //customerObject?.getCustomerObject?.response
        const mandatoryFields = customerObject?.getCustomerObject?.response?.filter((property)=> property.isReadOnly===true);
        setMandatory(mandatoryFields);
        dispatch(setBranchSchema(customerObject?.getCustomerObject?.response));

        customerObject?.getCustomerObject?.response?.filter((property)=> property.isReadOnly!==true)?.map((field)=>{
          const propData = {
            label:field?.propertyDetail?.label,
            _id:field?.propertyId,
            isMandatory:field?.isMandatory,
            isLocalDeleted: 0,
            order: field?.order
          }
          dispatch(addFieldToBranchSchema(propData));
        });
        setAddProperty(true)
        setCancel(false);
      }
    },[customerObject]);

    const[isPropOpen, setProp]=useState(false);

    const [deleteProperties, {loading: deletePropertiesLoading}] = useMutation(BulkDeleteCustomerObjectMutation);

    const [loading, setLoading] = useState(false);

    useEffect(()=>{
      if(deletePropertiesLoading || createBulkPropertiesLoading || customerObjectLoading){
        setLoading(true);
      }else{
        setLoading(false);
      }
    },[deletePropertiesLoading, createBulkPropertiesLoading, customerObjectLoading ]); 

    
    const [btnDisabled, setBtnDisabled] = useState(false);
    
    useEffect(()=>{
      
      if(customerObject?.getCustomerObject?.response){

        const props = branchSchemaNewFields.filter((schema)=> (schema?.isLocalDeleted==0 && schema?.isNew==1));
        const deletedProps = branchSchemaNewFields.filter((schema)=> (schema?.isLocalDeleted==1));
        const object = customerObject?.getCustomerObject?.response?.filter((property)=> property.isReadOnly!==true );
        const isChange =  branchSchemaNewFields?.find((schema)=>(object.find((property)=> property?.propertyId === schema?._id && property?.isMandatory !== schema?.isMandatory )));
        // console.log(props?.length>0 || deletedProps?.length>0 || isChange, isChange, "tttttds",object , branchSchemaNewFields)

        if(props?.length>0 || deletedProps?.length>0 || isChange){
          setBtnDisabled(false);
        }else{
          setBtnDisabled(true);
        }

      }
    },[branchSchemaNewFields,createBulkPropertiesLoading,deletePropertiesLoading,customerObject]);

    
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
        // setBtnDisabled(true);
        await customerObjectRefetch();
        setCancel(true);

      }
    }

    
    useEffect(() =>{
      if(cancel){
        if(!customerObjectLoading){
          dispatch(resetBranch());
  
          const mandatoryFields = customerObject?.getCustomerObject?.response?.filter((property)=> property.isReadOnly===true);
          setMandatory(mandatoryFields);
          dispatch(setBranchSchema(customerObject?.getCustomerObject?.response));
  
          customerObject?.getCustomerObject?.response?.filter((property)=> property.isReadOnly!==true)?.map((field)=>{
            const propData = {
              label:field?.propertyDetail?.label,
              _id:field?.propertyId,
              isMandatory:field?.isMandatory,
              isLocalDeleted: 0,
              order: field?.order
            }
            dispatch(addFieldToBranchSchema(propData));
          });
  
          setCancel(false);
        }
      }
    },[cancel]);


    const {propertyToBeRemoveFromSchema} = useSelector((state)=>state.branchReducer);
    
    useEffect(()=>{
      if(propertyToBeRemoveFromSchema){
          dispatch(removeFieldFromBranchSchema({_id: propertyToBeRemoveFromSchema}));
      }
    },[propertyToBeRemoveFromSchema]);

    const [reorderEmployeeObjectSchema] = useMutation(bulkUpdateCustomerObjectOrderMutation)
    
    
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
        <div>
                  
              <div className="form-section">
                  <div className="form-section-inner">
                      <div className="modal-header-title">
                          <div style={{width:'100%'}}>
                            Edit Customer Form
                          </div>
                          
                          <div style={{width:'30%', display:'flex', justifyContent:'flex-end', alignItems:'center'}}>

                            {btnDisabled?null:
                            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'75%', marginRight:'16px'}}>
                                <button
                                style={{
                                  padding: "5px 15px",
                                  fontSize: '12px'
                                }}
                                className={btnDisabled?'disabled-btn drawer-filled-btn':'drawer-filled-btn'} disabled={btnDisabled} 
                                onClick={async ()=>{await handelSave();setOpenDrawer(false);setBtnDisabled(true);}}
                                >Apply</button>
                              
                                <button 
                                style={{
                                  padding: "5px 15px",
                                  fontSize: '12px'
                                }} className='drawer-outlined-btn' 
                                onClick={async ()=>{setCancel(true);}}
                                >Cancel</button>
                                
                            </div>
                            }

                            <Popover
                              content={
                                <div className="editFormPop">
                                  <span  onClick={()=>{setOpenDrawer(true);setProp(true);}} >Add properties</span>
                                  <span className='disabled'>Add conditional logic</span>
                                  <span className='disabled'>Add associations</span>
                                </div>
                              }

                            > 
                              <FontAwesomeIcon icon={faEllipsisH} style={{color:'white', cursor: 'pointer', textAlign:'right'}}/> 
                            </Popover>
                          </div>

                      </div>
                      
                      <div className="form-section-body form"  style={{marginTop:'3%'}}> 
                      {loading &&
                      <div style={{
                        height:'100%',
                        width: "100%",
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
                          objectRefetch={()=>console.log("refetch object")}
                        />        
                                      
                        </div>
                      
                      

                  </div>
              </div>

          {/* side drawer */}
          {
            addProperty && !customerObjectLoading && openDrawer?
            <AddProperty
              close={async()=>{setOpenDrawer(false);}}
              visible={openDrawer}
              setProp={setProp}
              isPropOpen={isPropOpen}
              save={async()=>{await handelSave();setOpenDrawer(false);}}
              btnDisabled={()=>{}}
              
  
            />
            :null
          }
            
        </div>
    );
}


