import "./login.css";
import React from 'react';
import {useNavigate} from 'react-router-dom';
import { Row, Col, Form, Input, Typography, Checkbox, notification } from 'antd';
import workforcecityLogin from '../../assets/img/workForceCityLogin.png';
import logo from '../../assets/img/wc-logo-big.png';


export const Login=()=>{

    // implementation of API
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();

    // fields
    const[email, setEmail] = React.useState({value:'',error:''});
    const[password, setPassword] = React.useState({value:'',error:''});
    const[remember, setRemember] = React.useState();


    const openNotification = (placement,message, description) => {
      api.warning({
        message: `Warning`,
        closeIcon: null,
        description:
          'Email and Password is required',
        placement,
      });
    };

    const handelformSubmit=(e)=>{
        e.preventDefault();
        if(email.value.length >0 && password.value.length >0 && email.error=="" && password.error==""){
            navigate("/user/branch");
        }else{
            openNotification('topRight');
        }
    }

    const handelEmail=(value)=>{
        const regx=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(regx.test(value)){
            
            setEmail({error:'', value});
        }else{
            setEmail({error:'Email is invalid'});
        }
    }

    const handelPassword=(value)=>{
        const regx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?=.*[a-zA-Z0-9@#$%^&+=!]).{8,}$/;
        if(regx.test(value)){
            setPassword({error:'', value});
        }else{
            setPassword({error:'Password must be at least 8 Character long and include at least one uppercase letter, one lowercase letter, one digit, and one special character'});
        }
    }

    return(
        <div className="login-parent-window">
            {contextHolder}
            
            <div className='login-box'>
                <div className='login-form-container'>
                    <img src={logo} alt="" width={75} height={65}/>
                    
                    <Typography.Title level={3} className='text-center login-title' >Login</Typography.Title>
                    
                    <div className="text">
                        to continue to Workforce City
                    </div>
                    <Form.Item style={{marginTop: '45px'}}>
                        <Input autoFocus placeholder='Email' className='generic-input-control' type="email" onChange={(e)=>{handelEmail(e.target.value)}}/>
                        <div className="ant-form-text helper-text" style={{textAlign: 'left', marginTop: '5px'}}>{email?.error && email?.error}</div>
                        
                        <Form.Item className='validationCheckboxGroup' style={{textAlign:'left'}}>
                        
                            <Checkbox>
                                Remember me
                            </Checkbox>
                        </Form.Item>
                    </Form.Item>


                    <Form.Item className='validationCheckboxGroup' style={{position: 'absolute', top: '430px', }}>
                        
                        <span className="ant-form-text forgetPassword" style={{marginTop:'5px'}} >Forget email ?</span>
                       
                    </Form.Item>
                    
                    <Form.Item style={{position: 'absolute', top: '450px', marginLeft: 'calc(450px - 80px)'}}>
                        <button className="drawer-filled-btn"  onClick={()=>navigate('/pwd')}>Next</button>
                    </Form.Item>

                </div>
                <div className="text classic-login" onClick={()=>navigate('/classic')}>
                    Switch to classic login
                </div>
            </div>


        </div>
    )
}