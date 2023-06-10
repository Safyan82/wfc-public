import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, Button } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './modal.css';

const AddBranch = ({ visible, onCancel }) => {
  const navigate = useNavigate();
      
  const branchOrder = JSON.parse(localStorage.getItem("branchOrder"));
  const [addresslist,setAddressList]=useState([]);

  const [isPostCodeUp, setIsPostCodeUp] = useState(true);
  const [isAddressSetuped, setIsAddressSetuped] = useState(true);

  const [address1, setaddress1] = useState("");
  const [address2, setaddress2] = useState("");
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");

  useEffect(()=>{
    localStorage.setItem("branchOrder", JSON.stringify([{"id":1,"content":"Branch Name"},{"id":2,"content":"Post code"},{"id":3,"content":"Address Line 1"},{"id":4,"content":"Address Line2"},{"id":5,"content":"City"},{"id":6,"content":"County"}]));
  },[])


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
    const address = JSON.parse(localStorage.getItem('branch'));
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

  const handelSubmit=()=>{
    const branchForm = document.getElementById("branchForm");
    const inputs = (branchForm.querySelectorAll("input"));
    let i = [];
    const branchName = branchForm.querySelector('input[name="BranchName"]');
    inputs.forEach((input)=>{
      i.push(input);
      if(input.value.length<2){
        input.style.borderColor="red";
        input.style.boxShadow="0 0 4px 1px red, 0 0 0 1px red";
        return
      }else{
        input.style.borderColor="rgba(0,208,228,.5)";
        input.style.boxShadow="0 0 4px 1px rgba(0,208,228,.3), 0 0 0 1px #00d0e4";
        return
      }
    });

    const data = i?.every((input) => input.value.length>1)
    if(data){
      const d = JSON.parse(localStorage.getItem("branches"))||[];
      localStorage.setItem("branches", JSON.stringify([...d,i?.map((d)=>({[d.name]:d.value}))]))
    }

    // if(branchName.value>2){
    //   const d = JSON.parse(localStorage.getItem("branches", JSON.stringify()))
    // }
  }

  const handelChange=(e)=>{
    if(e.value.length>2){
      e.style.borderColor="rgba(0,208,228,.5)";
      e.style.boxShadow="0 0 4px 1px rgba(0,208,228,.3), 0 0 0 1px #00d0e4";
    }
  }

  return (
    <Modal
      visible={visible}
      className='slide-in-right-to-left-modal'
      footer={
        <div className='footer'>
            <Button className='grid-filed-btn' onClick={handelSubmit}>Create</Button>
            <Button className='grid-outlined-btn'>Create and add another</Button>
            <Button className='grid-outlined-btn' onClick={onCancel}>Cancel</Button>
        </div>
      }
      closable={false}
    >
      <div className='modal-header-title'>
           <span>Add Branch</span>
           <span className='close' onClick={onCancel}><FontAwesomeIcon icon={faClose}/></span>
      </div>
      <div className='modal-body'>
        <div className='title' onClick={()=>navigate('/editfrom',{
      state: {
        title: 'Branch',
        url:'/user/branch',
      }
    })}> <FontAwesomeIcon icon={faExternalLink} style={{ marginLeft: 4 }} /> Edit this form </div>
        
        <form id="branchForm" className='form'>
         {branchOrder?.map((branch)=>(
           <Form.Item>
            <label>{branch.content}</label>
            <Input className='input-control' onChange={(e)=>handelChange(e.target)} name={branch.content.replaceAll(" ","")} />
          </Form.Item>
          ))}            
        </form>

      </div>    
    </Modal>
  );
};

export default AddBranch;
