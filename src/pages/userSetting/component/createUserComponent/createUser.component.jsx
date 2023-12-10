import { useQuery } from "@apollo/client";
import { Form, Input, Select } from "antd";
import {GetEmployeeRecord} from "../../../../util/query/employee.query";
import csv from './img.svg';
import { useEffect, useState } from "react";
import { GET_BRANCHES } from "../../../../util/query/branch.query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

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
            const data = employeeData?.getEmployee?.response?.find((res)=>res._id==emp);
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

    const { data: branchData, } = useQuery(GET_BRANCHES ,{
        fetchPolicy: 'cache-and-network',
        variables: {
            input: {
                filters: null
            }
        }
    });

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
                    <Select
                        placeholder="Select from employee / Add new user"
                        className="custom-select"
                        suffixIcon={<span className="caret"></span>}
                        // value={emp}
                        onChange={(e)=>{
                            if(e=="Adding new user"){
                                setemp("Adding new user");
                                return ;
                            }else{
                                setemp(e);
                            }
                        }}
                    >
                        <Select.Option style={{color:'black', fontWeight: 'bold', fontSize: '14px'}} value="Adding new user">Add new user</Select.Option>
                        {employeeData?.getEmployee?.response?.map((emp)=>(
                            <Select.Option value={emp._id}>{emp.firstname +" "+ emp.lastname}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {emp ?
                <>
                <Form.Item>
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
                
                <Form.Item>
                    <div style={{display:'flex', flexDirection: 'row', justifyContent:'space-between', columnGap: '15px'}}>
                        <Input 
                            className="generic-input-control"
                            placeholder="First Name"
                            value={firstname}
                        />
                        <Input 
                            className="generic-input-control"
                            placeholder="Last Name"
                            value={lastname}
                            
                        />
                    </div>
                </Form.Item>            

                <Form.Item>
                    <Select
                        placeholder="Branch"
                        className="custom-select"
                        suffixIcon={<div className="caret"></div>}
                        value={branch}
                    >
                        {branchData?.branches?.map((option)=>(<Select.Option value={option._id} > {option?.branchname} </Select.Option>))}
                        
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Select
                        placeholder="Employee Level"
                        className="custom-select"
                        suffixIcon={<div className="caret"></div>}
                    />
                </Form.Item>
                
                <Form.Item>
                    <Select
                        placeholder="Employee Type"
                        className="custom-select"
                        suffixIcon={<div className="caret"></div>}
                    />
                </Form.Item>
                </>
                : null
                }
                
            </div>


            <div>

                
                {/* <Select
                    className="custom-select"
                    labelInValue
                    placeholder="Select Employee"
                    style={{width:'40%',margin:'auto', display:'table'}}
                    suffixIcon={<span className="dropdowncaret"></span>}
                >
                    {employeeData?.getEmployee?.response?.map((emp)=>(
                        <Select.Option value={emp?._id}>{emp?.firstname +" "+ emp?.lastname}</Select.Option>
                    ))}

                </Select> */}

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
            
            </div>

        </div>
    );
}