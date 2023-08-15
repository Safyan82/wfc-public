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
import { FormHeader } from '../../components/header/header';

export const PropertiesList=({setLoader})=>{
    const location = useLocation();
    console.log(location, "locationnnn");
    const navigate = useNavigate();
    const [modalState, setModalState] = useState(false);

    const {data:branchProperties, loading: branchObjectLoading, refetch: branchObjectRefetch} = useQuery(GetBranchObject,{
      fetchPolicy: 'network-only',
    });
    const [createBulkProperties, {loading: createBulkPropertiesLoading, error}] = useMutation(BulkBranchObjectMutation);
    
    const [mandatory, setMandatory] = useState([]);

    const { branchSchemaNewFields } = useSelector(state=>state.branchReducer);
    const [branchSchemaLocal, setBranchSchemaLocal] = useState([...branchSchemaNewFields]);
    useEffect(()=>{
      branchObjectRefetch();
      setLoader(false);
    }, []);
    useEffect(()=>{
      setBranchSchemaLocal([...branchSchemaNewFields]);
    }, [branchSchemaNewFields]);

    
    
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
            isLocalDeleted: 0,
            order: field?.order
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
           
                      
            <div className="form-section-body form" style={{padding: 0, margin:0}}> 
            <div style={{color: 'black',
                paddingTop: '2%',
                paddingBottom: '2%',
                }}>SELECTED COLUMNS ({mandatory?.length+branchSchemaLocal?.length})</div>
            {loading &&
            <div style={{
            height:'100%',
            width: "100%",
            background: "white",position:'absolute',
            opacity: 0.8,}}>
                <Loader/>
            </div>
            }

            <div style={{
                maxHeight: '300px',
                height: '220px',
                overflowY: 'scroll',
                paddingTop: '3%',
                paddingRight: '1%',
            }}>
                {/* branch name */}
                {mandatory?.map((field)=>(
                    <div className="icon-wrapper">
                
                    <div
                        className="edit-form-input-control input inputItemList"   
                        style={{backgroundImage: "none", cursor: "auto"}}                    
                    >
                    <span className='text'>{field?.propertyDetail?.label}</span> 
                    </div>
                    </div>
                ))}

                <DraggableList list={branchSchemaNewFields?.length>0 ? branchSchemaLocal.sort((a, b) => a?.order - b?.order) : []} />        
            </div>
                            
            </div>
                      
                      

            
        </React.Fragment>
    );
}


