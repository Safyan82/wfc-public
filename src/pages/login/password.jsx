import "./login.css";
import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { Row, Col, Form, Input, Typography, Checkbox, notification, Tag, Avatar } from 'antd';
import workforcecityLogin from '../../assets/img/workForceCityLogin.png';
import logo from '../../assets/img/wc-logo-big.png';
import { useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import { verifyPasswordMutation } from "../../util/mutation/user.mutation";
import Spinner from "../../components/spinner";
import { useDispatch } from "react-redux";
import { setAuthUserDetail } from "../../middleware/redux/reducers/userAuth.reducer";
import { browserName, CustomView } from 'react-device-detect';
import { UserOutlined } from "@ant-design/icons";

export const Password=()=>{

    // implementation of API
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();

    // fields
    const[password, setPassword] = React.useState({value:'',error:''});
    const dispatch = useDispatch();

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
                const userAgent = navigator.userAgent;
                const isMobile = /Mobi/i.test(userAgent);                

                const user = {
                    password: password?.value,
                    employeeId: emailVerificationDetail?._id,
                    platform:{
                        isMobile: isMobile,
                        operatingSystem: navigator.platform,
                        userAgent: userAgent,
                        browser: browserName
                      },
                }
                const userResponse = await verifyPassword({
                    variables:{
                        input: user
                    }
                });
                const {token, deviceId, ...rest} = userResponse?.data?.verifyPassword?.response
              
                dispatch(setAuthUserDetail(rest))
                localStorage.setItem("authToken", token);
                localStorage.setItem("employeeId", rest?.employeeId);
                localStorage.setItem("deviceId", deviceId);
                navigate("/user/branch");
            }
        }
        catch(err){
            openNotification('topRight', "Password is wrong");
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
                    
                    <Typography.Title level={3} className='text-center login-title' >
                        Welcome     {/* {emailVerificationDetail?.name} */}
                    </Typography.Title>
                        
                    <div className="text">
                        <Tag style={{color:'black', fontWeight:'500', padding:'2px 10px'}}>
                            <Avatar size={20}> <UserOutlined/> </Avatar>    {emailVerificationDetail?.email}
                        </Tag>
                    </div>

                    <Form.Item style={{marginTop: '45px'}}>
                        <Input autoFocus placeholder='Password' className='generic-input-control' type={showPass? "text" : "password"}  onChange={(e)=>{handelPassword(e.target.value)}}/>
                        <div className="ant-form-text helper-text" style={{textAlign: 'left', marginTop: '5px', height:'15px'}}>{password?.error && password?.error}</div>

                    
                        <Form.Item className='validationCheckboxGroup' style={{textAlign:'left'}}>
                        
                            <Checkbox onChange={()=>setShowPass(!showPass)}>
                                Show password
                            </Checkbox>
                        </Form.Item>
                    </Form.Item>


                    
                    <div  className="login-btnGrp" >
                        
                        <div className="forgetPassword" style={{marginTop:'5px'}} >Forget password ?</div>
                       
            
                        <button disabled={loading} onClick={handelAuth} className={loading? " disabled-btn drawer-filled-btn " :"drawer-filled-btn"}>Next</button>
                    
                    </div>
                </div>
                
                {/* <div className="text classic-login"  onClick={()=>navigate('/classic')}>
                    Switch to classic login
                </div> */}

            </div>


        </div>
        : 
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height:'100vh'}}>
            <Spinner color={'#ff7a53'} fontSize={80}/>
        </div>
    )
}