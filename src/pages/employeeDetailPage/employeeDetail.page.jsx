import "./employeeDetailPage.css";
import { Row, Col } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { DetailPageLeftSideBar } from './leftSideBar/leftSideBar';
import { DetailPageMiddleSection } from './middleSection/middleSection';
import { DetailPageRightSideBar } from './rightSideBar/rightSideBar';
import { useNavigate, useParams } from 'react-router-dom';
import { Notes } from './middleSection/notes/notes';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../middleware/redux/reducers/notification.reducer';
import { EmployeeObjectQuery, getSingleEmployeeRecord } from '../../util/query/employee.query';
import { Loader } from '../../components/loader';
import { updateEmployeeMutation } from '../../util/mutation/employee.mutation';
import Spinner from '../../components/spinner';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HRTab } from "./hr/hr.tab";
import { PayDetailsTab } from "./payDetails/payDetails.tab";
import { CalendarTab } from "./calendar/calendar.tab";


export const EmployeeDetailPage = ()=>{
    const param = useParams();
    const dispatch = useDispatch();

    const {noteToggle} = useSelector(state=>state.noteReducer);

    // get single employee Record
    const {data: singleEmployeeRecord, loading: singleEmployeeLoading, refetch: singleEmployeeRefetch} = useQuery(getSingleEmployeeRecord,{
        variables:{
            id: param?.id
        },
        fetchPolicy: 'network-only'
    });

    const [singleEmployee, setSingleEmployee] = useState([]);
    useEffect(()=>{
        if(!singleEmployeeLoading){
            setSingleEmployee(
                singleEmployeeRecord?.singleEmployee?.response
            );
        }
    },[singleEmployeeRecord]);

    // singleEmployee Record ended

    // Employee Default object
    const {data:employeeSchema, loading: employeeObjectLoading, refetch: employeeObjectRefetch} = useQuery(EmployeeObjectQuery,{fetchPolicy:'network-only'});
    const [employeeObject, setEmployeeObject] = useState([]);
    useEffect(()=>{
        if(!employeeObjectLoading){
            setEmployeeObject(employeeSchema?.getEmployeeObject?.response)  
        }
    },[employeeSchema]);
    // Employee default object terminated


    const [dataFields, setDataFields] = useState([]);
    
    const [refreshProp, setRefreshProp] = useState(false);
    

    const handelInputChange = ({name, value}) => {
        const isExist = dataFields?.find((field)=> field?.name == name);
        const property = employeeObject?.find((prop)=> prop.propertyDetail.label.replaceAll(" ","").toLowerCase() === name)
        // console.log(property, "branchProperties");
        setDataFields(isExist? dataFields?.map((field)=> {
            if(field.name == name){
                return {
                    name, value, propertyId: property?.propertyId,
                }
            }else{
                return field
            }
            
        }): [...dataFields, {name, value, propertyId: property?.propertyId}]);
    };

    const [updateEmployee, {loading, error}]  = useMutation(updateEmployeeMutation);

    const handelUpdateSave = async ()=>{
        try{
            let schemaFields = [];

            dataFields?.map((field)=>{
                if(field.name==="firstname" || field.name==="lastname"  || field.name==="branch"){
                    schemaFields.push(field);
                }
                else{
                    schemaFields.push({...field, metadata:1})
                }
            });

            await updateEmployee({
                variables:{
                    input:{
                        _id: param?.id,
                        properties: schemaFields,
                    }
                }
            });
            dispatch(setNotification({
                message: "Employee Details are Updated Successfully",
                notificationState: true,
                error: false
            }));

            await singleEmployeeRefetch();
            setRefreshProp(false);
            setDataFields([]);
        }
        catch(err){            
            dispatch(setNotification({
                message: "An error encountered while updating employee",
                notificationState: true,
                error: true
            }));
        }
    };

    const navigate = useNavigate();
    const [tabs, setTabs] = useState([
        {title:"Profile", url:''},
        {title:"HR", url:''},
        {title:"Pay Details", url:''},
        {title:"HR Task", url:''},
        {title:"Absense", url:''},
        {title:"Calendar", url:''},
        {title:"Sites Trained/Banned", url:''},
        {title:"Skills", url:''},
        {title:"Premiums", url:''},
        {title:"Custom Fields", url:''},
        {title:"Document Library", url:''},
    ]);

    const [activeTab, setActiveTab] = useState("Profile");
    const [isAction, setAction] = useState(false);
    const containerRef = useRef(null);

    return(
        <div style={{background:'rgb(245, 248, 250)'}}>

        {/* employee dashboard main top navbar  */}
            {/* <div style={{marginBottom:'50px'}}> */}
                <div style={{background: 'white', padding: '15px 45px 7px 15px', display:'flex', gap: '100px', alignItems: 'center', position: 'fixed',  width: '100%', zIndex: '996'}}>
                    
                    {/* back + user name btn */}
                    <div style={{display:'flex', alignItems:'center', gap:'25px', paddingBottom:'8px'}}>

                        <div onClick={()=>navigate(-1)} >
                            <FontAwesomeIcon className='left-chevron-icon' icon={faChevronLeft}/> <span className='text-deco' style={{left: '5%', position: 'relative', fontSize:'14px'}}>Back</span> 
                        </div>

                        <div style={{fontSize:'14px'}}>
                            {singleEmployee?.firstname +" "+ singleEmployee?.lastname}
                        </div>
                    </div>

                    {/* navigation tabs */}
                    <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
                        {tabs?.map((tab)=>(
                            <div className={activeTab==tab.title? 'emp-menubar emp-menubar-active': 'emp-menubar'} onClick={()=>setActiveTab(tab.title)}>{tab.title}</div>
                        ))}
                    </div>

                    
                    <div className="dropdown" ref={containerRef}>

                        <span className='text-deco' onClick={()=>setAction(!isAction)}>Actions<span className='caret'></span></span> 
                        
                        <div  className="dropdown-content dropdown-content-prev" style={isAction ? {display:'block'}: {display:'none'}}>
                            <a href="" onClick={(e)=>{ e.preventDefault(); }}>
                                Edit view
                            </a>
                            <a href="" onClick={(e)=>{ e.preventDefault(); navigate("/user/employee-detail-view/"+singleEmployee?._id)}}>
                                Edit data fields
                            </a>
                            <a href="" onClick={(e)=>{ e.preventDefault(); navigate(`/user/employee-prop-history/`+singleEmployee?._id)}}>
                                Audit log
                            </a>
                            <a href="" onClick={(e)=>{ e.preventDefault(); }}>
                                Generate report
                            </a>
                        </div>
                    </div>

                </div>
            {/* </div> */}

        {/* employee detail page 3 section main employee dashboard */}
            <div style={{padding:'50px 5px 5px 5px'}}>
                
                {/* ProfileTAB */}
                {activeTab.toLowerCase()=="profile"?
                    <div>
                        <Row>
                            {noteToggle?
                            <Notes/>
                            :null}

                            <Col span={6} style={{paddingRight:'0px',
                                maxHeight: 'calc(100vh - 110px)',
                                overflowY: 'auto',
                                transition: 'scroll-behavior 1s',
                                background:'white'
                            }}>
                                {singleEmployee?
                                <DetailPageLeftSideBar 
                                    employeeObject={employeeObject?.map((object)=> ({_id: object.propertyId, ...object.propertyDetail}))}
                                    singleEmployee={singleEmployee}
                                    loading={employeeObjectLoading || singleEmployeeLoading}
                                    handelInputChange={handelInputChange}
                                />:
                                <Loader/>
                                }
                            </Col>
                            <Col span={12}
                            style={{paddingRight:'0px',
                                width:'100%',
                                maxHeight: 'calc(100vh - 110px)',
                                overflowY: 'auto',
                                transition: 'scroll-behavior 1s',
                                background: 'white'
                            }}>
                                <DetailPageMiddleSection  />
                            </Col>
                            <Col span={6} style={{background:'rgb(245, 248, 250)'}}>
                                <DetailPageRightSideBar  />
                            </Col>
                        </Row>
                        {dataFields?.length>0 ?
                        <div className='action-footer'>
                            <button className={loading? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} disabled={loading} onClick={handelUpdateSave}>{loading?<Spinner/>:"Save"}</button>
                            <button className={loading? 'disabled-btn drawer-outlined-btn' : 'drawer-outlined-btn'}  disabled={loading} onClick={()=>{setDataFields([]);setRefreshProp(!refreshProp)}}>Cancel</button>
                            {
                                dataFields?.length?
                                <span className='text' style={{margin: 0}}>You've changed {dataFields?.length} properties</span>
                                : null
                            }
                        </div>
                        : null}
                    </div>
                :
                activeTab.toLowerCase()=="hr"?
                    <HRTab/>
                :
                activeTab.toLowerCase()=="pay details"?
                    <PayDetailsTab/>
                :
                activeTab.toLowerCase()=="calendar"?
                    <CalendarTab/>
                :null
                }

                

            </div>
        </div>
        
    );
}