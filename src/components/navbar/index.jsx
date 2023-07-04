import React,{ useState } from 'react';
import { Menu, Input, Space, Avatar, Layout, Header } from 'antd';
import {
  SearchOutlined,
  MoreOutlined,
  LogoutOutlined,
  WechatOutlined,
} from '@ant-design/icons';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faWindowRestore, faWindowMaximize, faWindowMinimize} from '@fortawesome/free-regular-svg-icons';
import WordLetterAvatar from '../avatar';
import logo from '../../assets/img/wfc-new-logo.png';
import { faBell, faComment, faComments, faGear, faRing } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './navbar.css';


const { SubMenu } = Menu;

export function Navbar(){
    const [isWindowMaximized, setWindowMaximized] = useState(true);
    const [placeholder, setPlaceholder] = useState(false);
    return(
    <Layout>
        <Menu mode="horizontal" theme="dark" className='top-menu-layout' triggerSubMenuAction="click">
            <Menu.Item>
                <img src={logo} style={{width:'30px', height:'30px', borderRadius:'4px'}}  className='menu-icon' />
            </Menu.Item>

            <Menu.Item key="employee" className='menu-item'>Employee</Menu.Item>
            <Menu.Item key="site" className='menu-item'>Site</Menu.Item>
            <Menu.Item key="schedule" className='menu-item'>Schedule</Menu.Item>
            <Menu.Item key="timeline" className='menu-item'>Timeline</Menu.Item>
            <SubMenu title={<span>More <span className='caret-white'></span></span>} key="more" >
                <Link to="/user/branch">
                    <Menu.Item key="more" className='menu-item'>Branches</Menu.Item>
                </Link>
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


            <Menu.Item className='menu-item '>
                <Link to="/user/setting">
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

            <SubMenu key="account" icon={<WordLetterAvatar word={"Muhammad Safyan"} />} title={"Safyan"} >
                {/* <Menu.Item key="profile">Profile</Menu.Item>
                <Menu.Item key="logout" icon={<LogoutOutlined />}>
                    Logout
                </Menu.Item> */}
            </SubMenu>

            {/* <Menu.Item key="minimize" className='minimize' id="minimize" itemRef='minimize'> <FontAwesomeIcon icon={faWindowMinimize} /> </Menu.Item>
            
            <Menu.Item key="maximize" id="maximize" onClick={()=>setWindowMaximized(!isWindowMaximized)}> 
            {isWindowMaximized ? 
                <FontAwesomeIcon icon={faWindowRestore} />
                :
                <FontAwesomeIcon icon={faWindowMaximize} />
            }
            </Menu.Item>

            <Menu.Item key="close" className='menu-close' id="close"> <CloseOutlined /> </Menu.Item> */}

        </Menu>

    </Layout> 
    )
}