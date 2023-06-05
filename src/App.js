import { Navbar } from "./components/navbar";
import TableComponent from "./components/table";
import './assets/default.css';
import Sidebar from "./components/sidebar";
import PasswordInput from "./components/input/password";
import PhoneNumberInput from "./components/input/phone";
import { CreateField } from "./components/createFields";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Login } from "./pages/login";
import { DefaultLayout } from "./layout/defaultLayout";
import { Employee } from "./pages/employee";

function App() {
  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path='/user' element={<DefaultLayout/>}>
          <Route index element={<Employee />} />
        </Route>
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
