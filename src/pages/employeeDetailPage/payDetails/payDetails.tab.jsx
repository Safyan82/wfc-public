import { useQuery } from "@apollo/client";
import { GetPropertyByGroupQuery } from "../../../util/query/properties.query";
import { useEffect, useState } from "react";
import { GenerateFields } from "../../../util/generateFields/generateFields";
import { setNotification } from "../../../middleware/redux/reducers/notification.reducer";
import { useDispatch } from "react-redux";
import { ImplementedGroupList } from "../../../util/types/groups";

export const PayDetailsTab = ()=>{
    const {data, loading} = useQuery(GetPropertyByGroupQuery,{
        variables:{
            objectType: 'Employee'
        },
        fetchPolicy:'network-only'
    });

    const [payDetailProp, setPayDetailProp] = useState([]);
    const [bankDetailProp, setBankDetailProp] = useState([]);
    const [payrollProp, setPayrollProp] = useState([]);

    useEffect(()=>{
        if(data?.getPropertyByGroup?.data){

            const props = data?.getPropertyByGroup?.data?.filter((prop)=>(prop?._id==ImplementedGroupList.PAY_DETAILS || prop?._id==ImplementedGroupList.BANK_DETAILS || prop?._id== ImplementedGroupList?.PAYROLL_RUN_INFORMATION))
           
            setPayDetailProp(props?.find((prop)=>prop?._id==ImplementedGroupList?.PAY_DETAILS)?.properties);
            setBankDetailProp(props?.find((prop)=>prop?._id==ImplementedGroupList?.BANK_DETAILS)?.properties);
            setPayrollProp(props?.find((prop)=>prop?._id==ImplementedGroupList?.PAYROLL_RUN_INFORMATION)?.properties);
        }
    },[data?.getPropertyByGroup?.data]);


    const [field, setField] = useState([]);

    const handelDataValue = ({name, value})=>{
        if(name){
            if(value){
                const isExist = field?.find((f)=>f.name==name);
                if(isExist){
                    setField(field?.map((f)=>{
                        if(f.name==name){
                            return {
                                ...f,
                                value
                            }
                        }else{
                            return f;
                        }
                    }))
                }else{
                    setField([...field, {name, value}])
                }
            }else{
                setField(field?.filter(f=>f.name!==name));
            }
        }
    }



    const dispatch = useDispatch();

    return(
        <>
            <div className="hr-body">
            
            <div className="hr-section">
                    <div className="hr-info">
                        <h3>Pay Details</h3>
                        {
                            payDetailProp?.map((prop)=> {
                                const label = prop?.label;
                                const name = prop?.label.toLowerCase().replace(/\s/g,"");
                                const fieldType = prop?.fieldType;
                                const newprop = prop;
                                const {value} = field?.find((f)=>f.name==name) || {value: ""};
                                return GenerateFields(label, name, fieldType, handelDataValue, newprop, value);
                            })
                        }
                    </div>

                
            </div>
            
            <div style={{display:'flex', flexDirection:'column', width:'100%', gap:'25px'}}>
                
                <div className="employment-info">
                        <h3>Bank Details</h3>
                            {
                                bankDetailProp?.map((prop)=> {
                                    const label = prop?.label;
                                    const name = prop?.label.toLowerCase().replace(/\s/g,"");
                                    const fieldType = prop?.fieldType;
                                    const newprop = prop;
                                    const {value} = field?.find((f)=>f.name==name) || {value: ""};
                                    
                                    return GenerateFields(label, name, fieldType, handelDataValue, newprop, value);
                                })
                            }
                </div>

                <div className="contract">
                    <h3>Payroll Run Information</h3>
                    {
                        payrollProp?.map((prop)=> {
                            const label = prop?.label;
                            const name = prop?.label.toLowerCase().replace(/\s/g,"");
                            const fieldType = prop?.fieldType;
                            const newprop = prop;
                            const {value} = field?.find((f)=>f.name==name) || {value: ""};
                            
                            return GenerateFields(label, name, fieldType, handelDataValue, newprop, value);
                        })
                    }
                </div>

            </div>

            
            </div>


            {/* control btn */}
            {
                field?.length>0?
                    <div className='hr-action-footer'>

                        <button className={'drawer-filled-btn'} onClick={()=>{dispatch(setNotification({error:true, notificationState: true, message: "Apologize we are not currently handling this data !"})); setField([])}} >Save</button>
                        <button onClick={()=>setField([])} className={'drawer-outlined-btn'} >Cancel</button>
                    
                        <span className='text' style={{margin: 0}}>You've changed {field?.length} properties</span>
                        
                    </div>
                :null
            }
        </>
        
    );
};