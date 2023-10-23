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
import { addFieldToBranchSchema, removeAllColumns, removeFieldFromBranchSchema, resetbranchSchemaNewFields, setBranchSchema } from '../../middleware/redux/reducers/branch.reducer';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import { BulkBranchObjectMutation, BulkDeleteBranchObjectMutation } from '../../util/mutation/branch.mutation';
import { Loader } from '../../components/loader';
import Spinner from '../../components/spinner';
import { GetBranchObject } from '../../util/query/branch.query';
import { setNotification } from '../../middleware/redux/reducers/notification.reducer';
import { FormHeader } from '../../components/header/header';
import { BranchViewQuery, SingleBranchViewQuery } from '../../util/query/branchView.query';

export const PropertiesList=({setLoader})=>{

    useEffect(()=>{
      dispatch(resetbranchSchemaNewFields());
    },[]);

    const {data:branchProperties, loading: branchObjectLoading, refetch: branchObjectRefetch} = useQuery(GetBranchObject,{
      fetchPolicy: 'network-only',
    });

    const {data: branchView, loading: branchViewLoading} = useQuery(SingleBranchViewQuery,{
      variables:{
        id: sessionStorage.getItem("selectedViewId")
      },
      fetchPolicy: 'network-only'
    });
    

    const [mandatory, setMandatory] = useState([]);

    const { branchSchemaNewFields, removeAllColumnsView } = useSelector(state=>state.branchReducer);
    const [branchSchemaLocal, setBranchSchemaLocal] = useState([]);
    useEffect(()=>{
      branchObjectRefetch();
      setLoader(false);
    }, []);

    useEffect(()=>{
      if(branchSchemaNewFields?.length>0){
       
        setBranchSchemaLocal([...branchSchemaNewFields]);
        
      }
    }, [branchSchemaNewFields]);


    
    
    const dispatch = useDispatch();
    useEffect(()=>{
      if(!branchObjectLoading && !branchViewLoading){

        const mandatoryFields = (branchProperties?.getBranchProperty?.response)?.filter((property)=> property.isReadOnly===true);
        setMandatory(mandatoryFields);
        dispatch(setBranchSchema(branchProperties?.getBranchProperty?.response));
        // console.log(branchView?.singlebranchView?.viewFields, "branchView?.singlebranchView?.viewFields");
        if(branchView?.singlebranchView?.viewFields){
          

          branchView?.singlebranchView?.viewFields?.map((field)=>{
            const propData = {
              label:field?.label,
              _id:field?._id,
              isMandatory:field?.isMandatory,
              isLocalDeleted: 0,
              order: field?.order
            }
            dispatch(addFieldToBranchSchema(propData));
          });
          
        }
        else{

          // (branchProperties?.getBranchProperty?.response)?.filter((property)=> property.isReadOnly!==true)?.map((field)=>{
          //   const propData = {
          //     label:field?.propertyDetail?.label,
          //     _id:field?.propertyId,
          //     isMandatory:field?.isMandatory,
          //     isLocalDeleted: 0,
          //     order: field?.order
          //   };
          //   console.log(propData, "propD");
          // resetbranchSchemaNewFields
            dispatch(resetbranchSchemaNewFields());
          // });
        }

        
      }
    },[branchObjectLoading, branchViewLoading]);

    const[isPropOpen, setProp]=useState(false);

    const [deleteProperties, {loading: deletePropertiesLoading}] = useMutation(BulkDeleteBranchObjectMutation);

    const [loading, setLoading] = useState(false);

    useEffect(()=>{
      if(deletePropertiesLoading  || branchObjectLoading){
        setLoading(true);
      }else{
        setLoading(false);
      }
    },[deletePropertiesLoading, branchObjectLoading ]); 

    const [api, contextHolder] = notification.useNotification();

    const [btnDisabled, setBtnDisabled] = useState(false);
    useEffect(()=>{
      
      const props = branchSchemaNewFields?.filter((schema)=> (schema?.isLocalDeleted==0 && schema?.isNew==1));
      const deletedProps = branchSchemaNewFields?.filter((schema)=> (schema?.isLocalDeleted==1));
      if(props?.length>0 || deletedProps?.length>0){
        setBtnDisabled(false);
      }else{
        setBtnDisabled(false);
      }
    },[branchSchemaNewFields]);

    
  


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

                <DraggableList editColumn={true} list={branchSchemaNewFields?.length>0 ? branchSchemaLocal.sort((a, b) => a?.order - b?.order) : []} />        
            </div>
                            
            </div>
                      
                      

            
        </React.Fragment>
    );
}


