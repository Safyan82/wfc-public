import './assets/default.css';
import 'react-resizable/css/styles.css';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import 'react-quill/dist/quill.snow.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Login } from "./pages/login";
import { DefaultLayout } from "./layout/defaultLayout";
import { Employee } from "./pages/employee";
import { Branch } from "./pages/branch";
import { EditForm } from "./pages/editBranchForm/editForm.page";
import React, { useEffect } from "react";
import { Setting } from './pages/setting/setting';
import { useSelector } from 'react-redux';
import { notification } from 'antd';
import { FormView } from './pages/formView/formView';
import { BranchDetailPage } from './pages/branchDetailPage/branchDetailPage';
import { AllProperties } from './pages/allProperties/allProperties.page';
import { BranchAllPropHistory } from './pages/branchAllPropHistory/branchAllPropHistory.page';
import { SiteGroup } from './pages/sitegroup/sitegroup.page';
import { EditEmployeeForm } from './pages/employee/editEmployeeForm/editEmployeeForm';
import { EmployeeDetailPage } from './pages/employeeDetailPage/employeeDetail.page';
import { EmployeeDetailViewPage } from './pages/employeeDetailPage/employeeDetailView.page';
import { EmployeeAllPropHistory } from './pages/employeeAllPropHistory/employeeAllPropHistory';
import { PropertySetting } from './pages/setting/dataFields/propertySetting';
import { User } from './pages/setting/userSetting/user';
import { routes } from './util/routes/routes';
import { UserRole } from './pages/setting/userRole/userRole';
import { Password } from './pages/login/password';
import { ClassicLogin } from './pages/login/login';
import { PrivateRoutes } from './util/routes/private.routes';
import { ApolloProvider, useLazyQuery, useQuery } from '@apollo/client';
import { privateClient, publicClient } from './config/apollo';
import { useErrorBoundary } from './util/errorBoundary/errorboundary';
import { ErrorFallback } from './util/errorFallback/errorFallback';
import { isLoginCheckQuery } from './util/query/user.query';
import { UnAuthroizedAccess } from './pages/unAuthroizedAccess/unAuthroizedAccess.page';
import { UserAccess } from './pages/setting/userAccess/userAccess.page';
import { Join } from './pages/join/join';
import { UserDetailPage } from './pages/setting/userDetail/userDetail.page';
import { useDispatch } from 'react-redux';
import { setNotification } from './middleware/redux/reducers/notification.reducer';
import { UserPerference } from './pages/setting/userPerference/userPerference';
import { SkillSetting } from './pages/setting/skillsetting/skill.setting';
import { ModuleForms } from './pages/setting/moduleForms/moduleForms';
import { Module } from './pages/setting/module/module';
import { BillingServices } from './pages/setting/billing/billingservice/billingservice';
import { PaymentMethod } from './pages/setting/billing/paymentMethod/paymentMethods';
import { BillingNotification } from './pages/setting/billing/billingNotification/billingNotification';
import { Site } from '@src/pages/site/site.page';




function App() {
  
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(setNotification({}));
    setInterval(() => {  
      if (navigator.onLine) {
       
      } else {
        console.log("offline");
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
          placement: notificationToast?.placement || "top",
          className: 'notification-without-close',
        });

      }else{
        api.success({
          message:notificationToast.message,
          placement: notificationToast?.placement || "top",
          className: 'notification-without-close',
        });
      }
      dispatch(setNotification({}));
    }
  },[notificationToast]);

  const hasError = useErrorBoundary();

  return (
    hasError?
    <ErrorFallback/>
    :
    <>
    {contextHolder}
    <BrowserRouter>

      {/* public routes */}
      <ApolloProvider client={publicClient}>
        <Routes>
          
          <Route path='/' element={<Login/>} />
          <Route path="/pwd" element={<Password/>} />
          <Route path="/join/:employeeId" element={<Join/>} />
        </Routes>
      </ApolloProvider>


      {/* private Routes */}
      <ApolloProvider client={privateClient}>

        <Routes>
          {/* Error Fall back route */}
          <Route path="/error" element={<UnAuthroizedAccess/>}/>
          
          {/* Error Fall back route terminated*/}


          <Route path='/formview' element={<FormView/>} />
          <Route path='/branch/editform' exact element={<EditForm />} />
          <Route path='/employee/editform' exact element={<EditEmployeeForm />} />

          {/* private routes */}
          <Route path='/user/' element={<PrivateRoutes><DefaultLayout/></PrivateRoutes>}>

            <Route path='perference' exact element={<UserPerference/>}/>

            <Route path='branch' exact element={<Branch />}/>
            <Route path='branch-detail/:id' element={<BranchDetailPage/>} />
            <Route path='prophistory' element={<BranchAllPropHistory/>} />

            <Route path='employee' element={<Employee/>} />
            <Route path='employee-detail/:id' element={<EmployeeDetailPage/>} />
            <Route path='employee-detail-view/:id' element={<EmployeeDetailViewPage/>} />
            <Route path='employee-prop-history/:id' element={<EmployeeAllPropHistory/>} />
            

            <Route path='allproperties' element={<AllProperties/>} />
            
            <Route path='sitegroup' element={<SiteGroup/>} />
            <Route path='site' element={<Site/>} />

          
            
          </Route>

          {/* setting navigation layout under hte main navigation*/}
          <Route path={routes.setting} element={<PrivateRoutes><Setting /></PrivateRoutes>}  >
            <Route index element={<User/>} />
            <Route path={routes.propertySetting} exact element={<PropertySetting/>} />
            <Route path={routes.addUser} element={<User/>} />
            <Route path={routes.userRole} element={<UserRole/>} />
            <Route path={routes.userAccess} element={<UserAccess/>} />
            <Route path={"user/:employeeId"} element={<UserDetailPage/>} />
            <Route path={routes.forms} element={<ModuleForms/>} />

            <Route path={routes.employeeEditForm} exact element={<EditEmployeeForm />} />
            <Route path={routes.branchEditForm} exact element={<EditForm />} />
            <Route path={routes.editskill} exact element={<SkillSetting/>} />

            {/* objects */}
            <Route path={routes.module} exact element={<Module/>} />

            {/* billing */}

            <Route path={routes.service} exact element={<PrivateRoutes><BillingServices/></PrivateRoutes>}/>
            <Route path={routes.payment} exact element={<PaymentMethod/>}/>
            <Route path={routes.billingNotification} exact element={<BillingNotification/>}/>
            
          </Route>
          
        </Routes>

      </ApolloProvider>


    </BrowserRouter>
    </>
  );
}

export default App;
