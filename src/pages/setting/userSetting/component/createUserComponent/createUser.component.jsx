import { useMutation, useQuery } from "@apollo/client";
import { Alert, Checkbox, Form, Input, Select } from "antd";
import {EmployeeObjectQuery, GetEmployeeRecord} from "@src/util/query/employee.query";
import csv from './img.svg';
import { useEffect, useState } from "react";
import { LookupSearch } from "@src/components/lookupSearch/lookupSearch";
import { FormDrawer } from "@src/pages/formDrawer";
import { useDispatch } from "react-redux";
import { AddEmployeeMutation } from "@src/util/mutation/employee.mutation";
import { setNotification } from "@src/middleware/redux/reducers/notification.reducer";
import {objectType} from "@src/util/types/object.types";
import { ManualPassword } from "./manualPassword";
import { setUserDetail } from "@src/middleware/redux/reducers/user.reducer";
import { useSelector } from "react-redux";
import { GetUserByEmpIdQuery } from '@src/util/query/user.query';

export const CreateUserComponent = ()=>{
    
    const {editUserData} = useSelector((state)=>state?.editUserReducer);

    const {data: employeeData, loading: employeeDataLoading, refetch} = useQuery( GetEmployeeRecord ,{fetchPolicy: 'cache-and-network',
    variables: {
        input: {
            filters: null
        }
    }
    });

    const {userDetail:user} = useSelector(state=> state.userDetailReducer);

    const [email, setEmail] = useState( editUserData?.user?.email ||user?.metadata?.email || "");
    const [emp, setemp] = useState({label: user?.firstname+ " "+user?.lastname, _id:user?._id}||"");

    const {data: UserLiveData, loading: UserLiveDataLoading} = useQuery(GetUserByEmpIdQuery,{
        variables:{
            employeeId: emp?._id
        },
        skip: !emp?._id,
        fetchPolicy: 'network-only',
    });

    console.log(UserLiveData?.getUserByEmpId?.response, "UserLiveDataUserLiveData", UserLiveData?.getUserByEmpId?.response?.length);

 

    const [manualPasswordPopover, setManualPasswordPopover] = useState(false);

    const [password, setPassword] = useState(user?.password || "");
    
    const dispatch = useDispatch();



    useEffect(()=>{
        if(emp && employeeData?.getEmployee?.response){
            const data = employeeData?.getEmployee?.response?.find((res)=>res._id==emp?._id);
            const isAlreadyExist = false;
            if(editUserData?.user){

                dispatch(setUserDetail(data));
                setEmail(editUserData?.user?.email);
            }else if(!UserLiveDataLoading && UserLiveData?.getUserByEmpId?.response?.length===undefined){
                
                dispatch(setUserDetail(data));
                setEmail(data?.metadata?.email);
            }else{
                setEmail(null);
                dispatch(setUserDetail({}));
            }
        }else{
            setEmail(null);
        }
    }, [emp, employeeData, UserLiveData, editUserData]);

    useEffect(()=>{
        if(password?.length>7){
            dispatch(setUserDetail({...user, password}))
        }
    }, [password]);

    useEffect(()=>{
        dispatch(setUserDetail({...user, email}))
    },[email]);

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

    useEffect(()=>{
        if(password?.length>7){
            console.log({ ...user, password, manualPassword: 1}, "{ ...user, password, manualPassword: 1}")
            dispatch(setUserDetail({ ...user, password, manualPassword: 1}));
            const data = employeeData?.getEmployee?.response?.find((res)=>res._id==emp?._id);
        }
    }, [manualPasswordPopover])

       // edit user detail
       useEffect(()=>{
        if(editUserData?.user?.employee){
            const user = editUserData?.user?.employee[0];
            
            const data = employeeData?.getEmployee?.response?.find((res)=>res._id==user?._id);
            dispatch(setUserDetail({...data, email: user?.email}));
            setEmail(editUserData?.user?.email)
            setemp({label: user?.firstname+ " "+user?.lastname, _id: user?._id});
        }
    },[editUserData]);

    return(
        <div className="stepperBody createUser-block">
            <div className="createUser-block-header">
                <h3 className="h3">
                    {editUserData?.user? "Update User" : "Create new user"}
                    {/* from existing employees */}
                </h3>
                <div className="text">Add a new user to your workforce city account with an email address.</div>
            </div>
            
            <div style={{width:'500px',margin:'auto', display:'table'}}>
                {UserLiveData?.getUserByEmpId?.response?.length!==undefined && !editUserData?.user? <Alert
                    message="Error"
                    description="We can't proceed as this Employee is already associated with an other account."
                    type="error"
                    showIcon
                    closable
                /> : null}
                <Form.Item >
                    <LookupSearch
                        setSelectedOption={setemp}
                        selectedOption={emp}
                        title={"Select or add a user"}
                        add
                        disabled={editUserData?.user? true: false}
                        addOnTitle={"Create a new employee"}
                        addPopup={setEmployeeModal}
                        data={employeeData?.getEmployee?.response?.map((emp)=>({_id:emp._id, label: emp.firstname +" "+ emp.lastname})).reverse()}
                    />
                </Form.Item>

                {(emp && emp?.label!=="undefined undefined") ?
                <>
                
                {/* <Form.Item>
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
                </Form.Item>    */}
                
                <Form.Item
                >
                    <Input
                        placeholder="Email Address"
                        className="generic-input-control"
                        value={email}
                        autoComplete={false}
                        autoCorrect={false}
                        autoCapitalize={false}
                        onChange={(e)=>setEmail(e.target.value)}
                        
                    />
                    {/* {suggestedEmail ? <label className="createOption text" onClick={(e)=>{setEmail(e.target.innerText); setEmailVal(e.target.innerText); setSuggestedEmail(null)}}>{suggestedEmail}</label> : null} */}
                </Form.Item>  

                {password?.length>7 ?
                <Form.Item>
                    <div onClick={()=>setManualPasswordPopover(!manualPasswordPopover)} className="generate-password">Change password</div>

                    <Input.Password 
                        className="generic-input-control"
                        value={password}
                        readOnly
                        />
                </Form.Item>
                : null
                }

                <Form.Item
                
                >
                    <Checkbox
                     onChange= {(e)=>{setManualPasswordPopover(e.target.checked);setPassword('');}}
                     value= {password?.length>7 ? true : false  }
                     checked= {password?.length>7 ? true : false }
                    >
                        {editUserData?.user? "Update manual password for this user" :"Set manual password for this user"}
                    </Checkbox>
                </Form.Item>      

                
                </>
                : null
                }
                
            </div>

            <ManualPassword
                visible={manualPasswordPopover}
                onClose={()=>setManualPasswordPopover(false)}
                password={password}
                setPassword={setPassword}
            />
            
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