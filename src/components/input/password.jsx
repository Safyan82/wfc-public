import React, {useState} from 'react';
import { Input, Form } from 'antd';

const PasswordInput = () => {
 
  const [helper, setHelperMessaage] = useState("Minimum 8 characters");
  const [status, setStatus] = useState();

  const handleChange = (e) => {
      const value = e.target.value;
      const reg = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/;
      if ((value.length <8 || !reg.test(value))) {
        setStatus('error');
        setHelperMessaage('Password must be at least 8 Character long and include at least one uppercase letter, one lowercase letter, one digit, and one special character');
     }else{

         setHelperMessaage("Minimum 8 characters");
         setStatus(null);
    }
  }


  return (
    <Form.Item
      name="password"
      help={helper}
    >
      <Input.Password onChange={(e)=>handleChange(e)} status={status} placeholder='Password'/>
    </Form.Item>
  );
};

export default PasswordInput;
