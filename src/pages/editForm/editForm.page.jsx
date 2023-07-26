import './editform.css';
import '../../assets/default.css';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk, faChevronLeft, faChevronRight, faStar } from "@fortawesome/free-solid-svg-icons";
import { Button, Divider, Form, Input, notification } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import DraggableList from '../../components/shuffle/draggeableList';
import { AddProperty } from './addProperty.modal';
import { Popover } from "antd";
import { ApartmentOutlined } from "@ant-design/icons";
import { faDeleteLeft, faEdit, faTrash, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from 'react-redux';
import { addFieldToBranchSchema, removeFieldFromBranchSchema, setBranchSchema } from '../../middleware/redux/reducers/branch.reducer';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import { BulkBranchObjectMutation, BulkDeleteBranchObjectMutation } from '../../util/mutation/branch.mutation';
import { Loader } from '../../components/loader';
import Spinner from '../../components/spinner';
import { GetBranchObject } from '../../util/query/branch.query';
import { setNotification } from '../../middleware/redux/reducers/notification.reducer';

export const EditForm=()=>{
    const location = useLocation();
    const navigate = useNavigate();
    const {title, url} = location.state;
    const [modalState, setModalState] = useState(false);

    const {data:branchProperties, loading: branchObjectLoading, refetch: branchObjectRefetch} = useQuery(GetBranchObject);
    const [createBulkProperties, {loading: createBulkPropertiesLoading, error}] = useMutation(BulkBranchObjectMutation);
    
    const [mandatory, setMandatory] = useState([]);

    const { branchSchemaNewFields } = useSelector(state=>state.branchReducer);

    const dispatch = useDispatch();
    useEffect(()=>{
      if(!branchObjectLoading){

        const mandatoryFields = branchProperties?.getBranchProperty?.response?.filter((property)=> property.isReadOnly===true);
        setMandatory(mandatoryFields);
        dispatch(setBranchSchema(branchProperties?.getBranchProperty?.response));

        branchProperties?.getBranchProperty?.response?.filter((property)=> property.isReadOnly!==true)?.map((field)=>{
          const propData = {
            label:field?.propertyDetail?.label,
            _id:field?.propertyId,
            isMandatory:field?.isMandatory,
            isLocalDeleted: 0
          }
          dispatch(addFieldToBranchSchema (propData));
        });

        
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
        await branchObjectRefetch();
      }
    }


    const {propertyToBeRemoveFromSchema} = useSelector((state)=>state.branchReducer);
    
    useEffect(()=>{
      if(propertyToBeRemoveFromSchema){
          dispatch(removeFieldFromBranchSchema({_id: propertyToBeRemoveFromSchema}));
      }
    },[propertyToBeRemoveFromSchema]);

    return(
        <React.Fragment>
          {contextHolder}
            <section className="section">
                <div className="toolbar">
                    <div className="toolbar-inner">
                        <div className="toolbar-inner-link"  onClick={()=>navigate(url)}>
                            <div><FontAwesomeIcon icon={faChevronLeft} style={{fontSize:'20px'}} /></div>
                            <div>Back</div>
                        </div>
                        <div className="toolbar-inner-title">Edit {title} form</div>
                        <div className="btn-group">
                            <button disabled={loading} className={loading?"drawer-outlined-btn disabled-btn": "drawer-outlined-btn"} onClick={()=>setModalState(!modalState)}>Preview</button>
                            <button disabled={loading || btnDisabled} className={loading || btnDisabled? "drawer-filled-btn disabled-btn":"drawer-filled-btn "} onClick={handelSave}> {loading? <Spinner/> : "Save"}</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* left side properties */}
            <div className="left-sidebar">
                <div className="left-sidebar-inner">

                    {
                    isPropOpen?
                    
                    <AddProperty back={()=>setProp(false)}/>
                    
                    :
                    <>
                        {/* main content of property */}
                        <div className="left-sidebar-item">
                            <div className="left-sidebar-item-text" onClick={()=>setProp(true)} >Add properties</div>
                            <FontAwesomeIcon icon={faChevronRight} style={{fontSize:'18px'}} />
                        </div>
                        <Divider/>
                        <div className="left-sidebar-item">
                            <div className="left-sidebar-item-text">Add conditional logic</div>
                            <FontAwesomeIcon icon={faChevronRight} style={{fontSize:'18px'}} />
                        </div>
                        <Divider/>
                        <div className="left-sidebar-item">
                            <div className="left-sidebar-item-text">Add associations </div>
                            <FontAwesomeIcon icon={faChevronRight} style={{fontSize:'18px'}} />
                        </div>
                    </>
                    }

                </div>
            </div>

            {/* main body */}
            
            <div className="form-section">
                <div className="form-section-inner">
                    <div className="modal-header-title">
                        Create {title}
                    </div>
                    
                    <div className="form-section-body form"> 
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
                            {field?.propertyDetail?.label}
                          </div>
                        </div>
                      ))}

                      <DraggableList list={branchSchemaNewFields?.length>0 ? branchSchemaNewFields : []} />        
                                    
                      </div>
                    
                    

                </div>
            </div>
        </React.Fragment>
    );
}


