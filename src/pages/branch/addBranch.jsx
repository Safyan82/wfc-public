import React, { useState } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddBranch = ({ visible, onCancel }) => {
  const navigate = useNavigate();
      
  const [addresslist,setAddressList]=useState([]);

  const [isPostCodeUp, setIsPostCodeUp] = useState(false);
  const [isAddressSetuped, setIsAddressSetuped] = useState(false);

  const [address1, setaddress1] = useState("");
  const [address2, setaddress2] = useState("");
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");


  const getAddress = (postCode)=>{
      axios.get(`https://api.getaddress.io/autocomplete/${postCode}?api-key=tscY072nREagefYorq2XFA39594`)
      .then((res) => {
        setAddressList(res.data.suggestions);
        InStorage(postCode, res.data.suggestions);
        setTimeout(() => {
          setIsPostCodeUp(true);
        }, 800);
      })
      .catch((err) => console.log(err));
  };

  const InStorage=(postCode, postcodeData)=>{
    const data = JSON.parse(localStorage.getItem('postcode'));
    localStorage.setItem('postcode', JSON.stringify({...data, [postCode]:postcodeData}));
  }

  const checkIfExist=(postcode)=>{
    const address = JSON.parse(localStorage.getItem('postcode'));
    if(address && Object.keys(address)?.length>0){
      if(Object.keys(address)?.includes(postcode)){
        setAddressList(address[postcode]);
        setTimeout(() => {
          setIsPostCodeUp(true);
        }, 800);
      }else{
        getAddress(postcode);
      }
    }else{
      getAddress(postcode);
    }
  }

  const handelPostcode=(postCode)=>{
    if(postCode?.length>4){
      checkIfExist(postCode);
    }
  }

  const handelSelectedAddress = (address)=>{
    const addr = address.split(",");
    console.log(address, addr);
    setaddress1(addr[0]);
    setCity(addr[1]);
    setCounty(addr[2]);
    setIsAddressSetuped(true);
    setIsPostCodeUp(false);
    
  }

  return (
    <Modal
      visible={visible}
      wrapClassName="right-modal"
      width={600}
      footer={null}
      closable={false}
    >
      <div className='modal-header-title'>
           <span>Add Branch</span>
           <span className='close' onClick={onCancel}>x</span>
      </div>
      <div className='modal-body'>
        <div className='title' onClick={()=>navigate('/editfrom',{
      state: {
        title: 'Branch',
      }
    })}> <FontAwesomeIcon icon={faExternalLink} style={{ marginLeft: 4 }} /> Edit this form </div>
        
        <form className='form'>
          {
            <Form.Item className={isPostCodeUp ? 'branch-hide' : 'branch'}>
                <label>Branch Name</label>
                <Input className={'input-control'}/>
            </Form.Item>
            }
            <Form.Item>
              <label>Post code</label>
              <Input className='input-control' onChange={(e)=>handelPostcode(e.target.value)}/>
              {
                addresslist?.length>0 && !isPostCodeUp &&
                <span className="ant-form-text branch-helper-text" onClick={()=>setIsPostCodeUp(true)}>Re-select address?</span>
              }

            </Form.Item>

            {isPostCodeUp &&
            
              <Form.Item>
                <label>Address</label>
                <Select 
                  className='select'
                  placeholder="Select Address"
                  onChange={handelSelectedAddress}
                >
                  <Select.Option hidden selected>Select Address</Select.Option>
                  {addresslist?.map((list, index)=>(
                    <Select.Option key={index} value={list.address}>{list.address}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            }

            {
              isAddressSetuped &&
              <>
                <Form.Item>
                    <label>Address Line 1</label>
                    <Input className='input-control' value={address1} onChange={(e)=>handelPostcode(e.target.value)}/>
                </Form.Item>
                <Form.Item>
                    <label>Address Line 2</label>
                    <Input className='input-control' value={address2} onChange={(e)=>handelPostcode(e.target.value)}/>
                </Form.Item>
                <Form.Item>
                    <label>City</label>
                    <Input className='input-control' value={city} onChange={(e)=>handelPostcode(e.target.value)}/>
                </Form.Item>
                <Form.Item>
                    <label>County</label>
                    <Input className='input-control' value={county} onChange={(e)=>handelPostcode(e.target.value)}/>
                </Form.Item>
              </>
            }
        </form>

      </div>    
    </Modal>
  );
};

export default AddBranch;
