import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRectangleList, faUsers, faCodeCompare, faObjectGroup} from '@fortawesome/free-solid-svg-icons'
import { faBuilding, faClone } from '@fortawesome/free-regular-svg-icons';

const { Sider, Content } = Layout;

const Sidebar = ({children}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(200);

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setCollapsed(true);
      setSidebarWidth(0);
    } else {
      setCollapsed(true);
      setSidebarWidth(200);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Layout style={{ minHeight: 'auto' }} >
      <Sider
        width={sidebarWidth}
        // collapsible
        collapsed={collapsed}
        onCollapse={handleToggleCollapse}
        className='sidebarLayout'
      >
        <div className="logo" />
        <Menu theme="light" mode="inline" >
            
          <Menu.Item key="1" icon={<FontAwesomeIcon icon={faUsers} className='sidebarIcon'/>}>
            Employees
          </Menu.Item>
          <Menu.Item key="2" icon={<FontAwesomeIcon icon={faClone} className='sidebarIcon'/>}>
            Sites
          </Menu.Item>
          <Menu.Item key="3" icon={<FontAwesomeIcon icon={faRectangleList} className='sidebarIcon'/>}>
            Timeline
          </Menu.Item>
          {/* <Menu.Item key="4" icon={<FontAwesomeIcon icon={faCalendarCheck} className='sidebarIcon'/>}>
            Schedule
          </Menu.Item> */}
          
          <Menu.Item key="5" icon={<FontAwesomeIcon icon={faCodeCompare} className='sidebarIcon'/>} className='check-update'>
            Check Updates
          </Menu.Item>

        </Menu>
      </Sider>
      <Layout>
        <Content style={{ padding: '16px' }}>
            {children}
            {/* <Layout.Footer style={{ textAlign: 'center' }}>Work Force City  &copy; 2023</Layout.Footer> */}
        </Content>
      </Layout>

    </Layout>
  );
};

export default Sidebar;
