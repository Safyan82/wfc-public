import './assets/default.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Login } from "./pages/login";
import { DefaultLayout } from "./layout/defaultLayout";
import { Employee } from "./pages/employee";
import { Branch } from "./pages/branch";
import { EditForm } from "./pages/editForm/editForm.page";
import React, { useEffect } from "react";
import { Setting } from './pages/setting/setting';
import { useSelector } from 'react-redux';
import { notification } from 'antd';
import { FormView } from './pages/formView/formView';

function App() {
  
  useEffect(()=>{
    
    setInterval(() => {  
      if (navigator.onLine) {
        // console.log("online");
      } else {
        // console.log("offline");
      }
    }, 100);

  },[]);
  
  const {notificationToast} = useSelector(state => state.notificationReducer);
  const [api, contextHolder] = notification.useNotification();

  useEffect(()=>{
    if(Object.keys(notificationToast).length > 0){
      if(notificationToast?.error){

        api.error({
          message:notificationToast.message,
          placement:"top",
          className: 'notification-without-close',
        });

      }else{
        api.success({
          message:notificationToast.message,
          placement:"top",
          className: 'notification-without-close',
        });
      }
    }
  },[notificationToast]);

  useEffect(()=>{
    localStorage.setItem("branchOrder", JSON.stringify([{"id":1,"content":"Address Line 1"},{"id":2,"content":"Address Line2"},{"id":3,"content":"City"},{"id":4,"content":"County"}]));
  },[])

  return (
    <>
     {contextHolder}
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path='/user/' element={<DefaultLayout/>}>
          <Route index element={<Employee />} />
          <Route path='branch' element={<Branch />} />
          <Route path='setting' element={<Setting />} />
        </Route>
        <Route path='/editform' element={<EditForm />} />
        <Route path='/formview' element={<FormView/>} />
      </Routes>
    </BrowserRouter>
    {/* <Navbar/> */}
    {/* <Sidebar> */}
      {/* <TableComponent/> */}
      
    {/* </Sidebar> */}
    {/* <PasswordInput/>
    <PhoneNumberInput/> */}
    {/* <CreateField/> */}
    </>
  );
}

export default App;
