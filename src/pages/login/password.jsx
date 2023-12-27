import "./login.css";
import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { Row, Col, Form, Input, Typography, Checkbox, notification, Tag } from 'antd';
import workforcecityLogin from '../../assets/img/workForceCityLogin.png';
import logo from '../../assets/img/wc-logo-big.png';
import { useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import { verifyPasswordMutation } from "../../util/mutation/user.mutation";
import Spinner from "../../components/spinner";


export const Password=()=>{

    // implementation of API
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();

    // fields
    const[password, setPassword] = React.useState({value:'',error:''});


    const openNotification = (placement,message, description) => {
      api.warning({
        message: message,
        closeIcon: null,
        placement,
      });
    };

    const {emailVerificationDetail} = useSelector(state=>state.userDetailReducer);

    useEffect(()=>{
        if(emailVerificationDetail && Object.keys(emailVerificationDetail)?.length<1){
             window.location="/";
        }
    }, [emailVerificationDetail]);

    const [verifyPassword, {loading}] = useMutation(verifyPasswordMutation);

    const handelAuth= async ()=>{
        try{
            if(password.value.length >0 && password.error==""){
                const user = {
                    password: password?.value,
                    employeeId: emailVerificationDetail?._id
                }
                const userResponse = await verifyPassword({
                    variables:{
                        input: user
                    }
                });
                localStorage.setItem("authToken", userResponse?.data?.verifyPassword?.response?.token);
                navigate("/setting/userRole");
            }
        }
        catch(err){
            openNotification('topRight', err.message);
        }
    }

    const handelPassword=(value)=>{

        const regx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!-])(?=.*[a-zA-Z0-9@#$%^&+=!]).{8,}$/;
        if(regx.test(value)){
            setPassword({error:'', value});
        }else{
            setPassword({error:'Password is not valid'});
        }
    }


    const [showPass, setShowPass] = useState(false);



    return(
        emailVerificationDetail?._id?
        <div className="login-parent-window">
            {contextHolder}
            
            <div className='login-box'>
                <div className='login-form-container'>
                    <img src={logo} alt="" width={75} height={65}/>
                    
                    <Typography.Title level={3} className='text-center login-title' >Hi. {emailVerificationDetail?.name}</Typography.Title>
                    
                    <div className="text">
                        <Tag>{emailVerificationDetail?.email}</Tag>
                    </div>

                    <Form.Item style={{marginTop: '45px'}}>
                        <Input autoFocus placeholder='Password' className='generic-input-control' type={showPass? "text" : "password"}  onChange={(e)=>{handelPassword(e.target.value)}}/>
                        <div className="ant-form-text helper-text" style={{textAlign: 'left', marginTop: '5px'}}>{password?.error && password?.error}</div>

                    
                        <Form.Item className='validationCheckboxGroup' style={{textAlign:'left'}}>
                        
                            <Checkbox onChange={()=>setShowPass(!showPass)}>
                                Show password
                            </Checkbox>
                        </Form.Item>
                    </Form.Item>


                    
                    <Form.Item className='validationCheckboxGroup' style={{position: 'absolute', top: '430px', }}>
                        
                        <span className="ant-form-text forgetPassword" style={{marginTop:'5px'}} >Forget password ?</span>
                       
                    </Form.Item>

                    
                    <Form.Item style={{position: 'absolute', top: '450px', marginLeft: 'calc(450px - 80px)'}}>
                        <button onClick={handelAuth} className="drawer-filled-btn">Next</button>
                    </Form.Item>

                </div>
                
                <div className="text classic-login"  onClick={()=>navigate('/classic')}>
                    Switch to classic login
                </div>

            </div>


        </div>
        : 
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height:'100vh'}}>
            <Spinner color={'#ff7a53'} fontSize={80}/>
        </div>
    )
}