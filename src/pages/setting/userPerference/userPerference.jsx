import "./userPerference.css";
import { UserOutlined } from "@ant-design/icons";
import { faCheck, faChevronLeft, faInfoCircle, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Dropdown, Form, Input, Menu, Table, Tabs, Tag } from "antd";
import { useEffect, useState } from "react";
import TabPane from 'antd/es/tabs/TabPane';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { GetUserByEmpIdQuery } from '../../../util/query/user.query';
import dayjs from "dayjs";
import { EditableAvatar } from "../../../components/avatar/editableAvatar";
import { UserAccessLogByEmployeeIdQuery } from "../../../util/query/userAccess.query";
import { LogoutAllSessionMutation } from "../../../util/mutation/logoutAllSession";
import { useDispatch } from "react-redux";
import {setNotification} from "../../../middleware/redux/reducers/notification.reducer";
import { updateUserMutation } from "../../../util/mutation/user.mutation";
import Spinner from "../../../components/spinner";
import { ActiveDeviceSession } from "../../../util/query/activeDeviceSession.query";
import { useSelector } from "react-redux";
import { containsLowercase, containsNumeric, containsSpecialCharacter, containsUppercase, generatePassword } from "../../../util/randomPassword";


const Actionmenu =({userDetail})=> {
    const [visible, setVisible] = useState(false);

    const menu = (
        <Menu style={{width: '200px'}}>
            <Menu.Item key="1" className={userDetail?.isManualPassword?"disabled": ""} >Resend invite email</Menu.Item>
            <Menu.Item key="2" >Reset password</Menu.Item>
            <Menu.Divider />
            <Menu.Item key="3" >Reallocate duties</Menu.Item>
            <Menu.Item key="4" >Deactive user</Menu.Item>
        </Menu>
    );
    return (
    <Dropdown overlay={menu} visible={visible} placement="bottomLeft" onClick={()=>setVisible(!visible)}>
         
          <div className="action-btn">Action <span className="caret" style={{color: 'white'}}></span></div>
       
    </Dropdown>
    );
};

export const UserPerference = ()=>{
    
    const {authenticatedUserDetail:{employeeId}} = useSelector(state=>state.userAuthReducer);   


    const {data, loading, refetch} = useQuery(GetUserByEmpIdQuery,{
        variables:{
            employeeId
        }
    });

    const [userDetail, setUserDetail] = useState(null);
    const [accessData, setAccessData] = useState([]);

    useEffect(()=>{
        if(data?.getUserByEmpId?.response[0]){
            setUserDetail(data?.getUserByEmpId?.response[0]);
            console.log(data?.getUserByEmpId?.response[0], "data?.getUserByEmpId?.response[0]")
            if(data?.getUserByEmpId?.response[0]?.permission && Object.keys(data?.getUserByEmpId?.response[0]?.permission)){
                setAccessData(Object.keys(data?.getUserByEmpId?.response[0]?.permission)?.map((key)=>({name:key, status: <div style={{display: 'flex', columnGap:'5px', alignItems:'center'}}><div style={{width:'15px', height:'15px', background:'#00BDA5', borderRadius:'50%'}}></div> On</div>})));
            }else{
                setAccessData(Object.keys(data?.getUserByEmpId?.response[0]?.userRolePermission[0]?.permission)?.map((key)=>({name:key, status: <div style={{display: 'flex', columnGap:'5px', alignItems:'center'}}><div style={{width:'15px', height:'15px', background:'#00BDA5', borderRadius:'50%'}}></div> On</div>})));
            }
        }
    }, [data?.getUserByEmpId?.response[0]]);

    const [tabKey, setTabKey] = useState("1");

    const column = [
        {title:'Name', dataIndex:'name'}, 
        {title: 'Status', dataIndex: 'status'}
    ];

    const navigate = useNavigate();
    const [activeSession, setActiveSession] = useState("resetPassword");

    const active = 'setting-sidebar-nav-list-item setting-navbar-active';
    const inactive = 'setting-sidebar-nav-list-item';

    // mutation to terminate all session of particular user
    const[ logoutAllSession, {loading: logoutAllSessionLoading} ] = useMutation(LogoutAllSessionMutation)
    
    const dispatch = useDispatch();

    const handelLogoutAllSession = async (employeeId) =>{
        try{
            await logoutAllSession({
                variables:{
                    employeeId
                }
            });
            
            dispatch(setNotification({
                notificationState:true, 
                message: "User logged out from all devices",
                error: false,
            }))
        }
        catch(err){
            dispatch(setNotification({
                notificationState:true, 
                message: err.message,
                error: true,
            }))
        }
    };



    const {data: activeDeviceSession} = useQuery(ActiveDeviceSession,{
        variables:{
            userId: employeeId
        }
    });

    // manage update password
    const [password, setPassword] = useState("");

    const autoGeneratePassword = ()=>{
        const autoGeneratedPassword = generatePassword(10);
        setPassword(autoGeneratedPassword);
    }

    const [isValidPassword, setIsValidPassword] = useState(false);

    useEffect(()=>{
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!=@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
        const isValid = passwordRegex.test(password);
        console.log(isValid, "isValidPassword", );
        setIsValidPassword(isValid)

    }, [password]);

    return (
        <div className="userDetail-container" style={{width:'auto', overflow:'hidden',}}>
            <div className="user-detail-inner">
                <div className="user-detail-header">
                   
                    <div className="userDetail-info" style={{margin:0}}>
                        {/* avatar section */}
                        <div className="userDetail-avatar">
                            <Avatar size={80}>
                                <UserOutlined/>
                            </Avatar>
                            <span>
                                <div className="h3">{userDetail?.employeeDetail[0]?.firstname+" "+userDetail?.employeeDetail[0]?.lastname}</div>
                                <div style={{marginTop:'16px', display: 'flex', columnGap:'8px'}}>
                                    <div style={{height:'15px',width:'15px',background:'#00BDA5', borderRadius:'50%'}}></div> 
                                    <span style={{fontSize:'12px',}}>{userDetail?.isManualPassword=="0"? "Manual" :  "Invited" } | </span> 
                                    <span style={{fontSize:'11px', fontWeight:'bold', letterSpacing:'1px'}}> {userDetail?.email} </span>
                                </div>
                            </span>
                        </div>


                    </div>

                </div>

                {/* user tabs */}
                <div className='editFieldTabs' style={{background:'transparent'}}>
                    <Tabs defaultActiveKey="1" className={tabKey=="1" ? "" : ""} onChange={(key)=>setTabKey(key)}>
                       

                        <TabPane tab={`Perferences`} key="3">
                           <div style={{display: 'flex', gap:'55px', background:'transparent'}}>
                                {/* user perferences */}
                                <div style={{width:'250px', maxWidth:'300px'}}>
                                    <div className={activeSession==="resetPassword"?active:inactive} onClick={()=>setActiveSession("resetPassword")} > Reset Password </div>
                                </div>

                                <div style={{width:'60%', margin:'0 50px'}}>
                                    {activeSession==="resetPassword"?
                                    // {/* handel resetPassword tab */}
                                    <div>
                                        
                                        <h3 style={{margin:0}}>Reset password</h3>
                                        
                                        <div onClick={autoGeneratePassword} className="generate-password forgetPassword">? Forget current password</div>
                                        
                                        <Input 
                                            placeholder={"Current password..."}
                                            className="generic-input-control"
                                            autoFocus
                                            // value={password}
                                            // onChange={(e)=>setPassword(e.target.value)}
                                            // suffix={isValidPassword && password?.length>7?<FontAwesomeIcon icon={faCopy} className="copy-password"/>:null}
                                        />
                                        
                                        <div style={{marginBottom:'16px'}}></div>

                                        <div onClick={autoGeneratePassword} className="generate-password forgetPassword">? Generate password</div>
                                        
                                        <Input 
                                            placeholder={"Password..."}
                                            className="generic-input-control"
                                            value={password}
                                            onChange={(e)=>setPassword(e.target.value)}
                                            // suffix={isValidPassword && password?.length>7?<FontAwesomeIcon icon={faCopy} className="copy-password"/>:null}
                                        />

                                        <div className="text">
                                            <b>Password must contain</b> <br/>
                                            <FontAwesomeIcon style={password?.length>7? {color: 'green', opacity: 1} : {color: 'lightgray', opacity: 0.5}}  icon={faCheck} /> At least 8 character long <br/>
                                            <FontAwesomeIcon style={containsLowercase(password)? {color: 'green', opacity: 1} : {color: 'lightgray', opacity: 0.5}}  icon={faCheck} /> Lower case letter <br/>
                                            <FontAwesomeIcon style={containsUppercase(password)? {color: 'green', opacity: 1} : {color: 'lightgray', opacity: 0.5}}  icon={faCheck} /> Upper case letter <br/>
                                            <FontAwesomeIcon style={containsSpecialCharacter(password)? {color: 'green', opacity: 1} : {color: 'lightgray', opacity: 0.5}}  icon={faCheck} /> Special character <br/>
                                            <FontAwesomeIcon style={containsNumeric(password)? {color: 'green', opacity: 1} : {color: 'lightgray', opacity: 0.5}}  icon={faCheck} /> Numeric character <br/>

                                        </div>

                                      

                                    </div>
                                    
                                    : null

                                    }   


                                </div>
                           </div>
                        </TabPane>

                        
                         
                        <TabPane tab={`Active Devices`} key="2">
                            <div style={{paddingTop:'25px'}}>
                                <div className="permission-header">Active Devices</div>
                                <div className="text">You can manage all your active devices here.</div>
                                {/* <Table
                                    columns={column}
                                    dataSource={accessData}
                                    
                                /> */}
                            </div> 
                        </TabPane>



                    </Tabs>
                </div>

            </div>
        </div>
    )
}