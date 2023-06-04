import { useState } from 'react';
import { Menu, Input, Space, Avatar, Layout, Header } from 'antd';
import {
  SearchOutlined,
  MoreOutlined,
  LogoutOutlined,
  CloseOutlined,
} from '@ant-design/icons';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faWindowRestore, faWindowMaximize, faWindowMinimize} from '@fortawesome/free-regular-svg-icons';
import WordLetterAvatar from '../avatar';
import logo from '../../assets/img/wc-logo-big.png';


const { SubMenu } = Menu;

export function Navbar(){
    const [isWindowMaximized, setWindowMaximized] = useState(true);
    return(
    <Layout>
        <Menu mode="horizontal" theme="dark">
            <Menu.Item>
                <img src={logo} style={{width:'25px'}}/>
            </Menu.Item>

            <Menu.Item key="employee">Employee</Menu.Item>
            <Menu.Item key="site">Site</Menu.Item>
            <Menu.Item key="schedule">Schedule</Menu.Item>
            <Menu.Item key="timeline">Timeline</Menu.Item>
            <Menu.Item key="more">More</Menu.Item>
            
            <Menu.Item key="search" style={{margin: 'auto', backgroundColor: 'none !important'}}>
            {/* <Space> */}
                {/* <Input
                prefix={<SearchOutlined />}
                placeholder="Search"
                /> */}
            {/* </Space> */}
            </Menu.Item>

            <Menu.Item className='' style={{margin: '', backgroundColor: 'none !important'}}>
                <Input
                    prefix={<SearchOutlined />}
                    placeholder="Search"
                />
            </Menu.Item>

            <Menu.Item className='menu-more'>
                <MoreOutlined />
            </Menu.Item>

            <SubMenu key="account" icon={<WordLetterAvatar word={"Muhammad Safyan"} />} >
                <Menu.Item key="profile">Profile</Menu.Item>
                <Menu.Item key="logout" icon={<LogoutOutlined />}>
                    Logout
                </Menu.Item>
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