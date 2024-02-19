import React,{ useEffect, useRef, useState } from 'react';
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
import { faBell, faCheck, faChevronDown, faComment, faComments, faEllipsisVertical, faGear, faListDots, faRing } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './navbar.css';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import { GetUserByEmpIdQuery } from '../../util/query/user.query';
import { useDispatch } from 'react-redux';
import { resetAuthUserDetail, setAuthUserDetail, setAuthUserRefresh } from '../../middleware/redux/reducers/userAuth.reducer';

import { resetAllReducerState } from '../../middleware/redux/resetAll';
import { deactiveSessionMutation } from '../../util/mutation/userAccess.mutation';
import { handelSearchFilter, resetSearchState, setSearchQuery, setSearchViewModal } from '../../middleware/redux/reducers/search.reducer';
import { SearchView } from '../searchView/searchView';
import { ThemeMutation } from '../../util/mutation/theme.mutation';
import { themeQuery } from '../../util/query/theme.query';
import Spinner from '../spinner';


const { SubMenu } = Menu;



const UserMenu = ({visible, setVisible, employeeDetail, handelLogout, selectedTheme, setThemeToChange, setMoreOption}) => {

    const themes = ['#2e3f50', '#008080', '#673ab7', '#708090', '#FF6B6B'];
    const navigate = useNavigate();

    const menu = (
      <Menu id="profile-menu" style={{width: '290px', borderRadius:'0', border:'1px solid #cbd6e2', marginTop:'-2px',}}>
       
        <div style={{padding: '10px 8px 10px 8px',}}>
            <div className='user-avatar' style={{display:'flex',  alignItems:'start', gap:'15px'}}> 
                <Avatar size={"large"}>{employeeDetail?.firstname[0]+" "+employeeDetail.lastname[0]}</Avatar>
                <div>
                    <div style={{fontSize:'14px', fontWeight:'600'}}>{employeeDetail?.firstname+" "+employeeDetail.lastname}</div>
                    <div className='text' style={{margin:0, color:'#7c98b6'}}>{employeeDetail?.metadata?.email}</div>
                    <div className='prev-btn' onClick={()=>{navigate("/user/perference");setVisible(false)}}>Profile & Preferences</div>
                </div>
            </div>


        </div>
        <Menu.Divider />

        <Menu.Item key="1" className='theme-section'>
            <span>Themes</span>
            <div className="theme">
                {
                    themes?.map((theme)=>
                        <div onClick={()=>setThemeToChange(theme)} className='color-shade' style={{background:theme}}>
                           {selectedTheme==theme && <FontAwesomeIcon icon={faCheck}/>}
                        </div>
                    )
                }
            </div>
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item key="2" >Report a problem</Menu.Item>
        <Menu.Item key="3" onClick={handelLogout}>Logout</Menu.Item>
      </Menu>
    );
  
    return (
      <Dropdown overlay={menu} visible={visible} placement="bottomLeft" onClick={()=>{setVisible(!visible);setMoreOption(false);}}>
        <div className='user-avatar' style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <Avatar size={"large"}>{employeeDetail?.firstname[0]+ " " +employeeDetail?.lastname[0]}</Avatar>
          <span style={{ marginLeft: '8px' }}>{employeeDetail?.firstname}</span>
          <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: '8px' }} />
        </div>
      </Dropdown>
    );
};


export function Navbar({themeData, themeLoading, refetchTheme}){

    const [visible, setVisible] = useState(false);
    const {authenticatedUserDetail} = useSelector(state=>state.userAuthReducer);   
    const [selectedTheme, setSelectedTheme] = useState(themeData?.getThemeByUserId?.color);
    
    useEffect(()=>{
        refetchTheme();
    },[refetchTheme]);


    useEffect(()=>{
        if(themeData?.getThemeByUserId?.color){
            setSelectedTheme(themeData?.getThemeByUserId?.color);

        }
    }, [themeData?.getThemeByUserId?.color]);
    

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


    const [openSearchOption, setOpenSearchOption] = useState(false);

    // set theme for specific user
    const [setTheme] = useMutation(ThemeMutation);
    const [themeToChange, setThemeToChange] = useState("");

    const upsertTheme = async ()=>{
        await setTheme({
            variables:{
                input:{
                    userId: authenticatedUserDetail?._id,
                    color: themeToChange
                }
            }
        });
        // await refetchTheme();
    };

    useEffect(()=>{
        if(themeToChange){
            upsertTheme();
            setSelectedTheme(themeToChange);
            localStorage.setItem('color', themeToChange);
        }
    },[themeToChange]);

    const [moreOption, setMoreOption] = useState(false);

    // handel navigation due to search dialogue
    const handelNavigate = (path)=>{
        dispatch(resetSearchState());
        setVisible(false);
        setMoreOption(false);
        navigate(path);
    }

    // search dropdown

    // Event listener to close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Get the dropdown DOM node
            if (!event.target.closest('.ant-dropdown') && !event.target.closest('.ant-input-suffix')) {
                setOpenSearchOption(false);
              
            }

            if(!event.target.closest('.ant-dropdown') && !event.target.closest('.ant-dropdown-trigger')){
                setVisible(false);
                setMoreOption(false);
            }   

            if( !event.target.closest('.searchViewModalParent') && !event.target.closest(".search") && !event.target.closest('.ant-dropdown') && !event.target.closest('.ant-input-suffix') ){
                dispatch(resetSearchState());
                setPlaceholder(false);
            }


        };
    
        // Add the event listener
        document.addEventListener('click', handleClickOutside);
    
        // Clean up
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return(
        themeLoading?
        null
        :
        <Layout style={{marginBottom:'50px'}}>
            <Menu mode="horizontal" theme="dark" className='top-menu-layout' triggerSubMenuAction="click" 
                style={isModalOpen?{zIndex:1, background: localStorage.getItem('color') || selectedTheme}:{background: localStorage.getItem('color') ||selectedTheme}}
            >
                <Menu.Item>
                    <img src={logo} style={{width:'30px', height:'30px', borderRadius:'4px'}}  className='menu-icon' />
                </Menu.Item>

                {IsEmployeeView?
                    <Menu.Item onClick={()=>handelNavigate("/user/employee")} key="employee" className='menu-item'>Employee</Menu.Item>
                    :
                null
                }
                
                <Menu.Item key="site" className='menu-item'>Site</Menu.Item>
                <Menu.Item key="schedule" className='menu-item'>Schedule</Menu.Item>
                <Menu.Item key="timeline" className='menu-item'>Timeline</Menu.Item>
                
                <Menu.Item  key="more">
                    
                    <Dropdown overlay={
                        <Menu id="profile-menu" className='more-menu' style={{width: '290px', borderRadius:'0', marginTop:'12px', color: 'white', background: localStorage.getItem('color') || selectedTheme}}>
                            {IsBranchView?
                                <Menu.Item key="branch" onClick={()=>{handelNavigate("/user/branch"); setMoreOption(false);}}className='menu-item'>Branches</Menu.Item>
                                : null
                            }
                            <Menu.Item key="siteGrp" onClick={()=>handelNavigate("/user/sitegroup")} className='menu-item'>Site Groups</Menu.Item>
                            <Menu.Item key="customer" onClick={()=>handelNavigate("/user/customer")} className='menu-item'>Customers</Menu.Item>
                        </Menu>
                    } visible={moreOption} placement="bottomLeft" onClick={()=>{ setMoreOption(!moreOption); setVisible(false); }}>
                        <span>More <span className='caret-white'></span></span>
                    </Dropdown>

                   
                </Menu.Item>
                
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
                            } visible={openSearchOption} placement="bottomLeft"

                            >
                                <FontAwesomeIcon style={{margin:'0 5px', color: localStorage.getItem('color') || selectedTheme}} icon={faEllipsisVertical} onClick={()=>{setOpenSearchOption(!openSearchOption);  setVisible(false);
                                setMoreOption(false);}}/> 
                            </Dropdown>
                            
                            : <SearchOutlined style={{margin:'0 5px', color: localStorage.getItem('color') || selectedTheme}} />}
                            placeholder={placeholder? "Employees, Sites, Schedule" : "Search"}
                            className='menu-searchbar'
                            onClick={()=>{setPlaceholder(true); dispatch(setSearchViewModal(true));}}
                            onChange={(e)=>dispatch(setSearchQuery(e.target.value))}
                            value={query}
                            prefix={placeholder?<SearchOutlined style={{margin:'0 5px', color: localStorage.getItem('color') || selectedTheme}} />:null}
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
                    <UserMenu selectedTheme={selectedTheme} setThemeToChange={setThemeToChange} visible={visible} handelLogout={handelLogout} employeeDetail={authenticatedUserDetail?.employeeDetail[0]} setVisible={setVisible} setMoreOption={setMoreOption} />
                </Menu.Item>
                : null}
            
            </Menu>

            {
                isModalOpen && <SearchView setPlaceholder={setPlaceholder} />
            }

        </Layout> 
    )
}