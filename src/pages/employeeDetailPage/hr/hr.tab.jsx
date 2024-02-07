import { useQuery } from "@apollo/client";
import "./hr.css";
import { GetPropertyByGroupQuery } from "../../../util/query/properties.query";
import { useEffect, useState } from "react";
import { GenerateFields } from "../../../util/generateFields/generateFields";
import { countries } from "../../../util/datalist/countries";
import { setNotification } from "../../../middleware/redux/reducers/notification.reducer";
import { useDispatch } from "react-redux";

export const HRTab = ()=>{
    const {data, loading} = useQuery(GetPropertyByGroupQuery,{
        variables:{
            objectType: 'Employee'
        },
        fetchPolicy:'network-only'
    });

    const [hrProp, setHrProp] = useState([]);
    const [empProp, setEmpProp] = useState([]);
    const [contractProp, setContractProp] = useState([]);

    useEffect(()=>{
        if(data?.getPropertyByGroup?.data){
            const props = data?.getPropertyByGroup?.data?.filter((prop)=>(prop?._id=="HR " || prop?._id=="Employment Dates" || prop?._id=="Contract"))
           
            setHrProp(props?.find((prop)=>prop?._id=="HR ")?.properties);
            setEmpProp(props?.find((prop)=>prop?._id=="Employment Dates")?.properties);
            setContractProp(props?.find((prop)=>prop?._id=="Contract")?.properties);
        }
    },[data?.getPropertyByGroup?.data]);


    useEffect(()=>{
        console.log(hrProp, empProp, "sssss", contractProp)
    },[hrProp, empProp, contractProp]);

    const [field, setField] = useState([]);

    const handelDataValue = ({name, value})=>{
        console.log(name, value, "vvvv");
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

    const [countryList, setCountryList] = useState();

    useEffect(()=>{
        setCountryList(
            countries?.map((c, i)=>({
                id: i,
                key: c,
                value: c,
                showFormIn: true
            }))
        );
    }, [countries]);

    const dispatch = useDispatch();

    return(
        <>
            <div className="hr-body">
            
            <div className="hr-section">
                    <div className="hr-info">
                        <h3>HR Information</h3>
                        {
                            hrProp?.map((prop)=> {
                                const label = prop?.label;
                                const name = prop?.label.toLowerCase().replace(/\s/g,"");
                                const fieldType = prop?.fieldType;
                                const newprop = name=="nationality"? {...prop, options: countryList} : prop;
                                const {value} = field?.find((f)=>f.name==name) || {value: ""};
                                return GenerateFields(label, name, fieldType, handelDataValue, newprop, value);
                            })
                        }
                    </div>

                
            </div>
            
            <div style={{display:'flex', flexDirection:'column', width:'100%', gap:'25px'}}>
                
                <div className="employment-info">
                        <h3>Employment Dates</h3>
                            {
                                empProp?.map((prop)=> {
                                    const label = prop?.label;
                                    const name = prop?.label.toLowerCase().replace(/\s/g,"");
                                    const fieldType = prop?.fieldType;
                                    const newprop = name=="nationality"? {...prop, options: countryList} : prop;
                                    const {value} = field?.find((f)=>f.name==name) || {value: ""};
                                    
                                    return GenerateFields(label, name, fieldType, handelDataValue, newprop, value);
                                })
                            }
                </div>

                <div className="contract">
                    <h3>Contract History</h3>
                    {
                        contractProp?.map((prop)=> {
                            const label = prop?.label;
                            const name = prop?.label.toLowerCase().replace(/\s/g,"");
                            const fieldType = prop?.fieldType;
                            const newprop = name=="nationality"? {...prop, options: countryList} : prop;
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