import './editform.css';
import '../../assets/default.css';
import React, { useEffect, useState } from "react";
import { notification } from "antd";
import DraggableList from '../../components/shuffle/draggeableList';

import { useDispatch } from 'react-redux';
import { addFieldToBranchSchema, removeAllColumns, removeFieldFromBranchSchema, resetbranchSchemaNewFields, setBranchSchema } from '../../middleware/redux/reducers/branch.reducer';
import { useSelector } from 'react-redux';
import { Loader } from '../../components/loader';

export const PropertiesList=({setLoader, properties, propertiesRefetch, processing, view})=>{

    useEffect(()=>{
      dispatch(resetbranchSchemaNewFields());
    },[]);
    

    const [mandatory, setMandatory] = useState([]);

    const { branchSchemaNewFields, removeAllColumnsView } = useSelector(state=>state.branchReducer);
    const [branchSchemaLocal, setBranchSchemaLocal] = useState([]);
    useEffect(()=>{
      propertiesRefetch();
      setLoader(false);
    }, []);

    useEffect(()=>{
      if(branchSchemaNewFields?.length>0){
       
        setBranchSchemaLocal([...branchSchemaNewFields]);
        
      }
    }, [branchSchemaNewFields]);


    
    
    const dispatch = useDispatch();
    useEffect(()=>{
      if(!processing){
        
        const mandatoryFields = (properties)?.filter((property)=> property.isReadOnly===true);
        setMandatory(mandatoryFields);
        dispatch(setBranchSchema(properties));
        // console.log(branchView?.singlebranchView?.viewFields, "branchView?.singlebranchView?.viewFields");
        if(view){
          console.log(view, "view safyan", properties)
          
          
          view?.filter((field)=>{
            // here i filtered out the view properties from original updated schema
            // coz there can be any property in single view that was archeive or deleted and backlog was here in specific view
            
            if(properties?.find((prop)=>prop.propertyId===field?._id)){

              const propData = {
                label:field?.label,
                _id:field?._id,
                isMandatory:field?.isMandatory,
                isLocalDeleted: 0,
                order: field?.order
              }

              dispatch(addFieldToBranchSchema(propData));
            }
          });
          
        }
        else{
          dispatch(resetbranchSchemaNewFields());
        }

        
      }
    },[processing, view]);

    
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
      if(processing){
        setLoading(true);
      }else{
        setLoading(false);
      }
    },[processing]); 

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


