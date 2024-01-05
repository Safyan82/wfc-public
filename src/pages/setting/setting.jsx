import '../../components/createFields/createFieldDrawer.css';
import "./setting.css";
import React from 'react';
import { Col, Popover, Row } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Outlet } from "react-router-dom";
import { Navbar } from '../../components/navbar';
import { routes } from '../../util/routes/routes';


export const Setting = ()=>{
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const active = 'setting-sidebar-nav-list-item setting-navbar-active';
    const inactive = 'setting-sidebar-nav-list-item';
    return(
        <>
            <Navbar/>
            <div style={{display:'flex'}}>
            <div className='setting-sidebar'>
                    <div className='setting-sidebar-body'>
                        <div className="setting-sidebar-inner">
                            <div className='back-link' onClick={()=>navigate(-1)}>
                                <FontAwesomeIcon className='icon' icon={faChevronLeft}/>
                                <span >Back</span>
                            </div>
                            <div className="setting-heading">
                                <div className='setting-header-title'>
                                    Setting
                                </div>
                                <div style={{lineHeight:'33px'}}>
                                    <Popover content="Search settings">
                                        <FontAwesomeIcon icon={faSearch} className='setting-heading-icon' />
                                    </Popover>
                                </div>
                            </div>
                            <nav>
                                <div className='setting-sidebar-nav'>Your Preferences</div>
                                <ul className='setting-sidebar-nav-list'>
                                    <li className='setting-sidebar-nav-list-item'>General</li>
                                    <li className='setting-sidebar-nav-list-item'>Notifications</li>
                                    <li className='setting-sidebar-nav-list-item'>Security</li>
                                </ul>
                            </nav>
                            <nav className='nav-divider'>
                                <div className='setting-sidebar-nav'>Account Setup</div>
                                <ul className='setting-sidebar-nav-list'>
                                    <li className='setting-sidebar-nav-list-item'>Account Defaults</li>
                                    <Link to={routes.userRole}><li className={pathname==routes.userRole?active:inactive}>User Roles</li></Link>
                                    <Link to={routes.addUser}><li className={pathname==routes.addUser?active:inactive}>Users & Teams</li></Link>
                                    <Link to={routes.userAccess}><li className={pathname==routes.userAccess?active:inactive}>Users Access Log</li></Link>
                                    <li className='setting-sidebar-nav-list-item'>Privacy & Consent</li>
                                </ul>
                            </nav>
                            <nav className='nav-divider'>
                                <div className='setting-sidebar-nav'>Data Management</div>
                                <ul className='setting-sidebar-nav-list'>
                                    <Link to={routes.setting}><li className={pathname==routes.setting?active:inactive}>Properties</li></Link>
                                    <li className='setting-sidebar-nav-list-item'>Objects</li>
                                    <li className='setting-sidebar-nav-list-item'>Import & Export</li>
                                </ul>
                            </nav>
                        </div>
                    </div>
            </div> 
            {/* <div style={{width: '100%',}}> */}
                <Outlet/>
            {/* </div> */}
            </div>
        </>
    );
}