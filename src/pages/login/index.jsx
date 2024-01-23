import "./login.css";
import React, { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { Row, Col, Form, Input, Typography, Checkbox, notification } from 'antd';
import workforcecityLogin from '../../assets/img/workForceCityLogin.png';
import logo from '../../assets/img/wc-logo-big.png';
import { useQuery } from "@apollo/client";
import { checkUserForEmail } from "../../util/query/employee.query";
import { useDispatch } from "react-redux";
import { checkEmailDetails, resetUserDetail } from "../../middleware/redux/reducers/user.reducer";
import { resetAll } from '../../middleware/redux/reducers/reset.reducer';
import { useSelector } from "react-redux";


export const Login=()=>{

    const navigate = useNavigate();
    const regx=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // fields
    const[email, setEmail] = React.useState({value:'',error:''});
    const[remember, setRemember] = React.useState();

    // useEffect to redirect the user from login page if he already registered
    useEffect(()=>{
        if(localStorage.getItem('authToken')){
            navigate("/user/branch");
        }
    },[]);
    
    const {data} = useQuery(checkUserForEmail,{
        variables:{
            email: email?.value
        },
        skip: !regx.test(email?.value),
        fetchPolicy: 'network-only'
    });

    const dispatch = useDispatch();
    const state = useSelector(state => state?.userDetailReducer);
    useEffect(()=>{
        dispatch(resetUserDetail());
        dispatch(resetAll());
        console.log(state, "state")
    }, []);

    useEffect(()=>{
       if(data?.checkUserByEmail?.response?.hasOwnProperty('_id')){
            dispatch(checkEmailDetails(data?.checkUserByEmail?.response));
            setEmail({...email, error:''});
            return;
        }else if(regx.test(email?.value) && !data?.checkUserByEmail?.response?.hasOwnProperty('_id')){
            setEmail({...email, error: "Email is not registered"});
            return;
        }
    }, [data])


    const handelEmail=(value)=>{
        if(regx.test(value)){
            setEmail({error:'', value});
        }else{
            dispatch(resetUserDetail());
            setEmail({error:'Email is invalid'});

        }
    }


    return(
        <div className="login-parent-window">
            
            <div className='login-box'>
                <div className='login-form-container'>
                    <img src={logo} alt="" width={75} height={65}/>
                    
                    <Typography.Title level={3} className='text-center login-title' >Login</Typography.Title>
                    
                    <div className="text">
                        to continue to Workforce City
                    </div>
                    <Form.Item style={{marginTop: '45px'}}>
                        <Input autoFocus placeholder='Email' className='generic-input-control' type="email" onChange={(e)=>{handelEmail(e.target.value)}}/>
                        <div className="ant-form-text helper-text" style={{textAlign: 'left', marginTop: '5px', height:'15px'}}>{email?.error && email?.error}</div>
                        
                        <Form.Item className='validationCheckboxGroup' style={{textAlign:'left'}}>
                        
                            <Checkbox onChange={(e)=>setRemember(e.target.checked)}>
                                Remember me
                            </Checkbox>
                        </Form.Item>
                    </Form.Item>


                    <div className="login-btnGrp">
                        
                        <div className="forgetPassword" >Forget email ?</div>
                       
                        <button 
                            disabled={
                                // !data?.checkUserByEmail?.response?.hasOwnProperty('_id') || 
                                email?.value?.length<1 || email?.error!==""}
                            className={
                                // !data?.checkUserByEmail?.response?.hasOwnProperty('_id') || 
                                email?.value?.length<1 || email?.error!==""? "drawer-filled-btn disabled-btn" : "drawer-filled-btn" } 
                            onClick={()=>navigate('/pwd')}>
                            Next
                        </button>
                    </div>

                </div>
                {/* <div className="text classic-login" onClick={()=>navigate('/classic')}>
                    Switch to classic login
                </div> */}
            </div>


        </div>
    )
}