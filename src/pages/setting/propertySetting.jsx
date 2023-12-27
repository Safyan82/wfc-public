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
import { ARCHIVE_PROPERTY_LIST, GetProptyByGroupId, PROPERTYLIST, PROPERTYWITHFILTER } from '../../util/query/properties.query';
import { EditFieldDrawer } from '../../components/editField/editField.drawer';
import { resetGroup } from '../../middleware/redux/reducers/group.reducer';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { resetPropertyFilterByGroup } from '../../middleware/redux/reducers/properties.reducer';
import { resetArchivePropertyFilteredData } from '../../middleware/redux/reducers/archiveProperty.reducer';
import { MoveGroupModal } from './modal/moveGroup.modal';
import { objectType } from '../../util/types/object.types';

export const PropertySetting=()=>{
    const  { TabPane } = Tabs;
    const [fieldModal, setFieldModal] = useState(false);
    const [editfieldModal, setEditFieldModal] = useState(false);
    const [propertyFakeLoad, setPropertyFakeLoading] = useState(false);
    const [groupmodal, setGroupModal] = useState(false);
    const [objectTypelocal, setObjectType] = useState("Branch");


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
 
    
    const [field, setField] = useState([
        {field:'groupId', value: ''},
        {field:'fieldType', value: '' },
        {field: 'objectType', value: 'branch'},
    ]);
    const [value, setValue] = useState(null);


    useEffect(()=>{
        // alert(group?.id);
        if(group && group?.name!="All groups"){
            setField(field?.map((f)=> {
                if(f.field=='groupId'){
                    return {...f, value: group?.id};
                }else{
                    return f;
                }
            }))
            
        }else{
            setField(field?.map((f)=> {
                if(f.field=='groupId'){
                    return {field:'groupId', value: ''};
                }else{
                    return f;
                }
            }))
        }
    },[group])

    useEffect(()=>{
        if(fieldType && fieldType!=="All field types"){
            let  selectedType = ((fieldType?.replaceAll("-",""))?.replaceAll(" ",""))?.toLowerCase();
            selectedType= selectedType=="multilinetext"? "multilineText" : selectedType==="singlelinetext"? "singlelineText": selectedType;
            
            setField(field?.map((f)=> {
                if(f.field=='fieldType'){
                    return {...f, value: selectedType};
                }else{
                    return f;
                }
            }));

        }else{
            
            setField(field?.map((f)=> {
                if(f.field=='fieldType'){
                    return {field:'fieldType', value: ''};
                }else{
                    return f;
                }
            }));
        }
    },[fieldType])

    // clear pagination
    useEffect(()=>{
        localStorage.removeItem('currPropPage');
    },[]);


    const [archiveList, setArchiveList] = useState([]);

    const { loading:archiveloading, error, data, refetch } = useQuery(ARCHIVE_PROPERTY_LIST,{
        fetchPolicy: 'network-only',
        variables:{
            objectType: objectTypelocal
        }
    });
    const { loading:groupLoading, error:groupError, data:groupList , refetch:groupRefetch } = useQuery(GROUPLIST,{
        variables:{
            objectType: objectTypelocal
        },
        skip: !objectTypelocal,
        fetchPolicy: 'network-only'
    });
    const { loading:propertyListLoading, error:propertyListError, data:propertyDataList , refetch:propertyListRefetch } = useQuery(PROPERTYWITHFILTER,{
        variables:{
            input:{fields: field}
        },
        skip: !objectTypelocal,
        fetchPolicy: 'network-only'
    });

    useEffect(()=>{
        setArchiveList(data);
    },[data]);

    

    const {archiveFilteredData, isFilterActive, isloading} = useSelector(state=>state.archiveReducer);

    useEffect(()=>{
        if(isFilterActive){
            setArchiveList(archiveFilteredData);
        }else{
            setArchiveList(data);
        }
    },[isFilterActive]);

    
    const [propertyList, setPropertyList] = useState([]);
    const [jerkLoad, setJerkLoad] = useState(false);
    useEffect(()=>{
        setJerkLoad(true);
        if(propertyDataList && Object.keys(propertyDataList?.getPropertywithFilters)){
            setPropertyList([...propertyDataList?.getPropertywithFilters]);
        };
        setTimeout(()=>{

            setJerkLoad(false);
        },500);
    },[propertyDataList]);


    
    useEffect(()=>{
        if(editfieldModal==false && (propertyListLoading==false && jerkLoad==false)){
           
            console.log(propertyListLoading, jerkLoad, "Lllllllll")
           setPropertyFakeLoading(false);
           
        }
    },[propertyListLoading, jerkLoad])


    const { groupFilterId } = useSelector(state=>state.propertyReducer);

    useEffect(()=>{
        if(groupFilterId && Object.keys(groupFilterId)){
            setGroupInput({id: groupFilterId?.key, name: groupFilterId?.name});
        }
    }, [groupFilterId]);

    useEffect(()=>{
        console.log("mounted again");
    },[]);
   

    const [activeTab, setActiveTab] = useState('1');
    const handelTabChange = async (e)=>{
        setActiveTab(e);
        setGroupPopover(false);
        setuserPopover(false);
        setfieldTypePopover(false);
        setArchivePopover(false);
        console.log(objectTypelocal, "objectTypeLocal");
        await propertyListRefetch();
        await refetch();
        if(e=='2'){
            dispatch(resetPropertyFilterByGroup());
        }
        if(e=='3'){
            dispatch(resetArchivePropertyFilteredData(false));
            await refetch()
        }
    };

    const dispatch = useDispatch();

    const resetToPropertyTab = async(tab) =>{
        if(tab=='1'){
            
            setField([
                {field:'groupId', value: ''},
                {field:'fieldType', value: '' },
                {field:'objectType', value: objectTypelocal }
            ]);
            dispatch(resetPropertyFilterByGroup());
            setGroupInput({name: 'All groups', id: null});
            setFieldType('All field types');
            await propertyListRefetch();
        }
        
        if(tab=='3'){
            dispatch(resetArchivePropertyFilteredData(false));
            await refetch()
        }
        if(tab=='2'){
            await groupRefetch();
        }
    }

    useEffect(()=>{
        if(objectTypelocal){
            setField(field?.map((f)=> {
                if(f.field=='objectType'){
                    return {...f, value: objectTypelocal};
                }else{
                    return f;
                }
            }));
        }
    }, [objectTypelocal]);

    return(
        <>
            

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
                            Properties are used to collect and store information about your records in WorkForce City. For example, a contact might have properties like First Name or Lead Status.
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
                                            defaultValue={"Branch"}
                                            onChange={(e)=>setObjectType(e)}
                                        >
                                            {
                                                Object.keys(objectType)?.map((object)=>(

                                                    <Select.Option value={objectType[object]}>{objectType[object]} properties</Select.Option>
                                                ))
                                            }
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
                            <TabPane tab={`Properties (${propertyList?.length || 0})`} key="1">
                                <Filter 
                                    group={group}
                                    groupPopover={groupPopover}
                                    fieldType={fieldType}
                                    fieldTypePopover={fieldTypePopover}
                                    user={user}
                                    userPopover={userPopover}
                                    groupList={groupList?.groupList}
                                    propertyListRefetch={propertyListRefetch}
                                    propertyList={propertyList}
                                    setPropertyList={setPropertyList}
                                    resetSearch={propertyDataList?.getPropertywithFilters}
                                    setGroupPopover={setGroupPopover}
                                    setGroupInput={setGroupInput}
                                    setFieldType={setFieldType}
                                    setfieldTypePopover={setfieldTypePopover}
                                    setUser={setUser}
                                    setuserPopover={setuserPopover}

                                    editProperty={()=>setFieldModal(true)}
                                />
                                <SettingPropertyGrid
                                    propertyList={propertyList}
                                    propertyListRefetch={propertyListRefetch}
                                    propertyListLoading={propertyFakeLoad? false : propertyListLoading || jerkLoad}
                                    refetch={refetch}
                                    setFieldModal={setFieldModal}
                                    setEditFieldModal={setEditFieldModal}
                                    groupList={groupList}
                                    objectType={objectTypelocal}

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
                                objectType={objectTypelocal}

                            />
                            <Alert
                                description={<b className='info-alert'>After 90 days your custom properties will be deleted and can no longer be restored.</b>}
                                type="info"
                                closable
                                closeText={<FontAwesomeIcon  className='alert-close-icon' icon={faTimes}/>}
                            />
                            <ArcheivePropertyGrid 
                                data={archiveFilteredData || data?.getArchiveProperties}
                                loading={isloading || archiveloading || propertyListLoading}
                                refetch={refetch}
                                propertyListRefetch={propertyListRefetch}
                                objectType = {objectTypelocal}

                            />
                        </TabPane>
                        </Tabs>

                        {/* filter */}
                        

                    </div>
                </div>
            </div>
        
            <CreateFieldDrawer 
                visible={fieldModal}  
                objectType={objectTypelocal}
                propertyListRefetch={propertyListRefetch}
                onClose={()=>{propertyListRefetch();setPropertyFakeLoading(true); groupRefetch(); setFieldModal(false);}}
            />
            
            

            <EditFieldDrawer 
                groupList={groupList}
                groupLoading={groupLoading}
                visible={editfieldModal}  
                propertyListRefetch={propertyListRefetch}
                onClose={()=>{
                    setPropertyFakeLoading(true);
                    propertyListRefetch();                    
                    setEditFieldModal(false);

                }}
            />
            
            <GroupModal 
                groupRefetch={groupRefetch} 
                objectType={objectTypelocal}
                visible={groupmodal} 
                onClose={()=>{setGroupModal(false); dispatch(resetGroup({}))}} 
            />


        </>
    );
};