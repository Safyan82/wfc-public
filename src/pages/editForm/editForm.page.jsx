import './editform.css';
import '../../assets/default.css';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk, faChevronLeft, faChevronRight, faStar } from "@fortawesome/free-solid-svg-icons";
import { Button, Divider, Form, Input } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import DraggableList from '../../components/shuffle/draggeableList';
import { AddProperty } from './addProperty.modal';
import { Popover } from "antd";
import { ApartmentOutlined } from "@ant-design/icons";
import { faDeleteLeft, faEdit, faTrash, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from 'react-redux';
import { setBranchSchema } from '../../middleware/redux/reducers/branch.reducer';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import { BulkBranchObjectMutation } from '../../util/mutation/branch.mutation';
import { Loader } from '../../components/loader';
import Spinner from '../../components/spinner';
import { GetBranchObject } from '../../util/query/branch.query';

export const EditForm=()=>{
    const location = useLocation();
    const navigate = useNavigate();
    const {title, url} = location.state;
    const [modalState, setModalState] = useState(false);
    const {data:branchProperties, loading: branchObjectLoading, refetch: branchObjectRefetch} = useQuery(GetBranchObject);
    
    const [mandatory, setMandatory] = useState([]);

    const { branchSchemaNewFields } = useSelector(state=>state.branchReducer);

    const [createBulkProperties, {loading, error}] = useMutation(BulkBranchObjectMutation);

    const dispatch = useDispatch();
    useEffect(()=>{
      if(!branchObjectLoading){

        const mandatoryFields = branchProperties?.getBranchProperty?.response?.filter((property)=> property.isReadOnly===true);
        setMandatory(mandatoryFields);
        dispatch(setBranchSchema(branchProperties?.getBranchProperty?.response));

        console.log()
      }
    },[branchProperties]);

    const[isPropOpen, setProp]=useState(false);

    const handelSave = async() => {
      if(branchSchemaNewFields?.length>0){
        const props = branchSchemaNewFields.map((schema)=>({propertyId: schema?._id, isMandatory: schema?.isMandatory || false}))
        await createBulkProperties({
          variables:{
            input:{
              fields: props
            }
          }
        });
        await branchObjectRefetch();
      }
    }

    return(
        <React.Fragment>
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
                            <button disabled={loading} className={loading?"drawer-filled-btn disabled-btn":"drawer-filled-btn "} onClick={handelSave}> {loading? <Spinner/> : "Save"}</button>
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
                    {loading?
                    <Loader/>
                    :
                      <div className="form-section-body form"> 

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
                            content={"Change the label of this property"} 
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

                      <DraggableList list={branchSchemaNewFields?.length>0 ? branchSchemaNewFields :
                         branchProperties?.getBranchProperty?.response?.filter((property)=> property.isReadOnly!==true)?.map((field)=>{
                          return {
                            label:field?.propertyDetail?.label,
                            _id:field?._id,
                            isMandatory:field?.isMandatory
                          }
                        }) || []
                        }

                         />        
                                    
                      </div>
                    }

                </div>
            </div>
        </React.Fragment>
    );
}