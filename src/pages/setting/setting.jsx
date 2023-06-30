import './setting.css';
import '../../components/createFields/createFieldDrawer.css';
import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Col, Input, Popover, Row, Select, Tabs, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faLock, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Filter } from './settingfilter';
import {SettingPropertyGrid} from './setting-property-grid';
import { SettingGroupPropertyGrid } from './settingGroupGrid';
import { GroupFilter } from './groupfilter';

export const Setting=()=>{
    const  { TabPane } = Tabs;

    return(
        <Row>
            <Col span={4} className='setting-sidebar'>
                <div className='setting-sidebar-body'>
                    <div className="setting-sidebar-inner">
                        <div className='back-link'>
                            <FontAwesomeIcon className='icon' icon={faChevronLeft}/>
                            <span>Back to Branch</span>
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
                                <li className='setting-sidebar-nav-list-item'>Users & Teams</li>
                                <li className='setting-sidebar-nav-list-item'>Privacy & Consent</li>
                            </ul>
                        </nav>
                        <nav className='nav-divider'>
                            <div className='setting-sidebar-nav'>Data Management</div>
                            <ul className='setting-sidebar-nav-list'>
                                <li className='setting-sidebar-nav-list-item'>Properties</li>
                                <li className='setting-sidebar-nav-list-item'>Objects</li>
                                <li className='setting-sidebar-nav-list-item'>Import & Export</li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </Col>
                <div className="setting-body">
                    <div className="setting-body-inner">
                        <div className='setting-body-inner'>
                            <div className="setting-body-title">
                                <div className='setting-body-inner-title'>
                                    Properties
                                </div>

                                <div className='btn-group'>
                                    <button className='btn-transparent'>
                                        <FontAwesomeIcon icon={faLock}/> &nbsp; Data Quality
                                    </button>
                                    <Button className='setting-filled-btn'>
                                        Export all properties
                                    </Button>
                                </div>
                            </div>
                            <div className="text">
                                Properties are used to collect and store information about your records in HubSpot. For example, a contact might have properties like First Name or Lead Status.
                            </div>
                            {/* object selection box */}
                            <div className="object-selection-box">
                                <div className="objects">

                                    <div className='left-selection-box'>
                                        <div className='object-item'>
                                            Select an object:
                                        </div>
                                        <div className="object-item">
                                            <Select
                                                className='custom-select'
                                                style={{width:'250px'}}
                                                suffixIcon={<span className="dropdowncaret"></span>}
                                                defaultValue={"branch"}
                                            >
                                                <Select.Option value="branch">Branch properties</Select.Option>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="right-selection-box">
                                        <div className='object-item object-text'>Go to branch settings</div>
                                    </div>
                                </div>
                            </div>


                            {/* propertie views */}
                            <div className="propertyTab"></div>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="Properties" key="1">
                                    <Filter/>
                                    <SettingPropertyGrid/>
                                </TabPane>
                            <TabPane tab="Group" key="2">
                                <GroupFilter/>
                                <SettingGroupPropertyGrid/>
                            </TabPane>
                            <TabPane tab="Archeive Properties" key="3" onClick={(e)=>console.log(e)}>
                                Content of Tab Pane 3
                            </TabPane>
                            </Tabs>

                            {/* filter */}
                            

                        </div>
                    </div>
                </div>
        </Row>
    );
};