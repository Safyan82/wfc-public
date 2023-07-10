import './setting.css';
import '../../components/createFields/createFieldDrawer.css';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Input, Popover, Row, Select, Tabs, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faLock, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Filter } from './settingfilter';
import {SettingPropertyGrid} from './setting-property-grid';
import { SettingGroupPropertyGrid } from './settingGroupGrid';
import { GroupFilter } from './groupfilter';
import { useNavigate } from 'react-router-dom';
import { ArcheiveFilter } from './archeiveFilter';
import { ArcheivePropertyGrid } from './archeiveGrid';
import { CreateFieldDrawer } from '../../components/createFields/index';
import { GroupModal } from './modal/group.modal';
import { GROUPLIST } from '../../util/query/group.query';
import { useQuery } from '@apollo/client';
import { ARCHIVE_PROPERTY_LIST, GetProptyByGroupId, PROPERTYLIST } from '../../util/query/properties.query';
import { EditFieldDrawer } from '../../components/editField/editField.drawer';
import { resetGroup } from '../../middleware/redux/reducers/group.reducer';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { resetPropertyFilterByGroup } from '../../middleware/redux/reducers/properties.reducer';

export const Setting=()=>{
    const  { TabPane } = Tabs;
    const navigate = useNavigate();
    const [fieldModal, setFieldModal] = useState(false);
    const [editfieldModal, setEditFieldModal] = useState(false);
    const [groupmodal, setGroupModal] = useState(false);

    // setting popover 
    
    const [group, setGroupInput] = useState();
    const [groupPopover, setGroupPopover] = useState(false);
    const [fieldType, setFieldType] = useState();
    const [fieldTypePopover, setfieldTypePopover] = useState(false);
    const [user, setUser] = useState();
    const [userPopover, setuserPopover] = useState(false);

    // setting popover terminate

    
    const [archive, setArchive] = useState();
    const [archivePopover, setArchivePopover] = useState(false);
    

    //  tab change
 

    const { loading, error, data, refetch } = useQuery(ARCHIVE_PROPERTY_LIST);
    const { loading:groupLoading, error:groupError, data:groupList , refetch:groupRefetch } = useQuery(GROUPLIST);
    const { loading:propertyListLoading, error:propertyListError, data:propertyList , refetch:propertyListRefetch } = useQuery(PROPERTYLIST);
    
    const { groupFilterId } = useSelector(state=>state.propertyReducer);
    const { data: propertyByGroupId } = useQuery(GetProptyByGroupId, {
        variables: { groupId: (groupFilterId)?.toString() || null },
        skip: !groupFilterId,
        fetchPolicy: 'network-only'
  
    });


    const [activeTab, setActiveTab] = useState('1');
    const handelTabChange = async (e)=>{
        setActiveTab(e);
        setGroupPopover(false);
        setuserPopover(false);
        setfieldTypePopover(false);
        setArchivePopover(false);
        await propertyListRefetch();
        await refetch();
        if(e=='2'){
            dispatch(resetPropertyFilterByGroup());
        }
    };

    const dispatch = useDispatch();

    const resetToPropertyTab = async(tab) =>{
        if(tab==1){

            dispatch(resetPropertyFilterByGroup());
            await propertyListRefetch();
        }
    }

    return(
        <Row>
            <Col span={4} className='setting-sidebar'>
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
                                        <FontAwesomeIcon icon={faLock}/> &nbsp; <span className='text-decore'>Data Quality</span>
                                    </button>
                                    <Button className='setting-filled-btn'>
                                        Export all properties
                                    </Button>
                                </div>
                            </div>
                            <div className="text">
                                Properties are used to collect and store information about your records in Wfc. For example, a contact might have properties like First Name or Lead Status.
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
                                        <div className='object-item object-text text-decore'>Go to branch settings</div>
                                    </div>
                                </div>
                            </div>


                            {/* propertie views */}
                            <div className="propertyTab"></div>
                            <Tabs defaultActiveKey="1" onTabClick={resetToPropertyTab} activeKey={activeTab } onChange={handelTabChange}>
                                <TabPane tab={`Properties (${groupFilterId?.length ?  propertyByGroupId?.getPropertyByGroupId?.length || 0 :  propertyList?.propertyList?.length || 0})`} key="1">
                                    <Filter 
                                        group={group}
                                        groupPopover={groupPopover}
                                        fieldType={fieldType}
                                        fieldTypePopover={fieldTypePopover}
                                        user={user}
                                        userPopover={userPopover}

                                        propertyListRefetch={propertyListRefetch}
                                        
                                        setGroupPopover={setGroupPopover}
                                        setGroupInput={setGroupInput}
                                        setFieldType={setFieldType}
                                        setfieldTypePopover={setfieldTypePopover}
                                        setUser={setUser}
                                        setuserPopover={setuserPopover}

                                        editProperty={()=>setFieldModal(true)}
                                    />
                                    <SettingPropertyGrid
                                        propertyList={groupFilterId? propertyByGroupId?.getPropertyByGroupId :propertyList?.propertyList}
                                        propertyListRefetch={propertyListRefetch}
                                        propertyListLoading={propertyListLoading}
                                        refetch={refetch}
                                        setFieldModal={setFieldModal}
                                        setEditFieldModal={setEditFieldModal}
                                    />
                                </TabPane>
                            <TabPane tab="Group" key="2">
                                <GroupFilter setGroupModal={()=>setGroupModal(true)}/>
                                <SettingGroupPropertyGrid
                                    groupList={groupList}
                                    groupLoading={groupLoading}
                                    groupRefetch={groupRefetch}
                                    editGroup={()=>setGroupModal(true)}
                                    setActiveTab={setActiveTab}
                                />
                            </TabPane>
                            <TabPane tab={`Archived Properties (${data?.getArchiveProperties?.length || 0})`} key="3" onClick={(e)=>console.log(e)}>
                                <ArcheiveFilter
                                    archive={archive}
                                    setArchive={setArchive}
                                    archivePopover={archivePopover}
                                    setArchivePopover={setArchivePopover}

                                />
                                <Alert
                                    description={<b>After 90 days your custom properties will be deleted and can no longer be restored.</b>}
                                    type="info"
                                    closable
                                    closeText={<FontAwesomeIcon style={{fontSize: '16px',color: '#7c98b6'}} icon={faTimes}/>}
                                />
                                <ArcheivePropertyGrid 
                                    data={data}
                                    refetch={refetch}
                                    propertyListRefetch={propertyListRefetch}

                                />
                            </TabPane>
                            </Tabs>

                            {/* filter */}
                            

                        </div>
                    </div>
                </div>
        
            {fieldModal && <CreateFieldDrawer 
                visible={fieldModal}  
                propertyListRefetch={propertyListRefetch}
                onClose={()=>setFieldModal(false)}
            />}
            
            {editfieldModal && <EditFieldDrawer 
                groupList={groupList}
                groupLoading={groupLoading}
                visible={editfieldModal}  
                propertyListRefetch={propertyListRefetch}
                onClose={()=>setEditFieldModal(false)}
            />}
            
            <GroupModal 
                groupRefetch={groupRefetch} 
                visible={groupmodal} 
                onClose={()=>{setGroupModal(false); dispatch(resetGroup({}))}} 
            />

        </Row>
    );
};