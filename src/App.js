import './assets/default.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Login } from "./pages/login";
import { DefaultLayout } from "./layout/defaultLayout";
import { Employee } from "./pages/employee";
import { Branch } from "./pages/branch";
import { EditForm } from "./pages/editForm";
import React, { useEffect } from "react";
import { Properties } from "./pages/formDrawer";

function App() {
  
  useEffect(()=>{
    localStorage.setItem("branchOrder", JSON.stringify([{"id":1,"content":"Address Line 1"},{"id":2,"content":"Address Line2"},{"id":3,"content":"City"},{"id":4,"content":"County"}]));
  },[])

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path='/user/' element={<DefaultLayout/>}>
          <Route index element={<Employee />} />
          <Route path='branch' element={<Branch />} />
          {/* <Route path='drawer' element={<Properties />} /> */}
        </Route>
        <Route path='/editfrom' element={<EditForm />} />
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
