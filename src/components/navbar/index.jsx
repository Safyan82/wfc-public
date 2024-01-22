import React,{ useEffect, useState } from 'react';
import { Menu, Input, Space, Avatar, Layout, Header, Dropdown } from 'antd';
import {
  SearchOutlined,
  MoreOutlined,
  LogoutOutlined,
  WechatOutlined,
  CloseOutlined,
  DownOutlined,
} from '@ant-design/icons';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faWindowRestore, faWindowMaximize, faWindowMinimize} from '@fortawesome/free-regular-svg-icons';
import WordLetterAvatar from '../avatar';
import logo from '../../assets/img/wfc-new-logo.png';
import { faBell, faComment, faComments, faGear, faRing } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './navbar.css';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import { GetUserByEmpIdQuery } from '../../util/query/user.query';
import { useDispatch } from 'react-redux';
import { setAuthUserDetail, setAuthUserRefresh } from '../../middleware/redux/reducers/userAuth.reducer';
import { isArray } from '@apollo/client/utilities';
import { accessType } from '../../util/types/access.types';


const { SubMenu } = Menu;



const UserMenu = ({visible, setVisible, employeeDetail}) => {

  
    const navigate = useNavigate();
    const menu = (
      <Menu style={{width: '200px'}}>
        <Menu.Item key="1">Profile</Menu.Item>
        <Menu.Item key="2">Active Session</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3" onClick={()=>{localStorage.clear(); navigate("/")}}>Logout</Menu.Item>
      </Menu>
    );
  
    return (
      <Dropdown overlay={menu} visible={visible} placement="bottomLeft" onClick={()=>setVisible(!visible)}>
        <div className='user-avatar' style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <Avatar size={"large"}>{employeeDetail.firstname[0]+ " " +employeeDetail?.lastname[0]}</Avatar>
          <span style={{ marginLeft: '8px' }}>{employeeDetail.firstname}</span>
          {/* <DownOutlined style={{ marginLeft: '8px' }} /> */}
        </div>
      </Dropdown>
    );
  };


export function Navbar(){
    const [visible, setVisible] = useState(false);

    const [isWindowMaximized, setWindowMaximized] = useState(true);
    const [placeholder, setPlaceholder] = useState(false);
    const navigate = useNavigate();
    const {pathname} = useLocation();

    const {data, loading, refetch: refetchAuthUser} = useQuery(GetUserByEmpIdQuery, {
        fetchPolicy: 'network-only',
        variables:{
            employeeId: localStorage.getItem('employeeId')
        },
        skip: !localStorage.getItem('employeeId')
    });

    
    const dispatch = useDispatch();

    useEffect(()=>{
        if(data?.getUserByEmpId?.response){
            // we have to deal the property with userRole and not permission (preDefine Role)
            if((data?.getUserByEmpId?.response[0]?.userRolePermission?.length>0)){
                const user = {
                    ...data?.getUserByEmpId?.response[0],
                    permission: data?.getUserByEmpId?.response[0]?.userRolePermission[0]?.permission,
                }
                delete user?.userRolePermission;
                dispatch(setAuthUserDetail(user));

            }else{
                console.log(data?.getUserByEmpId?.response, "data?.getUserByEmpId?.response")
                dispatch(setAuthUserDetail(data?.getUserByEmpId?.response[0]));
            }
            dispatch(setAuthUserRefresh(refetchAuthUser));
            console.log(data?.getUserByEmpId?.response[0]?.userAccessType, "data?.getUserByEmpId?.response[0]?.userRolePermission[0]?.permission")
        }
    },[data?.getUserByEmpId?.response]);

    const {authenticatedUserDetail} = useSelector(state=>state.userAuthReducer);
    console.log(authenticatedUserDetail, "authenticatedUserDetail")
    const IsBranchView = authenticatedUserDetail?.permission?.Branch?.view!=="None";
    const IsEmployeeView = authenticatedUserDetail?.permission?.Employee?.view!=="None";
    
    useEffect(()=>{
        if(pathname.includes('branch') && !IsBranchView){
            navigate("/error");
        }else if(pathname.includes('employee') && !IsEmployeeView){
            navigate('/error')
        }
    }, [authenticatedUserDetail?.permission])


    return(
    <Layout>
        <Menu mode="horizontal" theme="dark" className='top-menu-layout' triggerSubMenuAction="click">
            <Menu.Item>
                <img src={logo} style={{width:'30px', height:'30px', borderRadius:'4px'}}  className='menu-icon' />
            </Menu.Item>

            {IsEmployeeView?
                <Menu.Item onClick={()=>navigate("/user/employee")} key="employee" className='menu-item'>Employee</Menu.Item>
                :
            null
            }
            
            <Menu.Item key="site" className='menu-item'>Site</Menu.Item>
            <Menu.Item key="schedule" className='menu-item'>Schedule</Menu.Item>
            <Menu.Item key="timeline" className='menu-item'>Timeline</Menu.Item>
            <SubMenu title={<span>More <span className='caret-white'></span></span>} key="more" >
                {IsBranchView?
                    <Menu.Item onClick={()=>navigate("/user/branch")} key="more" className='menu-item'>Branches</Menu.Item>
                    : null
                }
                <Menu.Item onClick={()=>navigate("/user/sitegroup")} key="more" className='menu-item'>Site Groups</Menu.Item>
                <Menu.Item onClick={()=>navigate("/user/customer")} key="more" className='menu-item'>Customers</Menu.Item>
                
            </SubMenu>
            
            <Menu.Item className='search' key="search" style={{margin: 'auto', background:"none !important", backgroundColor: 'none !important',}}>
            <Space style={{background:"none", marginLeft: '-14%' }}>
                <Input
                    suffix={<SearchOutlined />}
                    placeholder={placeholder? "Employees, Sites, Schedule" : "Search"}
                    className='menu-searchbar'
                    onClick={()=>setPlaceholder(true)}
                    onBlur={()=>setPlaceholder(false)}
                />
            </Space>
            </Menu.Item>
            
            {/* {data?.getUserByEmpId?.response[0]?.userAccessType===accessType.AdminPermission? */}

            <Menu.Item className='menu-item '>
                <Link to="/setting">
                    <FontAwesomeIcon icon={faGear} className='menu-icon' />
                </Link>
            </Menu.Item>
            {/* // :null} */}
            
            
            <Menu.Item className='menu-item '>
                <FontAwesomeIcon icon={faBell} className='menu-icon'  />
            </Menu.Item>

            <Menu.Item className='menu-item '>
                <FontAwesomeIcon icon={faComments}  className='menu-icon' />
            </Menu.Item>

            <Menu.Item>
                <div className='vertical-separator'></div>
            </Menu.Item>

            <Menu.Item>
                <UserMenu visible={visible} employeeDetail={authenticatedUserDetail?.employeeDetail[0]} setVisible={setVisible} />
            </Menu.Item>

            {/* <SubMenu key="account" icon={<WordLetterAvatar word={"Muhammad Safyan"} />} title={"Safyan"} >
                <Menu.Item key="profile">Profile</Menu.Item>
                <Menu.Item key="logout" icon={<LogoutOutlined />}>
                    Logout
                </Menu.Item>
            </SubMenu> */}

            {/* mini max btn */}
            {/* <Menu.Item style={{marginTop:'-1%'}}  key="minimize" className='minimize' id="minimize" itemRef='minimize'> <FontAwesomeIcon icon={faWindowMinimize} /> </Menu.Item>
            
            <Menu.Item key="maximize" id="maximize" onClick={()=>setWindowMaximized(!isWindowMaximized)}> 
            {isWindowMaximized ? 
                <FontAwesomeIcon icon={faWindowRestore} />
                :
                <FontAwesomeIcon icon={faWindowMaximize} />
            }
            </Menu.Item>

            <Menu.Item key="close" className='menu-close' id="close"> <CloseOutlined /> </Menu.Item>
             */}
        </Menu>

    </Layout> 
    )
}