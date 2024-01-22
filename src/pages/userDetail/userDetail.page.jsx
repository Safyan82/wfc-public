import "./userDetail.page.css";
import { UserOutlined } from "@ant-design/icons";
import { faChevronLeft, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Dropdown, Form, Input, Menu, Table, Tabs, Tag } from "antd";
import { useEffect, useState } from "react";
import TabPane from 'antd/es/tabs/TabPane';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GetUserByEmpIdQuery } from '../../util/query/user.query';
import dayjs from "dayjs";
import { EditableAvatar } from "../../components/avatar/editableAvatar";
import { UserAccessLogByEmployeeIdQuery } from "../../util/query/userAccess.query";



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

export const UserDetailPage = ()=>{
    
    const {employeeId} = useParams();

    const {data, loading} = useQuery(GetUserByEmpIdQuery,{
        variables:{
            employeeId
        }
    });

    const [userDetail, setUserDetail] = useState(null);
    const [accessData, setAccessData] = useState([]);

    useEffect(()=>{
        if(data?.getUserByEmpId?.response[0]){
            setUserDetail(data?.getUserByEmpId?.response[0]);
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
    const [activeSession, setActiveSession] = useState("profile");

    const active = 'setting-sidebar-nav-list-item setting-navbar-active';
    const inactive = 'setting-sidebar-nav-list-item';

    const {data: userAccessLog} = useQuery(UserAccessLogByEmployeeIdQuery,{
        variables:{
            employeeId: employeeId
        },
        skip: !employeeId
    });

    // console.log(userAccessLog?.getUsersAccessLogByEmpId)
    const [ip, setip] = useState("");
    const [ipList, setIpList] = useState([]);

    return (
        <div className="userDetail-container">
            <div className="user-detail-inner">
                <div className="user-detail-header">
                    <div className="user-back-link" onClick={()=>navigate("/setting/adduser")}> <FontAwesomeIcon icon={faChevronLeft} style={{fontSize:'8px', marginRight:'10px'}} /> <span>Back to all users</span> </div>

                    <div className="userDetail-info">
                        {/* avatar section */}
                        <div className="userDetail-avatar">
                            <Avatar size={80}>
                                <UserOutlined/>
                            </Avatar>
                            <span>
                                <div className="h3">{userDetail?.email}</div>
                                <div style={{marginTop:'16px', display: 'flex', columnGap:'8px'}}>
                                    <div style={{height:'15px',width:'15px',background:'#00BDA5', borderRadius:'50%'}}></div> 
                                    <span style={{fontSize:'12px',}}>{userDetail?.isManualPassword=="0"? "Manual" :  "Invited" } | </span> 
                                    <span style={{fontSize:'11px', fontWeight:'bold', letterSpacing:'1px'}}> {userDetail?.email} </span>
                                </div>
                            </span>
                        </div>

                        {/* action button */}
                        <Actionmenu userDetail={userDetail}/>

                    </div>

                </div>

                {/* user tabs */}
                <div className='editFieldTabs'>
                    <Tabs defaultActiveKey="1" className={tabKey=="1" ? "system-user" : ""} onChange={(key)=>setTabKey(key)}>
                        
                        <TabPane tab={`Overview`} key="1"  >
                            <div className="user-detail-overview-card">
                                <div className="user-detail-overview-card-inner">
                                    <div className="card-header-text">Date Created</div>
                                    <div>{dayjs(userDetail?.createdAt).format("DD/MM/YYYY")}</div>
                                    <div className="small-text" style={{margin:'0'}}>by safyan mehar</div>
                                </div>
                                <div className="user-detail-overview-card-inner">
                                    <div className="card-header-text">Last active</div>
                                    <b>--</b>
                                </div>
                                <div className="user-detail-overview-card-inner">
                                    <div className="card-header-text">Last login type</div>
                                    <b>--</b>
                                </div>
                            </div>
                        </TabPane>

                        <TabPane tab={`Access`} key="2">
                            <div style={{paddingTop:'25px'}}>
                                <div className="permission-header">Permissions</div>
                                <div className="text">Permissions manage how users can work with features and tools.</div>
                                <Table
                                    columns={column}
                                    dataSource={accessData}
                                    
                                />
                            </div> 
                        </TabPane>

                        <TabPane tab={`Perferences`} key="3">
                           <div style={{display: 'flex', gap:'55px'}}>
                                {/* user perferences */}
                                <div style={{width:'182px', maxWidth:'215px'}}>
                                    <div className={activeSession==="profile"?active:inactive} onClick={()=>setActiveSession("profile")} >Profile</div>
                                    <div className={activeSession==="log"?active:inactive}  onClick={()=>setActiveSession("log")} >Access Log</div>
                                    <div className={activeSession==="ip"?active:inactive}  onClick={()=>setActiveSession("ip")} >IP whitelisting</div>
                                </div>

                                <div style={activeSession!=="profile"?{width:'100%'}: {width:'auto'}}>
                                    {activeSession==="profile"?
                                    // {/* handel profile tab */}
                                    <div>
                                        <div className="permission-header">User Preferences</div>
                                        <div className="text">This applies across any Workforce city account they have.</div>
                                        <h3>Profile image</h3>
                                        <EditableAvatar size={80} src={<UserOutlined/>}/> <br/><br/>
                                        <Form.Item className="mt32 mb32">
                                            <label>First name</label>
                                            <Input
                                                className="generic-input-control"
                                                value={userDetail?.employeeDetail[0]?.firstname}
                                                readOnly
                                            />
                                        </Form.Item>

                                        <Form.Item className="mt32 mb32">
                                            <label>Last name</label>
                                            <Input
                                                className="generic-input-control"
                                                value={userDetail?.employeeDetail[0]?.lastname}
                                                readOnly
                                            />
                                        </Form.Item>

                                        <Form.Item className="mt32 mb32">
                                            <label>Primary email</label>
                                            <Input
                                                className="generic-input-control"
                                                value={userDetail?.email}
                                                readOnly
                                            />
                                        </Form.Item>
                                        
                                        <Form.Item className="mt32 mb32">
                                            <label>Additional email <FontAwesomeIcon icon={faInfoCircle} /></label>
                                            <Input
                                                className="generic-input-control"
                                                value={userDetail?.employeeDetail[0]?.metadata?.email}
                                                readOnly
                                            />
                                        </Form.Item>
                                        
                                        <Form.Item className="mt32 mb32">
                                            <label>Phone number (if any)</label>
                                            <Input
                                                className="generic-input-control"
                                                value={userDetail?.employeeDetail[0]?.metadata?.phone}
                                                readOnly
                                            />
                                        </Form.Item>
                                        
                                        {/* <Form.Item className="mt32 mb32">
                                            <label>Branches</label>
                                            {userDetail?.employeeDetail[0]?.branch?.map((empbranch)=>(
                                                <Tag>
                                                    {empbranch}
                                                </Tag>
                                            ))}
                                        </Form.Item> */}

                                    </div>
                                    
                                    : activeSession==="log"?

                                    // {/* handel active session*/}
                                    <div>
                                        <div className="permission-header">User Access Log</div>
                                        <div className="text">Account access details would be here.</div>

                                        <h4 className="grid-hover" style={{margin:0, textDecoration:'underline'}}>Logout from all devices</h4>
                                        <div className="text">To logout this user from all devices.</div>
                                        
                                        {/* user logs */}

                                        <Table
                                            columns={[{title:'IP', dataIndex:'ip'}, {title:'Location', dataIndex:'location'}, {title:'Accessed At', dataIndex:'accessedAt'}]}
                                            dataSource={[...userAccessLog?.getUsersAccessLogByEmpId]?.reverse()}
                                        />

                                    </div>

                                    :
                                    // Handel IP whitelist
                                    <div>
                                        <div className="permission-header">Restrict user access</div>
                                        <div className="text">Restrict this user to access the system with defined IPs.</div>
                                        
                                        <div className="mt32 mb32" style={{display:'flex', gap:'64px'}}>
                                            <Input
                                                placeholder="IP address ..."
                                                className="generic-input-control"
                                                style={{width:'190%'}}
                                                autoFocus
                                            />
                                            <button className="disabled-btn drawer-filled-btn" style={{width:'100%'}}>Add IP</button>
                                        </div>

                                    </div>
                                    }   


                                </div>
                           </div>
                        </TabPane>
                    </Tabs>
                </div>

            </div>
        </div>
    )
}