import '../../components/createFields/createFieldDrawer.css';
import "./setting.css";
import React, { useState } from 'react';
import { Col, Collapse, Popover, Row, Tree } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Outlet } from "react-router-dom";
import { Navbar } from '../../components/navbar';
import { routes } from '../../util/routes/routes';
import { useSelector } from 'react-redux';
import Spinner from '../../components/spinner';


export const Setting = ({themeData, themeLoading, refetchTheme})=>{
    const navigate = useNavigate();
    const {pathname, search} = useLocation();
    const path = pathname+search;

    const active = 'setting-sidebar-nav-list-item setting-navbar-active';
    const inactive = 'setting-sidebar-nav-list-item';
    const {isModalOpen} = useSelector(state => state.searchReducer);


    return(
        themeLoading?
            <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Spinner color={'#ff7a53'} fontSize={80}/>
            </div>
            :
        <>
            <Navbar  themeData={themeData} themeLoading={themeLoading} refetchTheme={refetchTheme} />
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

                            <nav className='setting-custom-nav'>
                                <Collapse  defaultActiveKey={['2','1','3']}>
                                    
                                    <Collapse.Panel key='1' header={<div className='setting-sidebar-nav'>Your Preferences</div>}>
                                        <ul className='setting-sidebar-nav-list'>
                                            <li className='setting-sidebar-nav-list-item'>General</li>
                                            <li className='setting-sidebar-nav-list-item'>Notifications</li>
                                            <li className='setting-sidebar-nav-list-item'>Security</li>
                                        </ul>
                                    </Collapse.Panel>
                                    
                                    <Collapse.Panel key='2'  header={<div className='setting-sidebar-nav'>Account Setup</div>}>    
                                        <ul className='setting-sidebar-nav-list'>
                                            <li className='setting-sidebar-nav-list-item'>Account Defaults</li>
                                            <Link to={routes.userRole}><li className={path==routes.userRole?active:inactive}>User Roles</li></Link>
                                            <Link to={routes.addUser}><li className={path==routes.addUser?active:inactive }>Users & Teams</li></Link>
                                            <Link to={routes.userAccess}><li className={path==routes.userAccess?active:inactive}>Users Access Log</li></Link>
                                            <li className='setting-sidebar-nav-list-item'>Privacy & Consent</li>
                                        </ul>
                                    </Collapse.Panel>

                                    <Collapse.Panel key='3'  header={<div className='setting-sidebar-nav'>Data Management</div>}> 
                                        <ul className='setting-sidebar-nav-list'>
                                            {/* Data fields management */}
                                            <Link to={routes.propertySetting}><li className={path==routes.propertySetting?active:inactive}>Data Fields</li></Link>
                                            <Link to={routes.forms}><li className={path==routes.forms?active:inactive}>Forms</li></Link>
                                            <Link to={routes.editskill}><li className={path==routes.editskill?active:inactive}>Skills</li></Link>

                                            <Collapse accordion defaultActiveKey={['m-1']} style={{paddingBottom:'16px'}}>
                                                {/* modules */}
                                                <Collapse.Panel  key="m-1" header={<div className='setting-sidebar-nav' style={{fontWeight:500, marginLeft:'-11px'}}>Modules</div>}>
                                                    <ul className='setting-sidebar-nav-list' style={{marginTop:'10px', marginLeft:'-17px'}}>
                                                        <Link to={routes.module+"?branch"}><li className={path==routes?.module+"?branch"?active:inactive}>Branch</li></Link>
                                                        <Link to={routes.module+"?employee"}><li className={path==routes?.module+"?employee"?active:inactive}>Employee</li></Link>
                                                        <Link to={routes.module+"?site"}><li className={path==routes?.module+"?site"?active:inactive}>Site</li></Link>
                                                        <Link to={routes.module+"?customer"}><li className={path==routes?.module+"?customer"?active:inactive}>Customer</li></Link>
                                                    </ul>
                                                </Collapse.Panel>

                                                {/*
                                                    Need to implement
                                                    Data  Managment 
                                                    
                                                    - Data Fields
                                                    - Modules
                                                    - Forms (should be clone of same as properties in our/hub sys)
                                                */}

                                            </Collapse>  

                                        </ul>
                                        
                                    </Collapse.Panel>  

                                    <ul className='setting-sidebar-nav-list'>
                                        <Link to={routes.module+"?customer"}><li className={path==routes?.module+"?customer"?active:inactive}>Billing</li></Link>
                                    </ul>                               
                                    
                                </Collapse>
                            </nav>

                        </div>
                    </div>
            </div> 
            <Outlet/> 
            
            </div>
        </>
    );
}

{/* <div style={{width: '100%',}}> */}
                // {isModalOpen? null : 
                // }
                
            {/* </div> */}