import { Row, Col, Form, Input, Typography, Checkbox, Button } from 'antd';
import React from 'react';
import workforcecityLogin from '../../assets/img/workForceCityLogin.png';
import logo from '../../assets/img/wc-logo-big.png';



export const Login=()=>{
    return(
        <Row>
            <Col  span={12} style={{height:'100vh', backgroundColor: '#fafbfc'}}>
                <div className='login-poster-section'>
                    <img src={logo} alt="" className='logo' />
                    <Typography.Title level={3} className='logo-text'>Workforce City <span className='tm-text'>TM</span></Typography.Title>
                </div>
                    <img src={workforcecityLogin} className='loginPoster' alt="" />
            </Col>
            <Col span={12} >
                <Form className='login-form-container'>
                    <Typography.Title level={3} className='text-center login-title' >User login</Typography.Title>
                    <Form.Item>
                        <Input placeholder='Email' type="email" />
                        <span className="ant-form-text helper-text" >Email is invaild</span>
                    </Form.Item>

                    <Form.Item style={{marginBottom:'5px'}}>
                        <Input type='password' placeholder='Password' />
                        <span className="ant-form-text helper-text" >Password is invaild</span>

                        <span className="ant-form-text forgetPassword" style={{marginTop:'10px'}}>Forget password ?</span>
                    </Form.Item>

                    <Form.Item>
                        <Checkbox checked className='custom-checkbox'>
                            Remember me
                        </Checkbox>
                    </Form.Item>
                    
                    <Form.Item className='position-center'>
                        <Button className='login-btn' >Login</Button>
                    </Form.Item>

                </Form>
            </Col>
        </Row>
    )
}