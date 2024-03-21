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

import { BulkDeleteEmployeeObjectMutation, BulkDeleteSiteGroupObjectMutation, bulkUpdateEmployeeObjectOrderMutation, bulkUpdateSiteGroupObjectOrderMutation } from "../../../util/mutation/siteGroupObject.mutation";
import Spinner from "../../../components/spinner";
import { SiteGroupObjectQuery } from "../../../util/query/siteGroup.query";
import { BulkSiteGroupObjectCreationMutation } from "../../../util/mutation/siteGroupObject.mutation";

export const EditSiteGroupForm=()=>{
    const location = useLocation();
    // const title= "Employee Form";
    // const url= "";
    const {title="Site Group", url=""} = location?.state || {title:"Site Group", url:""};
    const [modalState, setModalState] = useState(false);


    const {data:siteGroupObject, loading: siteGroupObjectLoading, refetch: siteGroupObjectRefetch} = useQuery(SiteGroupObjectQuery,{
      fetchPolicy: 'network-only',
    });

    const [addProperty, setAddProperty] = useState(false);



    const [createBulkProperties, {loading: createBulkPropertiesLoading, error}] = useMutation(BulkSiteGroupObjectCreationMutation);
    
    const [mandatory, setMandatory] = useState([]);

    const { branchSchemaNewFields } = useSelector(state=>state.branchReducer);
    const [branchSchemaLocal, setBranchSchemaLocal] = useState([...branchSchemaNewFields]);
    useEffect(()=>{
      siteGroupObjectRefetch();
    }, []);
    useEffect(()=>{
      setBranchSchemaLocal([...branchSchemaNewFields]);
    }, [branchSchemaNewFields]);

    useEffect(()=>{

      console.log(branchSchemaLocal.sort((a, b) => a?.order - b?.order), "sort", branchSchemaLocal)
    },[branchSchemaLocal]);
    
    const dispatch = useDispatch();
    const [cancel,setCancel] = useState(false);

    useEffect(()=>{
      if(!siteGroupObjectLoading){
        dispatch(resetBranch());
        console.log(siteGroupObject, "siteGroupObject");
        const mandatoryFields = siteGroupObject?.getSiteGroupObject?.response?.filter((property)=> property.isReadOnly===true);
        setMandatory(mandatoryFields);
        dispatch(setBranchSchema(siteGroupObject?.getSiteGroupObject?.response));

        siteGroupObject?.getSiteGroupObject?.response?.filter((property)=> property.isReadOnly!==true)?.map((field)=>{
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
    },[siteGroupObject]);

    const[isPropOpen, setProp]=useState(false);

    const [deleteProperties, {loading: deletePropertiesLoading}] = useMutation(BulkDeleteSiteGroupObjectMutation);

    const [loading, setLoading] = useState(false);

    useEffect(()=>{
      if(deletePropertiesLoading || createBulkPropertiesLoading || siteGroupObjectLoading){
        setLoading(true);
      }else{
        setLoading(false);
      }
    },[deletePropertiesLoading, createBulkPropertiesLoading, siteGroupObjectLoading ]); 

    
    const [btnDisabled, setBtnDisabled] = useState(true);
    
    useEffect(()=>{
      
      if(siteGroupObject?.getSiteGroupObject?.response){

        const props = branchSchemaNewFields.filter((schema)=> (schema?.isLocalDeleted==0 && schema?.isNew==1));
        const deletedProps = branchSchemaNewFields.filter((schema)=> (schema?.isLocalDeleted==1));
        const object = siteGroupObject?.getSiteGroupObject?.response?.filter((property)=> property.isReadOnly!==true );
        const isChange =  branchSchemaNewFields?.find((schema)=>(object.find((property)=> property?.propertyId === schema?._id && property?.isMandatory !== schema?.isMandatory)));
        // console.log(props?.length>0 || deletedProps?.length>0 || isChange, isChange, "tttttds",object , branchSchemaNewFields)

        if(props?.length>0 || deletedProps?.length>0 || isChange){
          setBtnDisabled(false);
        }else{
          setBtnDisabled(true);
        }

      }
    },[branchSchemaNewFields,createBulkPropertiesLoading,deletePropertiesLoading,siteGroupObject]);

    
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
        await siteGroupObjectRefetch();
        setCancel(true);

      }
    }

    
    useEffect(() =>{
      if(cancel){
        if(!siteGroupObjectLoading){
          dispatch(resetBranch());
  
          const mandatoryFields = siteGroupObject?.getSiteGroupObject?.response?.filter((property)=> property.isReadOnly===true);
          setMandatory(mandatoryFields);
          dispatch(setBranchSchema(siteGroupObject?.getSiteGroupObject?.response));
  
          siteGroupObject?.getSiteGroupObject?.response?.filter((property)=> property.isReadOnly!==true)?.map((field)=>{
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

    const [reorderEmployeeObjectSchema] = useMutation(bulkUpdateSiteGroupObjectOrderMutation)
    
    
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
                            Edit Site Group Form
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
                              placement="left"
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
                          objectRefetch={siteGroupObjectRefetch}
                        />        
                                      
                        </div>
                      
                      

                  </div>
              </div>

          {/* side drawer */}
          
          {addProperty && !siteGroupObjectLoading && openDrawer?
            <AddProperty
              close={async()=>{setOpenDrawer(false);}}
              visible={openDrawer}
              setProp={setProp}
              isPropOpen={isPropOpen}
              save={async()=>{await handelSave();setOpenDrawer(false);setBtnDisabled(true);}}
              btnDisabled={()=>{}}
              

            />
            :null
          }
            
        </div>
    );
}


