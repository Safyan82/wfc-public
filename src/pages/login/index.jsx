import React from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
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
        <Row>
            {contextHolder}
            <Col  span={12} style={{height:'100vh', backgroundColor: '#fafbfc'}}>
                <div className='login-poster-section'>
                    <img src={logo} alt="" className='logo' />
                    <Typography.Title level={3} className='logo-text'>Workforce City <span className='tm-text'>TM</span></Typography.Title>
                </div>
                    <img src={workforcecityLogin} className='loginPoster' alt="" />
            </Col>
            <Col span={12} >
                <form className='login-form-container' onSubmit={handelformSubmit}>
                    <Typography.Title level={3} className='text-center login-title' >User login</Typography.Title>
                    <Form.Item>
                        <Input placeholder='Email' type="email" onChange={(e)=>{handelEmail(e.target.value)}}/>
                        <span className="ant-form-text helper-text" >{email?.error && email?.error}</span>
                    </Form.Item>

                    <Form.Item style={{marginBottom:'5px'}}>
                        <Input type='password' placeholder='Password' onChange={(e)=>{handelPassword(e.target.value)}}/>
                        <span className="ant-form-text helper-text" >{password?.error && password?.error}</span>

                        <span className="ant-form-text forgetPassword" style={{marginTop:'10px'}} onClick={()=>alert("Not Implemented Yet")}>Forget password ?</span>
                    </Form.Item>

                    <Form.Item>
                        <Checkbox checked className='custom-checkbox'>
                            Remember me
                        </Checkbox>
                    </Form.Item>
                    
                    <Form.Item className='position-center'>
                        <Input  className='login-btn' type="submit" value="Login"/>
                    </Form.Item>

                </form>
            </Col>
        </Row>
    )
}