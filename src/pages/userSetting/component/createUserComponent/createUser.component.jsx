import { useMutation, useQuery } from "@apollo/client";
import { Form, Input, Select } from "antd";
import {EmployeeObjectQuery, GetEmployeeRecord} from "../../../../util/query/employee.query";
import csv from './img.svg';
import { useEffect, useState } from "react";
import { GET_BRANCHES } from "../../../../util/query/branch.query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { LookupSearch } from "../../../../components/lookupSearch/lookupSearch";
import { FormDrawer } from "../../../formDrawer";
import { useDispatch } from "react-redux";
import { AddEmployeeMutation } from "../../../../util/mutation/employee.mutation";
import { setNotification } from "../../../../middleware/redux/reducers/notification.reducer";
import {objectType} from "../../../../util/types/object.types";

export const CreateUserComponent = ()=>{
    const {data: employeeData, loading: employeeDataLoading, refetch} = useQuery( GetEmployeeRecord ,{fetchPolicy: 'cache-and-network',
    variables: {
        input: {
            filters: null
        }
    }
    });

    const [suggestedEmail, setSuggestedEmail] = useState("");
    const [email, setEmail] = useState("");
    const [firstname, setfirstname] = useState("");
    const [lastname, setlastname] = useState("");
    const [branch, setbranch] = useState("");
    const [emplevel, setemplevel] = useState("");
    const [emptype, setemptype] = useState("");
    const [emp, setemp] = useState("");

    useEffect(()=>{
        if(emp){

            const data = employeeData?.getEmployee?.response?.find((res)=>res._id==emp?._id);
            console.log(data, "ddd safi")
            setfirstname(data?.firstname);
            setEmail(data?.metadata?.email);
            setlastname(data?.lastname);
            setbranch(data?.branch);
        }else{
            setfirstname(null);
            setEmail(null);
            setlastname(null);
            setbranch(null);
        }
    }, [emp]);


    // form drawer
    const [employeeSchema, setEmployeeSchema] = useState();
    const [employeeModal, setEmployeeModal] = useState(false);
    // states that we had to define for formDrawer
    const [data, setData] = useState([]);
    const [isBtnEnable, setBtn] = useState(true);
    const [isoverlay, setIsOverlay] = useState(true);
    // states terminated here that we had to define for formDrawer

    // Reteriving employeeSchema Object
    const {data:employeeObject, loading: employeeObjectLoading, refetch: employeeObjectRefetch} = useQuery(EmployeeObjectQuery);
    useEffect(()=>{
        if(!employeeObjectLoading){
            setEmployeeSchema(employeeObject?.getEmployeeObject?.response);
        }
    },[employeeObjectLoading]);

    const dispatch = useDispatch();

    // Add new Employee while form creation
    const [addEmployeeMutation, {loading: processloading}] = useMutation(AddEmployeeMutation);

    const employeeMutation=async (employee)=>{
        try{
          await addEmployeeMutation({variables: {input: employee}});
          await refetch();
          await employeeObjectRefetch();
          dispatch(setNotification({
            notificationState:true, 
            message: "Employee was added successfully",
            error: false,
          }));
          setData([]);
          setBtn(true);
          setIsOverlay(true);

        }
        catch(err){
          dispatch(setNotification({
              message: err?.message,
              error: true,
              notificationState: true
            }));
          
        }
    }

    const handelSubmit=async (isCloseAble)=>{
        const firstname = data?.find((d)=>(Object.keys(d)[0]=="firstname"));
        const lastname = data?.find((d)=>(Object.keys(d)[0]==="lastname"));
        const branch = data?.find((d)=>(Object.keys(d)[0]==="branch"));
        
        let metadata = {};
        data?.map(d=>{
          if(Object.keys(d)[0]!=="firstname" && Object.keys(d)[0]!=="lastname" && Object.keys(d)[0]!=="branch"){
            metadata[Object.keys(d)[0]]= Object.values(d)[0]
          }
        });
        const employee = {
          ...firstname,
          ...lastname,
          ...branch,
          metadata,
        }
        // handel mutation
        await employeeMutation(employee);

        if(isCloseAble){
            setEmployeeModal(!employeeModal);
        }

    }


    return(
        <div className="stepperBody createUser-block">
            <div className="createUser-block-header">
                <h3 className="h3">
                    Create new user 
                    {/* from existing employees */}
                </h3>
                <div className="text">Add a new user to your workforce city account with an email address.</div>
            </div>
            
            <div style={{width:'40%',margin:'auto', display:'table'}}>
                
                <Form.Item>
                    <LookupSearch
                        setSelectedOption={setemp}
                        selectedOption={emp}
                        title={"Select or add a user"}
                        add
                        addOnTitle={"Create a new employee"}
                        addPopup={setEmployeeModal}
                        data={employeeData?.getEmployee?.response?.map((emp)=>({_id:emp._id, label: emp.firstname +" "+ emp.lastname})).reverse()}
                    />
                </Form.Item>

                {emp ?
                <>
                
                <Form.Item>
                    <div style={{display:'flex', flexDirection: 'row', justifyContent:'space-between', columnGap: '15px'}}>
                        <Input 
                            className="generic-input-control"
                            placeholder="First Name"
                            value={firstname}
                            readOnly
                        />
                        <Input 
                            className="generic-input-control"
                            placeholder="Last Name"
                            value={lastname}
                            readOnly
                        />
                    </div>
                </Form.Item>   
                
                <Form.Item>
                    <Input
                        placeholder="Email Address"
                        className="generic-input-control"
                        value={email}
                        autoComplete={false}
                        autoCorrect={false}
                        autoCapitalize={false}
                        onChange={(e)=>setEmail(e.target.value)}
                        readOnly
                    />
                    {/* {suggestedEmail ? <label className="createOption text" onClick={(e)=>{setEmail(e.target.innerText); setEmailVal(e.target.innerText); setSuggestedEmail(null)}}>{suggestedEmail}</label> : null} */}
                </Form.Item>         

                
                </>
                : null
                }
                
            </div>

            
            <FormDrawer
               objectData={employeeSchema}
               objectLoading={employeeObjectLoading}
               visible={employeeModal} 
               refetch={refetch} 
               setBtn={setBtn}
               setData={setData}
               data={data}
               isBtnEnable={isBtnEnable}
               isoverlay={isoverlay}
               setIsOverlay={setIsOverlay}
               loading={processloading}
               onClose={()=>setEmployeeModal(!employeeModal)} 
               handelSubmit={handelSubmit}
               to={"/employee/editform"}
               from={"/setting/adduser"}
               title={objectType.Employee}
            />
            {/* <div>

                
                

                <hr className="create-form-hr"/>

                
                <div className="createUser-block-header">
                    <h3 className="h3 pt-20">
                        Or create multiple users at once.
                    </h3>
                    <div className="text">Create multiple users at once. Import their info from your integration app records.</div>
                </div>

                <div className="csv-box">
                    <div className="csv-btn">
                        <img src={csv} width="50%" alt="" />
                        <h4>A CSV file</h4>
                        <div className="text" style={{fontSize:'12px'}}>
                            <b>Upload a CSV file or plain text file in CSV format</b>
                        </div>
                    </div>
                </div>
            
            </div> */}

        </div>
    );
}