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

                            <nav>
                                <Collapse  defaultActiveKey={['2', '3']}>
                                    
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

                                    <Collapse.Panel key='3'  header={<div className='setting-sidebar-nav'>Manage & Customise</div>}> 
                                        <Collapse accordion defaultActiveKey={['m-1']} style={{paddingTop:'16px', paddingBottom:'16px'}}>
                                            {/* branch */}
                                            <Collapse.Panel  key="m-1" header={<div className='setting-sidebar-nav' style={{fontWeight:500}}>Branch</div>}>
                                                <ul className='setting-sidebar-nav-list'>
                                                    {/* <Link to={"#"} onClick={(e)=>e.preventDefault()} className='disabled-text'><li className={inactive}>Tab Customisation</li></Link> */}
                                                    <Link to={routes.propertySetting+"?field=branch"}><li className={path==routes.propertySetting+"?field=branch"?active:inactive}>Edit Fields</li></Link>
                                                    <Link to={routes.branchEditForm}><li className={path==routes?.branchEditForm?active:inactive}>Edit Form</li></Link>
                                                </ul>
                                            </Collapse.Panel>

                                            {/* employee */}
                                            <Collapse.Panel key="m-2" header={<div className='setting-sidebar-nav' style={{fontWeight:500}}>Employee</div>}>
                                                <ul className='setting-sidebar-nav-list'>
                                                    {/* <Link to={"#"} onClick={(e)=>e.preventDefault()}><li className={inactive}>Tab Customisation</li></Link> */}
                                                    <Link to={routes.propertySetting+"?field=employee"}><li className={path==routes.propertySetting+"?field=employee"?active:inactive}>Edit Fields</li></Link>
                                                    <Link to={routes.employeeEditForm}><li className={path==routes?.employeeEditForm?active:inactive}>Edit Form</li></Link>
                                                </ul>
                                            </Collapse.Panel>

                                            {/* site */}
                                            <Collapse.Panel key="m-3" header={<div className='setting-sidebar-nav' style={{fontWeight:500}}>Site</div>}>
                                                <ul className='setting-sidebar-nav-list'>
                                                    {/* <Link to={"#"} onClick={(e)=>e.preventDefault()}><li className={inactive}>Tab Customisation</li></Link> */}
                                                    <Link to={routes.propertySetting+"?field=site"}><li className={path==routes.propertySetting+"?field=site"?active:inactive}>Edit Fields</li></Link>
                                                    <Link to={"#"} onClick={(e)=>e.preventDefault()}><li className={inactive}>Edit Form</li></Link>
                                                </ul>
                                            </Collapse.Panel>

                                            {/* customer */}
                                            <Collapse.Panel key="m-4" header={<div className='setting-sidebar-nav' style={{fontWeight:500}}>Customer</div>}>
                                                <ul className='setting-sidebar-nav-list'>
                                                    {/* <Link to={"#"} onClick={(e)=>e.preventDefault()}><li className={inactive}>Tab Customisation</li></Link> */}
                                                    <Link to={routes.propertySetting+"?field=customer"}><li className={path==routes.propertySetting+"?field=customer"?active:inactive}>Edit Fields</li></Link>
                                                    <Link to={"#"}  onClick={(e)=>e.preventDefault()}><li className={inactive}>Edit Form</li></Link>
                                                </ul>
                                            </Collapse.Panel>


                                        </Collapse>  
                                    </Collapse.Panel>                                 
                                    
                                </Collapse>
                            </nav>

                        </div>
                    </div>
            </div> 
            {/* <div style={{width: '100%',}}> */}
                {isModalOpen? null : <Outlet/>}
                
            {/* </div> */}
            </div>
        </>
    );
}