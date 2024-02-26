import './editform.css';
import '../../assets/default.css';
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk, faChevronLeft, faChevronRight, faEllipsisH, faStar } from "@fortawesome/free-solid-svg-icons";
import { Button, Divider, Form, Input, notification } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import DraggableList from '../../components/shuffle/draggeableList';
import { AddProperty } from './addProperty.modal';
import { Popover } from "antd";
import { ApartmentOutlined } from "@ant-design/icons";
import { faDeleteLeft, faEdit, faTrash, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from 'react-redux';
import { addFieldToBranchSchema, removeFieldFromBranchSchema, resetBranch, resetbranchSchemaNewFields, setBranchSchema } from '../../middleware/redux/reducers/branch.reducer';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import { BulkBranchObjectMutation, BulkDeleteBranchObjectMutation, ReorderBranchSchema } from '../../util/mutation/branch.mutation';
import { Loader } from '../../components/loader';
import Spinner from '../../components/spinner';
import { GetBranchObject } from '../../util/query/branch.query';
import { setNotification } from '../../middleware/redux/reducers/notification.reducer';
import { FormHeader } from '../../components/header/header';

export const EditForm=()=>{
    const location = useLocation();
    const navigate = useNavigate();
    const {title, url} = location?.state || {title:"Branch", url:""};
    const [modalState, setModalState] = useState(false);

    const [reorderBranchSchema,{loading: rearragementLoading}] = useMutation(ReorderBranchSchema);

    const {data:branchProperties, loading: branchObjectLoading, refetch: branchObjectRefetch} = useQuery(GetBranchObject,{
      fetchPolicy: 'network-only',
    });
    const [createBulkProperties, {loading: createBulkPropertiesLoading, error}] = useMutation(BulkBranchObjectMutation);
    
    const [mandatory, setMandatory] = useState([]);

    const { branchSchemaNewFields } = useSelector(state=>state.branchReducer);
    const [branchSchemaLocal, setBranchSchemaLocal] = useState([...branchSchemaNewFields]);
    
    useEffect(()=>{
      branchObjectRefetch();
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
      if(!branchObjectLoading){
        dispatch(resetBranch());
        
        const mandatoryFields = branchProperties?.getBranchProperty?.response?.filter((property)=> property.isReadOnly===true);
        setMandatory(mandatoryFields);
        dispatch(setBranchSchema(branchProperties?.getBranchProperty?.response));

        branchProperties?.getBranchProperty?.response?.filter((property)=> property.isReadOnly!==true)?.map((field)=>{
          const propData = {
            label:field?.propertyDetail?.label,
            _id:field?.propertyId,
            isMandatory:field?.isMandatory,
            isLocalDeleted: 0,
            order: field?.order
          }
          dispatch(addFieldToBranchSchema (propData));
        });

        setCancel(false);
      }
    },[branchProperties]);

    const[isPropOpen, setProp]=useState(false);

    const [deleteProperties, {loading: deletePropertiesLoading}] = useMutation(BulkDeleteBranchObjectMutation);

    const [loading, setLoading] = useState(false);

    useEffect(()=>{
      if(deletePropertiesLoading || createBulkPropertiesLoading || branchObjectLoading){
        setLoading(true);
      }else{
        setLoading(false);
      }
    },[deletePropertiesLoading, createBulkPropertiesLoading, branchObjectLoading ]); 

    const [api, contextHolder] = notification.useNotification();

    const [btnDisabled, setBtnDisabled] = useState(true);

    useEffect(()=>{
      
      if(branchProperties?.getBranchProperty?.response){

        const props = branchSchemaNewFields.filter((schema)=> (schema?.isLocalDeleted==0 && schema?.isNew==1));
        const deletedProps = branchSchemaNewFields.filter((schema)=> (schema?.isLocalDeleted==1));
        const object = branchProperties?.getBranchProperty?.response?.filter((property)=> property.isReadOnly!==true );
        const isChange =  branchSchemaNewFields.find((schema)=>(object.find((property)=> property?.propertyId === schema?._id && property?.isMandatory !== schema?.isMandatory)));
          
        if(props?.length>0 || deletedProps?.length>0 || isChange){
          setBtnDisabled(false);
        }else{
          setBtnDisabled(true);
        }
      
      }

    },[branchSchemaNewFields, branchObjectLoading, deletePropertiesLoading, createBulkPropertiesLoading]);

    
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
        await branchObjectRefetch();
        setCancel(true);

      }
    }


    const {propertyToBeRemoveFromSchema} = useSelector((state)=>state.branchReducer);
    
    useEffect(()=>{
      if(propertyToBeRemoveFromSchema){
          dispatch(removeFieldFromBranchSchema({_id: propertyToBeRemoveFromSchema}));
      }
    },[propertyToBeRemoveFromSchema]);

    // on session terminate of this page clear the 
    useEffect(()=>{
      return()=>{
        // resetbranchSchemaNewFields
        dispatch(resetbranchSchemaNewFields());
      }
    },[]);

    
    useEffect(() =>{
      if(cancel){
        if(!branchObjectLoading){
          dispatch(resetBranch());

          const mandatoryFields = branchProperties?.getBranchProperty?.response?.filter((property)=> property.isReadOnly===true);
          setMandatory(mandatoryFields);
          dispatch(setBranchSchema(branchProperties?.getBranchProperty?.response));
  
          branchProperties?.getBranchProperty?.response?.filter((property)=> property.isReadOnly!==true)?.map((field)=>{
            const propData = {
              label:field?.propertyDetail?.label,
              _id:field?.propertyId,
              isMandatory:field?.isMandatory,
              isLocalDeleted: 0,
              order: field?.order
            }
            dispatch(addFieldToBranchSchema (propData));
          });
  
          setCancel(false);
          
        }
      }
    },[cancel]);
    
    const [openDrawer, setOpenDrawer] = useState(false);

    useEffect(()=>{
      if(openDrawer){
        branchObjectRefetch();
      }
    },[openDrawer]);

    return(
      <div>
            <div className="form-section" >
                <div className="form-section-inner">
                    <div className="modal-header-title">
                      
                      <div style={{width:'100%'}}>
                        <span> Edit {title} Form </span> 
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
                          <FontAwesomeIcon icon={faEllipsisH} style={{color:'white', cursor: 'pointer'}}/> 
                        </Popover>

                      </div>

                    </div>
                    
                    <div className="form-section-body form" style={{marginTop:'3%'}}> 
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

                      <DraggableList objectRefetch={branchObjectRefetch} reorderSchema={reorderBranchSchema} list={branchSchemaNewFields?.length>0 ? branchSchemaLocal.sort((a, b) => a?.order - b?.order) : []} />        
                                    
                      </div>
                    
                    

                </div>
            </div>

          {/* </div> */}
        {/* </div> */}
        {/* side drawer */}
        <AddProperty
          close={()=>{setOpenDrawer(false);setBtnDisabled(true)}}
          visible={openDrawer}
          isPropOpen={isPropOpen}
          setProp={setProp}
          save={async()=>{await handelSave();setOpenDrawer(false);setBtnDisabled(true);}}
          btnDisabled={btnDisabled}
        />
      </div>
    );
}


