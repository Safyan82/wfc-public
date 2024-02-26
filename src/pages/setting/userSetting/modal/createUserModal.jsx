import Spinner from '@src/components/spinner';
import './createUserModal.css';
import React, { useEffect, useState } from 'react';
import { Modal, Steps } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { CreateUserComponent } from '../component/createUserComponent/createUser.component';
import { Permission, PermissionComponent, PreDefineRoles } from '../component/permission/permission.component';
import { ReviewPermission } from '@src/components/reviewPermission/ReviewPermission';
import { useDispatch } from 'react-redux';
import { resetPermission, setPreDefinedDBPermission } from '@src/middleware/redux/reducers/permission.reducer';
import { useSelector } from 'react-redux';
import { refetchAllUser, resetUserDetail } from '@src/middleware/redux/reducers/user.reducer';
import { useMutation, useQuery } from '@apollo/client';
import { newUserMutation, updateUserMutation } from '@src/util/mutation/user.mutation';
import { setNotification } from '@src/middleware/redux/reducers/notification.reducer';
import { accessType } from '@src/util/types/access.types';
import { setEditUserData } from '@src/middleware/redux/reducers/editUser.reducer';
import { checkUserForEmail } from '@src/util/query/employee.query';



export const CreateUserModal = ({visible, onClose})=>{

    const [currentStep, setCurrentStep] = useState(0);
    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleNext = (e) => {
        setCurrentStep(currentStep + 1);
    };
    
    // handel user edit section
    const {editUserData} = useSelector((state)=>state?.editUserReducer);

    const [userRole, setuserRole] = useState(
      {name: editUserData?.user?.userRole[0]?.rolename, id: editUserData?.user?.userRole[0]?._id, permission: editUserData?.user?.userRole[0]?.permission} 
      ||
      ""
    );

    const [updateUser, {loading: updateUserLoading}] = useMutation(updateUserMutation);
    const dispatch = useDispatch();

    useEffect(()=>{
      if(Object.keys(editUserData)?.length>0){
        if(editUserData?.user?.userRole){
          setuserRole({name: editUserData?.user?.userRole[0]?.rolename, id: editUserData?.user?.userRole[0]?._id, permission: editUserData?.user?.userRole[0]?.permission} );
          // dispatch(setPreDefinedDBPermission(editUserData?.user?.permission));
        }
      }
    },[editUserData]);

    // terminate handel user section


    const [userAccessType, setUserAccessType] = useState(editUserData?.access || accessType.StandardPermission);
    
    
    // check the user role and populate propAccess attribute in redux for review component at the end of the step

    useEffect(()=>{
      if(userRole.hasOwnProperty('permission')){
        // dispatch(setPreDefinedDBPermission(userRole?.permission));
      }
    },[userRole]);

    useEffect(()=>{
      // if(userRole.hasOwnProperty('permission')){
        dispatch(resetPermission());
      // }
    },[userAccessType]);

    
    useEffect(()=>{
      // if(userRole.hasOwnProperty('permission')){
        dispatch(resetPermission());
      // }
    },[]);

    const {userDetail} = useSelector(state=> state.userDetailReducer);
    const {propAccess} = useSelector(state=> state.permissionReducer);

    console.log(userDetail?.email, "user email", editUserData?.user?.email)
    const regx=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const {data:userEmailVerification} = useQuery(checkUserForEmail,{
      variables:{
          email: userDetail?.email
      },
      skip: !regx.test(userDetail?.email) || userDetail?.email==editUserData?.user?.email,
      fetchPolicy: 'network-only'
    });
    const [isEmailValid, setEmailValid] = useState(false);

    useEffect(()=>{
      if(userEmailVerification?.checkUserByEmail?.response?.hasOwnProperty('_id')){
          console.log("email is not available");
          dispatch(setNotification({
            error:true,
            message: "This Email is already linked with another account",
            notificationState: true
          }));
          setEmailValid(false);
          return;
       }else if(regx.test(userDetail?.email) && !userEmailVerification?.checkUserByEmail?.response?.hasOwnProperty('_id')){
           setEmailValid(true)
           return;
       }else{
        setEmailValid(false)

       }
   }, [userEmailVerification])

    const steps =[
        {
          title: 'PERMISSIONS',
          component: <PermissionComponent 
          userAccessType={userAccessType} 
          setUserAccessType={setUserAccessType} 
          userRole={userRole}
          setuserRole={setuserRole}
          role
          selectedItem={0}
          />
        },
        {
          title: 'ACCESS LEVEL',
          component: <PermissionComponent 
          userAccessType={userAccessType} 
          setUserAccessType={setUserAccessType} 
          userRole={userRole}
          setuserRole={setuserRole}
          role
          selectedItem={1}/> 
        },
        {
          title: 'USER DETAIL',
          component: <CreateUserComponent />
        },
        {
          title: 'REVIEW',
          component: <ReviewPermission user={userDetail}  userAccessType={userAccessType} />
          // component: userRole?.permission ? <ReviewPermission user={userDetail}/> : null
        }
    ];

    const editSteps =[
      {
        title: 'ACCESS LEVEL',
        component: <PermissionComponent 
        userAccessType={userAccessType} 
        setUserAccessType={setUserAccessType} 
        userRole={userRole}
        setuserRole={setuserRole}
        role
        selectedItem={0}/> 
      },
      {
        title: 'USER DETAIL',
        component: <CreateUserComponent />
      },
      {
        title: 'REVIEW',
        component: <ReviewPermission user={userDetail}  userAccessType={userAccessType} />
        // component: userRole?.permission ? <ReviewPermission user={userDetail}/> : null
      }
  ];
    


    const { refreshAuthUser } = useSelector((state)=>state.userAuthReducer);
    //  create user mutation
    const [addNewUser, {loading}] = useMutation(newUserMutation);
    const handelSubmit = async () => {
      try{
        
        const userInfo = {
          userAccessType,
          userRole: userAccessType==accessType.StandardPermission ? userRole?.id || null : null,
          permission: userAccessType==accessType.StandardPermission ? null : userAccessType==accessType.CustomerPermission ? Object.fromEntries(Object.entries(propAccess).slice(0,5)) : propAccess,
          password: userDetail?.password,
          email: userDetail?.email || userDetail?.metadata?.email,
          isManualPassword: userDetail?.hasOwnProperty("manualPassword")? userDetail?.manualPassword : 0,
          employeeId: userDetail?._id
        };

        if(editUserData?.user){
          delete userInfo.isManualPassword;
          await updateUser({
            variables:{
              input: {_id: editUserData?._id, ...userInfo}
            }
          });
          // update navbar while refetch the auth user permissions/roles
          await refreshAuthUser();
        }else{
          await addNewUser({
            variables:{
              input: userInfo
            }
          });
        }
        
        dispatch(setNotification({
          notificationState:true, 
          message:"System user created successfully",
          error: false,
        }));

        await dispatch(refetchAllUser(true))
        await dispatch(resetPermission());
        await dispatch(resetUserDetail());
        await dispatch(setEditUserData({}));
        sessionStorage.removeItem("editDone");
        onClose();
        
      }
      catch(err){
        sessionStorage.removeItem("editDone");
        dispatch(setNotification({
          notificationState:true, 
          message:err.message,
          error: true,
        }));

      }

    };
    
    const stepToRender = editUserData?.user? editSteps : steps || [];
    return(
        <Modal
            visible={visible}     
            width="100%"
            height="100vh"
            className='createUserModal'
            style={{ top: 10, height: '100vh', paddingBottom: 10 }}
            footer={
                <div className='drawer-footer' style={{marginTop:0, display:'flex', justifyContent:'space-between'}}>
                    <div>
                    {currentStep > 0 &&
                      <button disabled={false} className={'drawer-outlined-btn'} onClick={handlePrev}>
                        <FontAwesomeIcon style={{marginRight:'0.5em'}} icon={faChevronLeft}/> {'Back'} 
                      </button>
                    }
        
                      <button className='drawer-btn' onClick={async ()=>{
                        // await dispatch(setPreDefinedDBPermission(userRole?.permission)); 
                        await dispatch(resetPermission());
                        await dispatch(resetUserDetail());
                        await dispatch(setEditUserData({}));
                        sessionStorage.removeItem("editDone")
                        onClose();}} >Cancel</button>
                    </div>
                    
                    {(currentStep < stepToRender.length - 1) &&
                      <button id="nextBtn" 
                      disabled={
                        currentStep==1 && userAccessType===accessType.StandardPermission && userRole?.length<1  ||
                        currentStep===2 && userDetail && Object.keys(userDetail)?.length<1 || currentStep===2 && userDetail?.email=="" && !isEmailValid ? true : false}
                      className={
                        currentStep==1 && userAccessType===accessType.StandardPermission && userRole?.length<1 || 
                        currentStep===2 && userDetail && Object.keys(userDetail)?.length<1  || currentStep===2 && userDetail?.email=="" && !isEmailValid ? ' disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} onClick={handleNext}>
                      {'Next'} <FontAwesomeIcon className='next-btn-icon' icon={faChevronRight}/>
                      </button>
                    } 
                    {currentStep == stepToRender.length - 1 && 
                      <button disabled={loading} onClick={handelSubmit} className={(currentStep ==0) || loading ? ' disabled-btn drawer-filled-btn' : 'drawer-filled-btn'}>
                      {loading? <Spinner/> : editUserData?.user? 'Update' :'Create'}
                      </button>
                    }
  
                </div>
        }
        closable={false}
        >
            <div className='userModal modal-parent'>
                <div className="user-header">
                    <div className="text w-100">{editUserData?.user? "Update " : "Create "} User</div>
                    <Steps current={currentStep} progressDot={customDot}>
                    {stepToRender?.map((step, index) => (
                        <Step key={index} title={step.title} />
                    ))}
                    </Steps>
                    <div className="text w-100">Step {currentStep+1} of {stepToRender?.length}</div>
                </div>
                <div>{stepToRender[currentStep].component}</div>


            </div>
        </Modal>
    );
}


const { Step } = Steps;
const customDot = (dot, { status, index }) => {
  return (
    <div className={status=="process" ? 'custom-dot custom-icon-active' : status=='finish' ? 'custom-dot custom-icon-finished' : `custom-dot`}>
    </div>
  );
};