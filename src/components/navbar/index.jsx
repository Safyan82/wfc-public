import React,{ useEffect, useState } from 'react';
import { Menu, Input, Space, Avatar, Layout, Header, Dropdown, Checkbox } from 'antd';
import {
  SearchOutlined,
  MoreOutlined,
  LogoutOutlined,
  WechatOutlined,
  CloseOutlined,
  DownOutlined,
} from '@ant-design/icons';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import logo from '../../assets/img/wfc-new-logo.png';
import { faBell, faCircleDot, faComment, faComments, faEllipsisVertical, faGear, faListDots, faRing } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './navbar.css';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import { GetUserByEmpIdQuery } from '../../util/query/user.query';
import { useDispatch } from 'react-redux';
import { resetAuthUserDetail, setAuthUserDetail, setAuthUserRefresh } from '../../middleware/redux/reducers/userAuth.reducer';

import { resetAllReducerState } from '../../middleware/redux/resetAll';
import { deactiveSessionMutation } from '../../util/mutation/userAccess.mutation';
import { handelSearchFilter, setSearchQuery, setSearchViewModal } from '../../middleware/redux/reducers/search.reducer';
import { SearchView } from '../searchView/searchView';


const { SubMenu } = Menu;



const UserMenu = ({visible, setVisible, employeeDetail, handelLogout}) => {

    const dispatch = useDispatch();
  
    const navigate = useNavigate();
    const menu = (
      <Menu style={{width: '200px'}}>
        <Menu.Item key="1">Profile</Menu.Item>
        <Menu.Item key="2">Active Session</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3" onClick={handelLogout}>Logout</Menu.Item>
      </Menu>
    );
  
    return (
      <Dropdown overlay={menu} visible={visible} placement="bottomLeft" onClick={()=>setVisible(!visible)}>
        <div className='user-avatar' style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <Avatar size={"large"}>{employeeDetail?.firstname[0]+ " " +employeeDetail?.lastname[0]}</Avatar>
          <span style={{ marginLeft: '8px' }}>{employeeDetail?.firstname}</span>
          <DownOutlined style={{ marginLeft: '8px' }} />
        </div>
      </Dropdown>
    );
  };


export function Navbar(){
    const [visible, setVisible] = useState(false);
    
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
    const IsBranchView = authenticatedUserDetail?.permission?.Branch?.view!=="None";
    const IsEmployeeView = authenticatedUserDetail?.permission?.Employee?.view!=="None";
    
    useEffect(()=>{
        if(pathname.includes('branch') && !IsBranchView){
            navigate("/error");
        }else if(pathname.includes('employee') && !IsEmployeeView){
            navigate('/error')
        }
    }, [authenticatedUserDetail?.permission])

    const [deactiveSession] = useMutation(deactiveSessionMutation);
    const handelLogout = async()=>{
        await deactiveSession({
            variables:{
                deactiveSessionId: localStorage.getItem("deviceId")
            }
        });
        resetAllReducerState();
    }


    // set search query reterive from store here to update the input value
    const {query, isModalOpen, searchFilter} = useSelector(state => state.searchReducer);

    // useEffect(()=>{
    //     if(query?.length>0 && !isModalOpen){
    //         dispatch(setSearchViewModal(true));
    //     }
    // },[query]);

    const [openSearchOption, setOpenSearchOption] = useState(false);

    return(
    <Layout>
        <Menu mode="horizontal" theme="dark" className='top-menu-layout' triggerSubMenuAction="click" 
            style={isModalOpen?{zIndex:1}:{}}
        >
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
                        suffix={placeholder?
                        <Dropdown overlay={
                            <Menu style={{width: '200px', borderRadius:0}}>
                                <Menu.Item key="1">
                                <Checkbox checked={searchFilter?.find((f)=>f=="Branch")} onChange={(e)=>dispatch(handelSearchFilter("Branch"))}>Branch</Checkbox> 
                                </Menu.Item>
                                <Menu.Item key="2">
                                <Checkbox checked={searchFilter?.find((f)=>f=="Employee")}  onChange={(e)=>dispatch(handelSearchFilter("Employee"))}>Employee</Checkbox> 
                                </Menu.Item>
                                <Menu.Item key="3">
                                    <Checkbox checked={searchFilter?.find((f)=>f=="Schedule")}  onChange={(e)=>dispatch(handelSearchFilter("Schedule"))}>Schedule</Checkbox>
                                </Menu.Item>
                                <Menu.Item key="4">
                                    <Checkbox checked={searchFilter?.find((f)=>f=="Site")}  onChange={(e)=>dispatch(handelSearchFilter("Site"))}>Site</Checkbox>
                                </Menu.Item>
                                <Menu.Item key="5">
                                    <Checkbox checked={searchFilter?.find((f)=>f=="Customer")}  onChange={(e)=>dispatch(handelSearchFilter("Customer"))}>Customer</Checkbox>
                                </Menu.Item>
                            </Menu>
                        } visible={openSearchOption} placement="bottomLeft">
                            <FontAwesomeIcon style={{margin:'0 5px'}} icon={faEllipsisVertical} onClick={()=>setOpenSearchOption(!openSearchOption)}/> 
                        </Dropdown>
                        
                        : <SearchOutlined style={{margin:'0 5px'}} />}
                        placeholder={placeholder? "Employees, Sites, Schedule" : "Search"}
                        className='menu-searchbar'
                        onClick={()=>{setPlaceholder(true); dispatch(setSearchViewModal(true));}}
                        onChange={(e)=>dispatch(setSearchQuery(e.target.value))}
                        value={query}
                        prefix={placeholder?<SearchOutlined style={{margin:'0 5px'}} />:null}
                    />
                </Space>

            </Menu.Item>
            
            <Menu.Item className='menu-item '>
                <Link to="/setting">
                    <FontAwesomeIcon icon={faGear} className='menu-icon' />
                </Link>
            </Menu.Item>
            
            
            <Menu.Item className='menu-item '>
                <FontAwesomeIcon icon={faBell} className='menu-icon'  />
            </Menu.Item>

            <Menu.Item className='menu-item '>
                <FontAwesomeIcon icon={faComments}  className='menu-icon' />
            </Menu.Item>

            <Menu.Item>
                <div className='vertical-separator'></div>
            </Menu.Item>
            {authenticatedUserDetail?.employeeDetail?
            <Menu.Item>
                <UserMenu visible={visible} handelLogout={handelLogout} employeeDetail={authenticatedUserDetail?.employeeDetail[0]} setVisible={setVisible} />
            </Menu.Item>
            : null}
           
        </Menu>

        {
            isModalOpen && <SearchView/>
        }

    </Layout> 
    )
}